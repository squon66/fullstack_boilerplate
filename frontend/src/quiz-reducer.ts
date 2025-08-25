import { QuizStatus } from "@/components/quiz";
import type { CurrentQuizData, QuizWithProgress } from "@/types/quiz-types";

export type QuizState = {
  quizzes: QuizWithProgress[];
  currentQuiz: CurrentQuizData | null;
};

export type QuizAction =
  | { type: "LOAD_FROM_STORAGE"; payload: QuizState }
  | { type: "SET_CURRENT_QUIZ"; quiz: CurrentQuizData; }
  | { type: "START_QUIZ"; quizId: string }
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
      return  {
        ...state,
        currentQuiz: action.quiz,
      };

    case "SET_QUIZZES_DATA":
      return {
        ...state,
        quizzes: action.quizzes,
      };

    case "START_QUIZ": {
        const quizId = action.quizId;

        const updatedQuizzes = state.quizzes.map((quiz) => {
          if (quiz?.id.toString() === quizId) {
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
        if (quiz?.id.toString() === quizId) {
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
