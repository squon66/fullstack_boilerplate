import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { QuizStepper } from "@/components/stepper";
import { quizApiUrl, rootPath } from "@/paths";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QuizContext } from "@/components/quiz-provider";
import type { QuizQuestionsWithProgress, QuizWithProgress, SavedAnswer } from "@/types/quiz-types";
import { QuizStatus } from "@/components/quiz";

export function QuizPage() {
	const { id } = useParams();
	if (!id) throw new Error("Quiz id param is required");

	const quizCtx = useContext(QuizContext);
	if (!quizCtx) throw new Error("Must be used within QuizProvider");

	const { state, dispatch } = quizCtx;
	const { quizzes, lastQuizId, questions } = state;
	if (!quizzes) throw new Error("No quizzes available in context");

	const selectedQuiz: QuizWithProgress | undefined = quizzes.find((quiz: QuizWithProgress) => quiz.id.toString() === id);
	if (!selectedQuiz) throw new Error(`Quiz with id ${id} not found in parsed quizzes`);

	const [questionData, setQuestionData] = useState<QuizQuestionsWithProgress[] | null>(null);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (selectedQuiz.id === lastQuizId) {
			setQuestionData(questions);
			return; // Quizzes already loaded in context
		}

		fetch(quizApiUrl({ id }))
			.then((res) => res.json())
			.then((data) => {
				if (!Array.isArray(data)) {
					throw new Error("Invalid question data format");
				}
				if (data.length === 0) {
					throw new Error("No questions found for this quiz");
				}
				const parsedQuestionData = data.map((q) => {
					return {
						...q,
						savedAnswer: JSON.parse(q.answers as string) as SavedAnswer,
					}
				});

				setQuestionData(parsedQuestionData);
			})
			.catch(setError);
	}, [id, lastQuizId, questions, selectedQuiz.id]);

	if (error)
		return (
			<div className="text-red-500 p-4">
				<p className="font-bold mb-1">An error has occurred:</p>
				<p>{error.message}</p>
			</div>
		);

	if (!questionData) return <div className="text-center p-8">Loading...</div>;

	const onStartQuiz = () => {
		dispatch({ type: "START_QUIZ", quizId: selectedQuiz.id });
	};

	const { quizStatus, title } = selectedQuiz;

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

		
			{ true && (
				<QuizStepper
					questions={questionData}
					onComplete={() => alert("Quiz completed!")}
				/>
			)}

			{ quizStatus === QuizStatus.Completed && (
				<div className="text-center p-8">You have completed this quiz.</div>
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
