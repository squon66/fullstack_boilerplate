import { QuizStatus } from "@/components/quiz";

// types.ts
export type Quiz = {
  id: string;
  title: string;
  description?: string;
  //totalPoints: number;
  //questionIds: string[];
}

export type QuizAnswer = {
  id: string;
  answerText: string;
  isCorrect: boolean;
}

export type QuizQuestion =  {
  id: string;
  quizId: string;
  questionText: string;
  points: number;
  quizAnswers: QuizAnswer[];
}

export type SavedAnswer = {
  questionId: string;
  answerId: string | null;
  isCorrect: boolean;
}

export type SavedQuizData = {
  quizId: string;
  quizStatus: QuizStatus;
  startTime: Date | null;
  endTime: Date | null;
  score: number;
  answers: SavedAnswer[];
}

export type QuizAppData = {
  lastQuizId: string | null;
  quizzes: Quiz[];
  questions: QuizQuestion[];
  savedData: SavedQuizData[];
}

export type QuizWithProgress = Quiz & {
    quizStatus?: QuizStatus;
    startTime?: Date | null;
    endTime?: Date | null;
}

export type QuizQuestionsWithProgress = QuizQuestion & {
    savedAnswer?: SavedAnswer;
}

export type AppDataWithProgress = {
  lastQuizId: string | null;
  quizzes: QuizWithProgress[];
  questions: QuizQuestionsWithProgress[];
  savedData: SavedQuizData[];
};
