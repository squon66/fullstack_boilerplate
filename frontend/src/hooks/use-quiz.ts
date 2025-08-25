import { QuizContext } from "@/components/quiz-provider";
import { useContext } from "react";

export function useQuizContext() {
  const ctx = useContext(QuizContext);
  if (!ctx) { 
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return ctx;
  
}