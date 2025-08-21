import { QuizContext } from "@/components/quiz-provider";
import { useContext } from "react";

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return ctx;
}

export function useQuizzes() {
  const ctx = useQuiz();
  const { state, dispatch } = ctx;

  return {quizzes: state.quizzes, dispatch };
}