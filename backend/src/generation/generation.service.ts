import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class GenerationService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
  ) {}

  async generateFromUrl(url: string) {
    const aiResult = await this.aiService.generateCode(url);
    
    const generation = await this.prisma.generation.create({
      data: {
        url,
        generatedCode: aiResult.generatedCode,
        companyName: aiResult.companyName,
        about: aiResult.about,
        contactInfo: aiResult.contactInfo,
      },
    });

    return generation;
  }

  async getHistory() {
    return this.prisma.generation.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    return this.prisma.generation.findUnique({
      where: { id },
    });
  }

  async updateGeneration(id: string, code: string) {
    return this.prisma.generation.update({
      where: { id },
      data: { generatedCode: code },
    });
  }
}
