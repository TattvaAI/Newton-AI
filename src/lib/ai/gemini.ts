import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import type { GeminiModel } from '../../types';
import { GEMINI_MODELS } from '../../types';
import { cleanGeneratedCode } from '../utils';
import { createGenerationPrompt, createFixPrompt } from './prompts';
import { AI } from '../../constants';
import { logger } from '../logger';

// ============================================================================
// CLIENT
// ============================================================================

class GeminiClient {
  private client: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('🔑 VITE_GEMINI_API_KEY is required');
    }

    this.client = new GoogleGenerativeAI(apiKey);
    this.model = this.client.getGenerativeModel({
      model: GEMINI_MODELS.FLASH,
    });
  }


  /**
   * Generate content with current model
   */
  async generate(prompt: string): Promise<string> {
    logger.info(`🤖 Generating with ${GEMINI_MODELS.FLASH}...`);

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();

      if (!text || text.trim().length < AI.MIN_CODE_LENGTH) {
        throw new Error('Empty or invalid response from AI');
      }

      logger.info(`✅ Generated ${text.length} characters`);
      return text;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Generation failed: ${message}`);
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
export const geminiClient = new GeminiClient(API_KEY);

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Generate physics simulation code from natural language
 */
export async function generatePhysicsCode(prompt: string): Promise<string> {
  const fullPrompt = createGenerationPrompt(prompt);

  logger.log('Sending prompt to AI...');
  const response = await geminiClient.generate(fullPrompt);
  logger.log('Raw AI response length:', response.length);
  logger.debug('Raw AI response (first 500 chars):', response.substring(0, 500));

  const cleaned = cleanGeneratedCode(response);
  logger.log('Cleaned code length:', cleaned.length);
  logger.debug('Cleaned code:', cleaned);

  return cleaned;
}

/**
 * Fix broken physics code
 */
export async function fixPhysicsCode(
  originalPrompt: string,
  brokenCode: string,
  error: string
): Promise<string> {
  const fixPrompt = createFixPrompt(originalPrompt, brokenCode, error);

  const response = await geminiClient.generate(fixPrompt);
  const cleaned = cleanGeneratedCode(response);
  logger.log('Cleaned fixed code:', cleaned);
  return cleaned;
}

/**
 * Switch AI model (Stubbed for Gemini 3 Flash Only)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function switchModel(_model: GeminiModel): void {
  // Do nothing, only flash supported
}

/**
 * Get active model
 */
export function getActiveModel(): GeminiModel {
  return 'flash';
}
