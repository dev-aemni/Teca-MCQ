
export enum QuizStatus {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export type KnowledgeLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Option {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface ParsedResponse {
  result?: string;
  question?: string;
  options: Option[];
  correctId?: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export interface QuizProgress {
  score: number;
  incorrect: number;
  totalQuestions: number;
  difficulty: number;
  currentStreak: number;
  knowledgeLevel: KnowledgeLevel;
}
