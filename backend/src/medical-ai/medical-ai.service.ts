import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const medicalAiSchema = z.object({
  isValid: z
    .boolean()
    .describe(
      'Whether the input actually contains clear medical symptoms or health-related queries',
    ),
  errorMessage: z
    .string()
    .nullable()
    .describe(
      'A polite message asking clarifying questions if isValid is false; null otherwise',
    ),
  summarizedSymptoms: z
    .string()
    .nullable()
    .describe(
      "Short string of extracted keywords (e.g. 'Cold, Fever') or null if not valid",
    ),
  potentialConditions: z
    .array(z.string())
    .describe(
      'Potential conditions (disclaimer: not final diagnosis) or empty list if not valid',
    ),
  prescription: z
    .object({
      medications: z
        .array(
          z.object({
            name: z.string(),
            dosage: z.string(),
            frequency: z.string(),
            duration: z.string(),
          }),
        )
        .describe('List of preliminary medications'),
      instructions: z
        .string()
        .describe('General instructions for taking the meds'),
    })
    .nullable()
    .describe('Preliminary prescription or null if not valid'),
  diagnosticTests: z
    .array(z.string())
    .describe(
      'Suggested necessary diagnostic tests or empty list if not valid',
    ),
  advice: z
    .string()
    .nullable()
    .describe(
      'General health advice or immediate care instructions, or null if not valid',
    ),
  urgency: z
    .enum(['LOW', 'MEDIUM', 'HIGH'])
    .describe('Urgency level: LOW, MEDIUM, or HIGH'),
});

@Injectable()
export class MedicalAiService {
  private model: ChatGoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not defined.');
    }
    this.model = new ChatGoogleGenerativeAI({
      apiKey,
      model: 'gemini-2.5-flash',
      temperature: 0.2,
    });
  }

  async analyzeSymptoms(userId: string, symptoms: string) {
    const prompt = `
      You are an expert AI medical assistant. A user has reported the following input:
      "${symptoms}"

      Your task is to:
      1. Verify if the input actually contains medical symptoms, health-related queries, or conditions. 
      2. CLARITY CHECK: If the input is purely conversational (e.g., "hello", "sorry"), OR if the symptoms are too vague and require more context (e.g., just saying "my head hurts" without duration or severity), set "isValid" to false.
      3. If "isValid" is false, provide a polite "errorMessage" asking the user clarifying questions (e.g., "Could you tell me how long your head has been hurting and if you have any other symptoms?"), and leave the other fields empty.
      4. If "isValid" is true (the user has provided clear, detailed symptoms), analyze the symptoms and identify potential conditions (disclaimer: this is not a final diagnosis).
      5. Generate a structured preliminary prescription.
      6. Suggest necessary diagnostic tests.
      7. Provide advice on lifestyle or immediate care.

      CRITICAL: Be professional and accurate. Always include a disclaimer that this must be verified by a doctor.
    `;

    try {
      const structuredModel = this.model.withStructuredOutput(medicalAiSchema);
      const aiResponse = await structuredModel.invoke(prompt);

      if (aiResponse.isValid === false) {
        return { isValid: false, message: aiResponse.errorMessage };
      }

      // Ensure user exists
      await this.prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email: `${userId}@example.com`,
          name: 'Test User',
        },
      });

      // Save to database
      const consultation = await this.prisma.consultation.create({
        data: {
          userId,
          symptoms: aiResponse.summarizedSymptoms || symptoms, // Fallback to raw if not present
          aiPrescription: aiResponse.prescription as Prisma.InputJsonValue,
          diagnosticTests: aiResponse.diagnosticTests,
          status: 'PENDING',
        },
      });

      return { isValid: true, consultation, analysis: aiResponse };
    } catch (error) {
      console.error('Medical AI Error:', error);
      throw new InternalServerErrorException('Failed to analyze symptoms.');
    }
  }

  async getHistory(userId: string) {
    return this.prisma.consultation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async verifyPrescription(
    id: string,
    updateData: {
      doctorPrescription: Prisma.InputJsonValue;
      doctorComments: string;
      status: 'APPROVED' | 'REJECTED';
    },
  ) {
    return this.prisma.consultation.update({
      where: { id },
      data: {
        doctorPrescription: updateData.doctorPrescription,
        doctorComments: updateData.doctorComments,
        status: updateData.status,
      },
    });
  }

  async getConsultation(id: string) {
    return this.prisma.consultation.findUnique({
      where: { id },
      include: { user: true },
    });
  }
}
