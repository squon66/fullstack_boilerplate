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

export type QuizAnswerWithValue = QuizAnswer & {
  value: string;
} 

export type QuizQuestion =  {
  id: number;
  quizId: number;
  questionText: string;
  points: number;
  quizAnswers: QuizAnswer[];
}

export type CurrentQuizData = {
  quizId: number;
  questionData: QuizQuestion[];
  startTime?: Date | null;
  endTime?: Date | null;
  savedAnswers: SavedAnswers;
}

export type SavedQuizData = {
  quizId: number;
  quizStatus: QuizStatus;
  startTime: Date | null;
  endTime: Date | null;
  answers: SavedAnswers[];
}

export type QuizAppData = {
  lastQuizId: string | null;
  quizzes: Quiz[];
  questions: QuizQuestion[];
  savedData: SavedQuizData[];
}

export type QuizWithProgress = Quiz & {
    quizStatus: QuizStatus;
    startTime?: Date | null;
    endTime?: Date | null;
    quizAnswers: SavedAnswers[];
}

export type QuizQuestionsWithProgress = QuizQuestion & {
    savedAnswer?: SavedAnswers;
}

export type AppDataWithProgress = {
  lastQuizId: string | null;
  quizzes: QuizWithProgress[];
  questions: QuizQuestionsWithProgress[];
  savedData: SavedQuizData[];
};

export type SavedAnswers = Record<string, string>;
