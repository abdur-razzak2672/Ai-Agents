import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { GenerationService } from './generation.service';

@Controller('generations')
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Post()
  async generate(@Body('url') url: string) {
    return this.generationService.generateFromUrl(url);
  }

  @Get()
  async getHistory() {
    return this.generationService.getHistory();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.generationService.getById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body('code') code: string) {
    return this.generationService.updateGeneration(id, code);
  }
}
