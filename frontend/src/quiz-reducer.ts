import { QuizStatus } from "@/components/quiz";
import type { AppDataWithProgress, CurrentQuizData, QuizWithProgress, SavedAnswers } from "@/types/quiz-types";

export type QuizState = {
  quizzes: QuizWithProgress[];
  currentQuiz: CurrentQuizData | null;
  savedAnswers: SavedAnswers;
};

export type QuizAction =
  | { type: "LOAD_FROM_STORAGE"; payload: AppDataWithProgress }
  | { type: "START_QUIZ"; currentQuiz: CurrentQuizData }
  | { type: "SET_QUIZ_DATA"; quizzes: QuizWithProgress[]}
  | { type: "SAVE_ANSWER"; quizId: string; answerId: string }
  | { type: "COMPLETE_QUIZ"; quizId: string; score: number }
  | { type: "RESET_QUIZ"; quizId: string };

export const STORAGE_KEY = "quizAppData";

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    // case "LOAD_FROM_STORAGE":
    //   return action.payload;

    case "SET_QUIZ_DATA":
      return {
        ...state,
        quizzes: action.quizzes,
      };

    case "START_QUIZ": {
        const quizId = action.currentQuiz.quizId;

        const updatedQuizzes = state.quizzes.map((quiz) => {
          if (quiz.id === quizId) {
            return { ...quiz, quizStatus: QuizStatus.InProgress };
          }
          return quiz;
        }); 

        return {
          ...state,
          quizzes: updatedQuizzes,
          currentQuiz: action.currentQuiz,
        };
      }

    case "SAVE_ANSWER": {
      const { quizId, answerId } = action;
      return {
        ...state,
        savedAnswers: {
          ...state.savedAnswers,
          [quizId]: answerId,
        },
      };
    }

    // case "COMPLETE_QUIZ": {
    //   return {
    //     ...state,
    //     savedData: state.savedData.map((d) =>
    //       d.quizId === action.quizId ? { ...d, completed: true, score: action.score } : d
    //     ),
    //   };
    // }

    // case "RESET_QUIZ": {
    //   return {
    //     ...state,
    //     savedData: state.savedData.filter((d) => d.quizId !== action.quizId),
    //   };
    // }

    default:
      return state;
  }
}
