import { QuizStatus } from "@/components/quiz";
import { useQuizContext } from "@/hooks/use-quiz";
import { quizApiUrl, quizzesApiUrl } from "@/paths";
import { STORAGE_KEY } from "@/quiz-reducer";
import type { CurrentQuizData, Quiz, QuizAnswer, QuizQuestion, QuizWithProgress } from "@/types/quiz-types";
import { useEffect, useState } from "react";

export function useFetchQuizzes(): {
  quizzes: QuizWithProgress[];
  loading: boolean;
  error: Error | null;
} {
  const [ error, setError ] = useState<Error | null>(null);
  const { state, dispatch } = useQuizContext();

  useEffect(() => {
    if (state.quizzes.length > 0) return; // ✅ already cached, skip fetch
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const quizData = JSON.parse(raw);
      if (quizData?.quizzes?.length) {
        dispatch({ type: "LOAD_FROM_STORAGE", payload: quizData });
        return; // skip fetch if loaded from storage
      }
    }

    fetch(quizzesApiUrl({}))
      .then((res) => res.json())
      .then((data: Quiz[]) => {
        if (!data?.length) {
          setError(new Error("No quizzes available"));
        }

        const quizzesWithProgress: QuizWithProgress[] = data.map((quiz) => ({
          ...quiz,
          quizStatus: QuizStatus.NotStarted,
          startTime: null,
          endTime: null,
          quizAnswers: []
        }));

        dispatch({ type: "SET_QUIZZES_DATA", quizzes: quizzesWithProgress });
      })
      .catch(setError);
  }, [state.quizzes, dispatch]);

  return {
    quizzes: state.quizzes,
    loading: state.quizzes.length === 0,
    error,
  };
}

export function useFetchQuiz(quizId: string): {
  quiz: CurrentQuizData | null;
  loading: boolean;
  error: Error | null;
} {
  const [ error, setError ] = useState<Error | null>(null);
  const { state, dispatch } = useQuizContext();

  useEffect(() => {
    if (state.currentQuiz?.quizId === quizId) return; // ✅ already cached, skip fetch

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const quizData = JSON.parse(raw);
      if (quizData?.currentQuiz?.id === quizId) {
        dispatch({ type: "LOAD_FROM_STORAGE", payload: quizData });
        return; // skip fetch if loaded from storage
      }
    }

    fetch(quizApiUrl({ id: quizId }))
      .then((res) => res.json())
      .then((data: QuizQuestion[]) => {
        if (!data?.length) {
          setError(new Error("No questions found for this quiz"));
        }

        const parsedQuestionData = data.map((q) => {
          if (typeof q.quizAnswers === "string") {
            (q.quizAnswers = JSON.parse(q.quizAnswers as string) as QuizAnswer[]);
          }
          return q;
        });

        const currentQuiz: CurrentQuizData = {
          quizId: quizId,
          questionData: parsedQuestionData,
          //quizStatus: QuizStatus.NotStarted,
          startTime: null,
          endTime: null,
          savedAnswers: {}
        };

        dispatch({ type: "SET_CURRENT_QUIZ", quiz: currentQuiz });
      })
      .catch(setError);

  }, [quizId, dispatch, state.currentQuiz]);

  return { quiz: state.currentQuiz, loading: !state.currentQuiz, error };
}

  

// function useFetch<T = unknown>(url: string, enableFetch: boolean, options?: RequestInit): {
//   data: T | null;
//   loading: boolean;
//   error: Error | null;
// } {
//   const [data, setData] = useState<T | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<Error | null>(null);

//   useEffect(() => {
//     let isMounted = true; // to prevent state update after unmount
//     setLoading(true);

//     fetch(url, options)
//       .then(async (res) => {
//         if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
//         return res.json() as Promise<T>;
//       })
//       .then((json) => {
//         if (isMounted) {
//           setData(json);
//           setError(null);
//         }
//       })
//       .catch((err) => {
//         if (isMounted) setError(err);
//       })
//       .finally(() => {
//         if (isMounted) setLoading(false);
//       });

//     return () => {
//       isMounted = false;
//     };
//   }, [url, options]);

//   return { data, loading, error };
// }