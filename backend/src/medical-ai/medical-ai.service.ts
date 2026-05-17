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
      You are an expert AI medical assistant. A user has reported the following symptoms:
      "${symptoms}"

      Your task is to:
      1. Analyze the symptoms and identify potential conditions (disclaimer: this is not a final diagnosis).
      2. Generate a structured preliminary prescription.
      3. Suggest necessary diagnostic tests (e.g., Blood test, X-ray).
      4. Provide advice on lifestyle or immediate care.

      Return the response in the following JSON format:
      {
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
          symptoms,
          aiPrescription: aiResponse.prescription,
          diagnosticTests: aiResponse.diagnosticTests,
          status: 'PENDING',
        },
      });

      return { consultation, analysis: aiResponse };
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
