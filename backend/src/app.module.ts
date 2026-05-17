import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './ai/ai.module';
import { GenerationModule } from './generation/generation.module';
import { MedicalAiModule } from './medical-ai/medical-ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AiModule,
    GenerationModule,
    MedicalAiModule,
  ],
})
export class AppModule {}
