import { QuizStatus, QuizzesList } from "@/components/quiz";
import { QuizContext } from "@/components/quiz-provider";
import { quizzesApiUrl } from "@/paths";
import { STORAGE_KEY } from "@/quiz-reducer";
import type { Quiz, QuizWithProgress } from "@/types/quiz-types";
import { useContext, useEffect, useState } from "react";


export function RootPage() {
	const [quizzes, setQuizzes] = useState<Quiz[]>([]);
	const [error, setError] = useState<Error | null>(null);

	// const quizCtx = useContext(QuizContext);
	// if (!quizCtx) throw new Error("Must be used within QuizProvider");
	
	//const { state, dispatch } = quizCtx;

	useEffect(() => {
		// if (state.quizzes && state.quizzes.length > 0) {
		// 	setQuizzes(state.quizzes);
		// } else {
			// Fetch quizzes from the API if not found in localStorage
			fetch(quizzesApiUrl({}))
				.then((res) => res.json())
				.then((data: Quiz[]) => {
					if (!data?.length) {
						throw new Error("No quizzes available");
					}
					setQuizzes(data);
					// 	const initialData = {
					// 		lastQuizId: null,
					// 		quizzes: data,
					// 		questions: [],
					// 		savedData: [],
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
	}, []);

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
