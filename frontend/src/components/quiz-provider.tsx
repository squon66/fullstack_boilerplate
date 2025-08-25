import { type QuizAction, quizReducer, type QuizState, STORAGE_KEY } from "@/quiz-reducer";
import { createContext, useEffect, useReducer } from "react";

type QuizContextValue = {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
};

// Create Context
export const QuizContext = createContext<QuizContextValue>({} as QuizContextValue); 

const initialState: QuizState = {
  currentQuiz: null,
  quizzes: [],
};

const loadFromStorage: () => QuizState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const quizData = JSON.parse(raw);
    if (quizData?.quizzes?.length || quizData?.currentQuiz) {
      return quizData;
    }
  }
  return initialState;
};

export function QuizProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(quizReducer, loadFromStorage());

  useEffect(() => {
      // 🔑 Persist to localStorage on every state change
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    
  }, [state]);

	return (
		<QuizContext.Provider value={{ state, dispatch }}>
			{children}
		</QuizContext.Provider>
	);
}