import { QuizStatus, QuizzesList } from "@/components/quiz";
import { useQuizzes } from "@/hooks/use-quiz";
import { quizzesApiUrl } from "@/paths";
import { STORAGE_KEY } from "@/quiz-reducer";
import type { Quiz, QuizWithProgress } from "@/types/quiz-types";
import { useEffect, useState } from "react";


export function RootPage() {
	//const [quizzes, setQuizzes] = useState<Quiz[]>([]);
	const [error, setError] = useState<Error | null>(null);

	const quizCtx = useQuizzes();
	if (!quizCtx) throw new Error("Must be used within QuizProvider");

	const { quizzes, dispatch } = quizCtx;
	useEffect(() => {
		if (!quizzes || !quizzes.length) {
			// Fetch quizzes from the API if not found in localStorage
			fetch(quizzesApiUrl({}))
				.then((res) => res.json())
				.then((data: Quiz[]) => {
					if (!data?.length) {
						throw new Error("No quizzes available");
					}

					const quizzesWithProgress: QuizWithProgress[] = data.map((quiz) => ({
						...quiz,
						quizStatus: QuizStatus.NotStarted,
						startTime: null,
						endTime: null,
						quizAnswers: []
					}));

					dispatch({ type: "SET_QUIZ_DATA", quizzes: quizzesWithProgress });
					//setQuizzes(data);
					// 	const initialData = {
					// 		quizzes: data,
					// 		questions: [],
					// 	}
					// 	localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
					// 	const savedQuizData = data.map((q) => ({
					// 		...q,
					// 		quizStatus: QuizStatus.NotStarted,
					// 		startTime: null,
					// 		endTime: null,
					// 	}));
							
					// 	dispatch({ type: "SET_QUIZ_DATA", quizzes: savedQuizData });
					// 	setQuizzes(data);
					// } else {
					// 	setError(new Error('There was a problem retrieving the quizzes.  Please try again.'));
					// }
				})
				.catch(setError);
			}
	}, [dispatch, quizzes, quizzes.length]);

	if (error) return <div>An error has occurred: {error.message}</div>;

	if (!quizzes) return <div className="text-center p-8">Loading...</div>;

	// const welcomeText = state.savedData?.length ? 'Welcome back!' : `Welcome ${'uo'}!`;
	const welcomeText = true ? 'Welcome back!' : `Welcome ${'uo'}!`;

	return (
		<>
			<h2 className="text-xl font-bold text-muted-foreground mt-5">{welcomeText}</h2>
			<div className="text-m text-muted-foreground mt-5">Please select a quiz to take from the options below.</div>
			<div className="mt-10 text-lg text-center">
				<QuizzesList quizzes={quizzes} />
			</div>
		</>
	);
}
