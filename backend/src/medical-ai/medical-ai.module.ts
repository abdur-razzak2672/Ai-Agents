import { Module } from '@nestjs/common';
import { MedicalAiController } from './medical-ai.controller';
import { MedicalAiService } from './medical-ai.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MedicalAiController],
  providers: [MedicalAiService],
  exports: [MedicalAiService],
})
export class MedicalAiModule {}
