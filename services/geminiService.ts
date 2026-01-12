import { GoogleGenAI, Chat } from "@google/genai";
import { ParsedResponse, KnowledgeLevel } from "../types";

const SYSTEM_PROMPT = `You are Teca MCQ, an intelligent multiple-choice question generator and tutor AI.

Your role:
Generate high-quality MCQ questions based on the user's topic, their base Knowledge Level (Beginner, Intermediate, Advanced), and a dynamic Difficulty Score (1-10).

Dynamic Difficulty Scaling:
- 1-3: Core concepts, basic definitions, and general knowledge. Clear and simple explanations.
- 4-7: Intermediate application, conceptual relationships, and specific details. Explanations should bridge concepts.
- 8-10: Advanced expertise, complex reasoning, edge cases, and technical nuances. Explanations should be sophisticated and precise.

Formatting rules (STRICT):
For every question, you MUST provide:
1. The question text in <q></q>
2. Four options in <a>, <b>, <c>, <d>
3. The CORRECT option ID (A, B, C, or D) in <correct></correct>
4. A brief, 1-2 sentence explanation in <explanation></explanation>

Example format:
<q>What is the capital of France?</q>
<a>London</a>
<b>Paris</b>
<c>Berlin</c>
<d>Madrid</d>
<correct>B</correct>
<explanation>Paris has been the capital of France since the late 10th century and is its most populous city.</explanation>

Rules:
- Strictly follow the tag format.
- Do not repeat previous questions.
- Maintain a professional yet encouraging tutor tone.
- Do not add any text outside the tags.

AI name: Teca MCQ`;

export class TecaQuizService {
  private chat: Chat | null = null;
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async startQuiz(topic: string, level: KnowledgeLevel, difficulty: number): Promise<ParsedResponse> {
    this.chat = this.ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.8, // Slightly lower for consistent technical quality
      },
    });

    const response = await this.chat.sendMessage({
      message: `Topic: ${topic}\nBase Level: ${level}\nInitial Dynamic Difficulty: ${difficulty}/10\n\nStart the quiz. Provide the first question adjusted to this difficulty.`,
    });

    return this.parseAIResponse(response.text || '');
  }

  async nextQuestion(difficulty: number): Promise<ParsedResponse> {
    if (!this.chat) throw new Error("Quiz not started");

    const difficultyInstruction = difficulty >= 8 
      ? "This user is performing well. Increase complexity significantly. Use technical terminology and test deep mastery." 
      : difficulty >= 5 
      ? "This user is comfortable. Provide a challenging application-based question." 
      : "Keep the question focused on fundamental principles and clear concepts.";

    const response = await this.chat.sendMessage({
      message: `Next question. Current Dynamic Difficulty: ${difficulty}/10. ${difficultyInstruction} Follow the tag format.`,
    });

    return this.parseAIResponse(response.text || '');
  }

  private parseAIResponse(text: string): ParsedResponse {
    const extractTag = (tag: string) => {
      const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, 'si');
      const match = text.match(regex);
      return match ? match[1].trim() : undefined;
    };

    const q = extractTag('q');
    const correct = extractTag('correct')?.toUpperCase() as 'A' | 'B' | 'C' | 'D' | undefined;
    const explanation = extractTag('explanation');
    
    const options: ParsedResponse['options'] = [];
    ['a', 'b', 'c', 'd'].forEach((tag) => {
      const content = extractTag(tag);
      if (content) {
        const id = tag.toUpperCase() as 'A' | 'B' | 'C' | 'D';
        const cleanText = content.replace(/^[A-D]:\s*/i, '');
        options.push({ id, text: cleanText });
      }
    });

    return {
      question: q,
      options,
      correctId: correct,
      explanation
    };
  }
}

export const quizService = new TecaQuizService();