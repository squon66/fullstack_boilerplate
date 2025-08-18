import { QuizStatus } from "@/components/quiz";
import type { AppDataWithProgress, QuizQuestionsWithProgress, QuizWithProgress, SavedAnswer, SavedQuizData } from "@/types/quiz-types";

export type QuizAction =
  | { type: "LOAD_FROM_STORAGE"; payload: AppDataWithProgress }
  | { type: "START_QUIZ"; quizId: string }
  | { type: "SET_QUIZ_DATA"; quizzes: QuizWithProgress[]}
  | { type: "SET_QUESTION_DATA"; questions: QuizQuestionsWithProgress[]}
  | { type: "ANSWER_QUESTION"; quizId: string; answer: SavedAnswer }
  | { type: "COMPLETE_QUIZ"; quizId: string; score: number }
  | { type: "RESET_QUIZ"; quizId: string };

export const STORAGE_KEY = "quizAppData";

export function quizReducer(state: AppDataWithProgress, action: QuizAction): AppDataWithProgress {
  switch (action.type) {
    case "LOAD_FROM_STORAGE":
      return action.payload;

    case "SET_QUIZ_DATA":
      return {
        ...state,
        quizzes: action.quizzes,
      };

    case "SET_QUESTION_DATA":
      return {
        ...state,
        questions: action.questions,
      };

    case "START_QUIZ": {
        const { quizId } = action;
        const updatedSaved: SavedQuizData = {
          quizId,
          quizStatus: QuizStatus.InProgress,
          score: 0,
          answers: [],
          startTime: new Date(),
          endTime: null,
        };
        return { ...state, savedData: [...state.savedData, updatedSaved] };
      }

    case "ANSWER_QUESTION": {
      const { quizId, answer } = action;
      const existing = state.savedData.find((d) => d.quizId === quizId);

      let updatedSaved: SavedQuizData;
      if (existing) {
        const answers = existing.answers.filter((a) => a.questionId !== answer.questionId);
        updatedSaved = { ...existing, answers: [...answers, answer] };
        return {
          ...state,
          savedData: state.savedData.map((d) => (d.quizId === quizId ? updatedSaved : d)),
        };
      }
      updatedSaved = {
        quizId,
        quizStatus: QuizStatus.NotStarted,
        score: 0,
        answers: [answer],
        startTime: null,
        endTime: null,
      };
      return { ...state, savedData: [...state.savedData, updatedSaved] };
    }

    case "COMPLETE_QUIZ": {
      return {
        ...state,
        savedData: state.savedData.map((d) =>
          d.quizId === action.quizId ? { ...d, completed: true, score: action.score } : d
        ),
      };
    }

    case "RESET_QUIZ": {
      return {
        ...state,
        savedData: state.savedData.filter((d) => d.quizId !== action.quizId),
      };
    }

    default:
      return state;
  }
}
