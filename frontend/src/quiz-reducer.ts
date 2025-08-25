import { QuizStatus } from "@/components/quiz";
import type { CurrentQuizData, QuizWithProgress } from "@/types/quiz-types";

export type QuizState = {
  quizzes: QuizWithProgress[];
  currentQuiz: CurrentQuizData | null;
};

export type QuizAction =
  | { type: "LOAD_FROM_STORAGE"; payload: QuizState }
  | { type: "SET_CURRENT_QUIZ"; quiz: CurrentQuizData; }
  | { type: "START_QUIZ"; quizId: number }
  | { type: "SET_QUIZZES_DATA"; quizzes: QuizWithProgress[]}
  | { type: "SAVE_ANSWER"; quizId: string; answerId: string }
  | { type: "COMPLETE_QUIZ"; quizId: string; }
  | { type: "RESET_QUIZ"; quizId: string };

export const STORAGE_KEY = "quizAppData";

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "LOAD_FROM_STORAGE":
      return action.payload;

    case "SET_CURRENT_QUIZ":
      const updatedQuiz = {
        ...state,
        currentQuiz: action.quiz,
      };

      return updatedQuiz;

    case "SET_QUIZZES_DATA":
      const updatedQuizzes = {
        ...state,
        quizzes: action.quizzes,
      };

      return updatedQuizzes;

    case "START_QUIZ": {
        const quizId = action.quizId;

        const updatedQuizzes = state.quizzes.map((quiz) => {
          if (quiz?.id === quizId) {
 
            return {
              ...quiz,
              quizStatus: QuizStatus.InProgress,
              startTime: new Date(),
            }
          }
          return quiz;
        }); 

        return {
          ...state,
          quizzes: updatedQuizzes,
        };
      }

    case "SAVE_ANSWER": {
      const { quizId, answerId } = action;
      
      if (state.currentQuiz) state.currentQuiz.savedAnswers[quizId] = answerId;

      return {
        ...state,
        currentQuiz: state.currentQuiz,
      };
    }

    case "COMPLETE_QUIZ": {
      const quizId = action.quizId;
      const updatedQuizzes = state.quizzes.map((quiz) => {
        if (quiz?.id === Number.parseInt(quizId, 10)) {
          return {
            ...quiz,
            quizStatus: QuizStatus.Completed,
            endTime: new Date(),
          };
        }
        return quiz;
      });
      return {
        ...state,
        quizzes: updatedQuizzes,
        //currentQuiz: null,
      };
    }

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
