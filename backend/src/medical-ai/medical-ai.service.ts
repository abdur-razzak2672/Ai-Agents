import { Injectable, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MedicalAiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not defined.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
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

      Return the response in the exact following JSON format:
      {
        "isValid": true,
        "errorMessage": null,
        "summarizedSymptoms": "Short string of extracted keywords (e.g. 'Cold, Fever')",
        "potentialConditions": ["Condition 1", "Condition 2"],
        "prescription": {
          "medications": [
            { "name": "Medication Name", "dosage": "e.g. 500mg", "frequency": "e.g. 1+0+1", "duration": "5 days" }
          ],
          "instructions": "General instructions for taking the meds"
        },
        "diagnosticTests": ["Test 1", "Test 2"],
        "advice": "General health advice",
        "urgency": "LOW | MEDIUM | HIGH"
      }

      CRITICAL: Be professional and accurate. Always include a disclaimer that this must be verified by a doctor.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const aiResponse = JSON.parse(response.text());

      if (aiResponse.isValid === false) {
        return { isValid: false, message: aiResponse.errorMessage };
      }

      // Ensure user exists
      await this.prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId, email: `${userId}@example.com`, name: 'Test User' },
      });

      // Save to database
      const consultation = await this.prisma.consultation.create({
        data: {
          userId,
          symptoms: aiResponse.summarizedSymptoms || symptoms, // Fallback to raw if not present
          aiPrescription: aiResponse.prescription,
          diagnosticTests: aiResponse.diagnosticTests,
          status: 'PENDING',
        },
      });

      return { isValid: true, consultation, analysis: aiResponse };
    } catch (error: any) {
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

  async verifyPrescription(id: string, updateData: { doctorPrescription: any, doctorComments: string, status: 'APPROVED' | 'REJECTED' }) {
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
