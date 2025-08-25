import type { QuizStatus } from "@/components/quiz";

// types.ts
export type Quiz = {
  id: number;
  title: string;
  description?: string;
}

export type QuizAnswer = {
  id: string;
  answerText: string;
  isCorrect: boolean;
}

export type QuizQuestion =  {
  id: number;
  quizId: number;
  questionText: string;
  points: number;
  quizAnswers: QuizAnswer[];
}

export type CurrentQuizData = {
  quizId: string;
  questionData: QuizQuestion[];
  startTime?: Date | null;
  endTime?: Date | null;
  savedAnswers: SavedAnswers;
}

export type QuizWithProgress = (Quiz & {
    quizStatus: QuizStatus;
    startTime?: Date | null;
    endTime?: Date | null;
    quizAnswers: SavedAnswers[];
}) | null

export type SavedAnswers = Record<string, string>;
