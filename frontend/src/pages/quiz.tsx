import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { QuizStepper } from "@/components/stepper";
import { quizApiUrl, rootPath, startQuizApiUrl } from "@/paths";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { CurrentQuizData, QuizAnswer, QuizQuestion, SavedAnswers } from "@/types/quiz-types";
import { QuizStatus } from "@/components/quiz";
import { useQuiz } from "@/hooks/use-quiz";
import { QuizResults } from "@/components/QuizResults";

export function QuizPage() {
		const { id: idParam } = useParams();
		if (!idParam) throw new Error("Quiz id param is required");
		const id = Number(idParam);

	const quizCtx = useQuiz();

	const { state, dispatch } = quizCtx;

	const { quizzes, currentQuiz } = state;

	const selectedQuiz = quizzes.find((quiz) => quiz.id === id);
	if (!selectedQuiz) throw new Error(`Quiz with id ${id} not found in context`);

	const { quizStatus: initialStatus, title } = selectedQuiz;

	//const [questionData, setQuestionData] = useState<QuizQuestionsWithProgress[] | null>(null);
	const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
	const [error, setError] = useState<Error | null>(null);
	const [quizStatus, setQuizStatus] = useState<QuizStatus | null>(QuizStatus.NotStarted);
	const [savedAnswers, setSavedAnswers] = useState<SavedAnswers>({});

	console.log('quizQuestions', quizQuestions);

	useEffect(() => {
		setQuizStatus(initialStatus);
		setSavedAnswers(currentQuiz?.savedAnswers || {});
	}, [ initialStatus, currentQuiz ]);

	useEffect(() => {
		if (!currentQuiz || currentQuiz.quizId !== id) {
			fetch(quizApiUrl({ id: idParam }))
			.then((res) => res.json())
			.then((data: QuizQuestion[]) => {
				if (!data?.length) {
					throw new Error("No questions found for this quiz");
				}

				const parsedQuestionData = data.map((q) => {
					if (typeof q.quizAnswers === "string") {
						(q.quizAnswers = JSON.parse(q.quizAnswers as string) as QuizAnswer[]);
					}
					return q;
				});

				setQuizQuestions(parsedQuestionData);
			})
			.catch(setError);
		}
	}, [id, currentQuiz, idParam]);

	if (error)
		return (
			<div className="text-red-500 p-4">
				<p className="font-bold mb-1">An error has occurred:</p>
				<p>{error.message}</p>
			</div>
		);

	if (!quizQuestions) return <div className="text-center p-8">Loading...</div>;

	const onStartQuiz = () => {
		const quizData: CurrentQuizData = {
			quizId: id,
			questionData: quizQuestions,
			startTime: new Date(),
			savedAnswers: {},
		};

		fetch(startQuizApiUrl({ id: idParam }), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({userId: 'userid'}),
		})
		.then((res) => res.json())
		.then((data) => {
			const savedAnswers = data?.answers || {};
			quizData.savedAnswers = savedAnswers;
			if (data.status === 'in-progress') quizData.startTime = data.startTime;
			setQuizStatus(QuizStatus.InProgress);
			dispatch({ type: "START_QUIZ", currentQuiz: quizData });
		})
		.catch((error) => {
			console.error("Error starting quiz:", error);
		});
	};

	return (
		<div className="w-[600px] mx-auto">
			<Card className="w-[100%]">
				<CardHeader className="pb-8">
					<CardTitle>Quiz name: {title}</CardTitle>
					<CardDescription>You will be asked a series of questions. Click the Start Quiz button below to begin.</CardDescription>
					<CardContent className="text-center p-0">
						{ quizStatus === QuizStatus.NotStarted && (
							<Button onClick={onStartQuiz}>Start Quiz</Button>
						)}

					</CardContent>
				</CardHeader>
			</Card>
			<div className="min-h-[400px]">


			{ quizStatus === QuizStatus.InProgress && (
				<QuizStepper
					onComplete={(quizAnswers) => {
						setSavedAnswers(quizAnswers);
						setQuizStatus(QuizStatus.Completed);

						//dispatch({ type: "COMPLETE_QUIZ", quizId: String(id) });
					}}
				/>
			)}

			{ quizStatus === QuizStatus.Completed && (
				<QuizResults questions={quizQuestions} answers={savedAnswers} />
			)}
			</div>
			<div className="flex justify-between pt-8">
				<Link
					to={rootPath.pattern}
					className="text-muted-foreground hover:text-blue-600"
				>
					Back to home page
				</Link>
			</div>
		</div>
	);
}
