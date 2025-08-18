import { type QuizAction, quizReducer, STORAGE_KEY } from "@/quiz-reducer";
import type { AppDataWithProgress, QuizAppData, QuizWithProgress } from "@/types/quiz-types";
import { createContext, useEffect, useReducer, useState } from "react";

// type QuizState = {
//   quizzes: Quiz[] | null;
//   currentQuiz: QuizQuestion[] | null;
//   //quizAnswers?: Record<string, QuizAnswer[]>;
// };

type QuizContextValue = {
  state: AppDataWithProgress;
  dispatch: React.Dispatch<QuizAction>;
};

// Create Context
export const QuizContext = createContext<QuizContextValue | undefined>(undefined);

const initialState: AppDataWithProgress = {
  lastQuizId: null,
  quizzes: [],
  questions: [],
  savedData: [],
};

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [appData, setAppData] = useState(undefined);
  const [dataInited, setDataInited] = useState<boolean>(false);
	const [state, dispatch] = useReducer(quizReducer, initialState);

  if (appData && !dataInited) dispatch({ type: "LOAD_FROM_STORAGE", payload: appData });

  // Load from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const quizData: QuizAppData = JSON.parse(raw);
      if (quizData?.quizzes?.length) {
        const { lastQuizId, quizzes, questions, savedData } = quizData;

        const quizDataWithProgress: QuizWithProgress[] = quizzes.map((quiz) => {
          const savedQuiz = state?.savedData.find((sq) => sq.quizId === quiz.id);
          return {
            ...quiz,
            quizStatus: savedQuiz?.quizStatus,
            startTime: savedQuiz?.startTime,
            endTime: savedQuiz?.endTime,
          };
        })

        const savedQuiz = savedData.find(s => s.quizId === lastQuizId) ?? null;

        const questionsWithProgress = questions
          .map(q => ({
            ...q,
            savedAnswer: savedQuiz?.answers.find(a => a.questionId === q.id),
          }));

        const initData: AppDataWithProgress = {
          lastQuizId,
          quizzes: quizDataWithProgress,
          questions: questionsWithProgress,
          savedData,
        };

        setDataInited(true);
        setAppData(initData)
      }
    }
  }, []);

	return (
		<QuizContext.Provider value={{ state, dispatch }}>
			{children}
		</QuizContext.Provider>
	);
}