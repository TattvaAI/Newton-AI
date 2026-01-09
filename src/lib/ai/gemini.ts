import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import type { GeminiModel } from '../../types';
import { GEMINI_MODELS } from '../../types';
import { cleanGeneratedCode } from '../utils';
import { AI } from '../../constants';
import { logger } from '../logger';

// ============================================================================
// CLIENT
// ============================================================================

class GeminiClient {
  private client: GoogleGenerativeAI;
  private activeModel: GeminiModel = 'pro';
  private model: GenerativeModel;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('🔑 VITE_GEMINI_API_KEY is required');
    }

    this.client = new GoogleGenerativeAI(apiKey);
    this.model = this.client.getGenerativeModel({
      model: GEMINI_MODELS.PRO,
    });
  }

  /**
   * Switch between Pro and Flash models
   */
  switchModel(modelType: GeminiModel | string): void {
    // Handle both 'pro'/'flash' and full model names
    let targetModel: GeminiModel;
    let modelName: string;
    
    if (modelType === 'pro' || modelType === GEMINI_MODELS.PRO) {
      targetModel = 'pro';
      modelName = GEMINI_MODELS.PRO;
    } else if (modelType === 'flash' || modelType === GEMINI_MODELS.FLASH) {
      targetModel = 'flash';
      modelName = GEMINI_MODELS.FLASH;
    } else {
      console.warn(`Unknown model: ${modelType}, defaulting to flash`);
      targetModel = 'flash';
      modelName = GEMINI_MODELS.FLASH;
    }
    
    this.activeModel = targetModel;
    this.model = this.client.getGenerativeModel({ model: modelName });
    logger.info(`🔄 Switched to ${modelName}`);
  }

  /**
   * Get current active model
   */
  getActiveModel(): GeminiModel {
    return this.activeModel;
  }

  /**
   * Generate content with current model
   */
  async generate(prompt: string): Promise<string> {
    const modelName = this.activeModel === 'pro' ? GEMINI_MODELS.PRO : GEMINI_MODELS.FLASH;
    logger.info(`🤖 Generating with ${modelName}...`);

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
      
      // Auto-fallback to Flash if Pro hits rate limit
      if (this.activeModel === 'pro' && (message.includes('429') || message.includes('quota'))) {
        logger.warn('⚠️ Pro rate limit hit, falling back to Flash...');
        this.switchModel('flash');
        return this.generate(prompt);
      }

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
  const systemPrompt = createSystemPrompt();
  const fullPrompt = `${systemPrompt}\n\nUSER REQUEST: "${prompt}"\n\nGenerate the code (raw JavaScript only):`;

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
  const systemPrompt = createSystemPrompt();
  const fixPrompt = `${systemPrompt}\n\n⚠️ THE PREVIOUS CODE FAILED!\n\nOriginal request: "${originalPrompt}"\n\nError message: ${error}\n\nBroken code that failed:\n${brokenCode}\n\nGenerate FIXED code (raw JavaScript only, no explanations):`;

  const response = await geminiClient.generate(fixPrompt);
  const cleaned = cleanGeneratedCode(response);
  logger.log('Cleaned fixed code:', cleaned);
  return cleaned;
}

/**
 * Switch AI model
 */
export function switchModel(model: GeminiModel): void {
  geminiClient.switchModel(model);
}

/**
 * Get active model
 */
export function getActiveModel(): GeminiModel {
  return geminiClient.getActiveModel();
}

// ============================================================================
// SYSTEM PROMPT
// ============================================================================

function createSystemPrompt(): string {
  return 'You are a Matter.js physics code generator. Generate ONLY executable JavaScript code - no explanations, no markdown, no text before or after.\n\n' +
    'AVAILABLE VARIABLES (already in scope, do NOT declare them):\n' +
    '- World, Bodies, Body, Composite, Constraint, Vector, Events (from Matter.js)\n' +
    '- world: the physics world instance\n' +
    '- engine: the physics engine instance\n' +
    '- width: canvas width in pixels\n' +
    '- height: canvas height in pixels\n\n' +
    'CRITICAL RULES:\n' +
    '1. Output ONLY raw JavaScript code that can be executed directly\n' +
    '2. NO markdown code fences (no ```)\n' +
    '3. NO explanatory text before or after the code\n' +
    '4. NO "Here\'s the code" or similar phrases\n' +
    '5. Start directly with code (const, for, if, etc.)\n' +
    '6. Use Composite.add(world, [bodies]) to add objects to the world\n' +
    '7. Make it colorful using template literals: render: { fillStyle: `hsl(${hue}, 70%, 60%)` }\n' +
    '8. Vary sizes, positions, and velocities for visual interest\n' +
    '9. Use realistic physics: restitution 0.85-0.95\n' +
    '10. RULE: You MUST assign meaningful label properties to bodies (e.g., label: \'wheel\', label: \'chassis\'). Do not leave them as default \'Body\'.\n\n' +
    'EXAMPLE OUTPUT (starts directly with code, no preamble):\n\n' +
    'const balls = [];\n' +
    'for (let i = 0; i < 40; i++) {\n' +
    '  const r = 12 + Math.random() * 18;\n' +
    '  balls.push(Bodies.circle(\n' +
    '    100 + Math.random() * (width - 200),\n' +
    '    -100 - Math.random() * 300,\n' +
    '    r,\n' +
    '    {\n' +
    '      restitution: 0.92,\n' +
    '      friction: 0.05,\n' +
    '      label: `ball-${i}`,\n' +
    '      render: { fillStyle: `hsl(${i * 9}, 75%, 60%)` }\n' +
    '    }\n' +
    '  ));\n' +
    '}\n' +
    'Composite.add(world, balls);';
}
