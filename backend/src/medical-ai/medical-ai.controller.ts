import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { MedicalAiService } from './medical-ai.service';

@Controller('medical')
export class MedicalAiController {
  constructor(private readonly medicalAiService: MedicalAiService) {}

  @Post('analyze')
  async analyzeSymptoms(@Body() body: { userId: string; symptoms: string }) {
    return this.medicalAiService.analyzeSymptoms(body.userId, body.symptoms);
  }

  @Get('history/:userId')
  async getHistory(@Param('userId') userId: string) {
    return this.medicalAiService.getHistory(userId);
  }

  @Get('consultation/:id')
  async getConsultation(@Param('id') id: string) {
    return this.medicalAiService.getConsultation(id);
  }

  @Patch('verify/:id')
  async verifyPrescription(
    @Param('id') id: string,
    @Body()
    body: {
      doctorPrescription: any;
      doctorComments: string;
      status: 'APPROVED' | 'REJECTED';
    },
  ) {
    return this.medicalAiService.verifyPrescription(id, body);
  }
}
