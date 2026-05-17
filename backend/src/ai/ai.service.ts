import { Injectable, InternalServerErrorException, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('GEMINI_API_KEY is not defined in environment variables.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });
  }

  async scrapeUrl(url: string) {
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });
      const $ = cheerio.load(data);
      
      const title = $('title').text();
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      const bodyText = $('body').text().substring(0, 2000);
      
      $('script, style, iframe, noscript, footer, nav').remove();
      
      const sections: string[] = [];
      $('body > div, body > section, body > header, body > main').each((i, el) => {
        if (i < 5) {
          sections.push($(el).html()?.substring(0, 1000) || '');
        }
      });

      const cleanHtml = sections.join('\n').substring(0, 4000);

      return {
        title,
        description: metaDescription,
        bodyText,
        cleanHtml,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to scrape the website.');
    }
  }

  async generateCode(url: string) {
    const scrapedData = await this.scrapeUrl(url);

    const prompt = `
      You are a world-class frontend engineer and UI/UX designer.
      Your task is to REPLICATE the design and structure of the following website as closely as possible using Tailwind CSS.
      
      URL: ${url}
      Scraped Title: ${scrapedData.title}
      Scraped Description: ${scrapedData.description}
      
      SITE CONTENT (USE THIS EXACT TEXT):
      ${scrapedData.bodyText}
      
      STRUCTURAL CONTEXT:
      ${scrapedData.cleanHtml}
      
      CRITICAL INSTRUCTIONS:
      1. STYLE MATCHING: Identify the core color palette, typography style, and spacing from the provided HTML structure. Replicate it using Tailwind CSS.
      2. CONTENT ACCURACY: Use the actual text from the "SITE CONTENT" section. Do not invent marketing fluff unless the content is missing.
      3. LAYOUT: Create a high-fidelity, single-page layout. 
         - A premium Navigation bar (logo placeholder, links).
         - A high-impact Hero section with the main heading from the source.
         - Sections for Features/Services, About, and Contact that mirror the source structure.
      4. VISUALS: Use placeholder images from 'https://images.unsplash.com/...' that match the industry. Use modern UI elements (shadows, transitions, hover effects).
      5. FORMAT: Return ONLY the internal body HTML content. Do not include <html>, <head>, or <body> tags. Use Tailwind classes for everything.
      
      Return a JSON object:
      {
        "generatedCode": "<div class='...'>...</div>",
        "companyName": "The exact company name",
        "about": "A concise summary of what they do",
        "contactInfo": { "email": "...", "phone": "..." }
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error: any) {
      console.error('Gemini generateCode error:', error);
      if (error.status === 429) {
        throw new HttpException('AI Quota exceeded. Please try again later.', HttpStatus.TOO_MANY_REQUESTS);
      }
      throw new InternalServerErrorException('Gemini failed to generate code.');
    }
  }

  async updateCode(currentCode: string, instruction: string) {
    const prompt = `
      Current Code:
      ${currentCode}
      
      Instruction: ${instruction}
      
      Please update the code based on the instruction. Keep the same professional style.
      Return the updated code as a string in a JSON object: { "updatedCode": "..." }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error: any) {
      console.error('Gemini updateCode error:', error);
      if (error.status === 429) {
        throw new HttpException('AI Quota exceeded. Please try again later.', HttpStatus.TOO_MANY_REQUESTS);
      }
      throw new InternalServerErrorException('Gemini failed to update the code.');
    }
  }
}
