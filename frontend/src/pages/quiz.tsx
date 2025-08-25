import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { QuizStepper } from "@/components/stepper";
import { rootPath } from "@/paths";
import { Link, useParams } from "react-router-dom";
import { QuizStatus } from "@/components/quiz";
import { QuizResults } from "@/components/QuizResults";
import { useFetchQuiz, useFetchQuizzes } from "@/hooks/use-fetch";
import { useQuizContext } from "@/hooks/use-quiz";

export function QuizPage() {
	const { id: idParam } = useParams();
	if (!idParam) throw new Error("Quiz id param is required");
	const id = Number(idParam);

	const { quizzes, loading: quizzesLoading, error: quizzesError } = useFetchQuizzes();
	const { quiz, loading: quizLoading, error: quizError } = useFetchQuiz(id);

	console.log(quiz?.savedAnswers)

	const quizCtx = useQuizContext();
	const { dispatch } = quizCtx;

	const selectedQuiz = quizzes.find((quiz) => quiz?.id === id);

	const { title, quizStatus } = selectedQuiz || {};

	const error = quizError || quizzesError;

	if (error)
		return (
			<div className="text-red-500 p-4">
				<p className="font-bold mb-1">An error has occurred:</p>
				<p>{error.message}</p>
			</div>
		);

	if (quizLoading || quizzesLoading || !quiz) return <div className="text-center p-8">Loading...</div>;

	const onStartQuiz = () => {
		dispatch({ type: "START_QUIZ", quizId: id });
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
					questions={quiz.questionData}
					onComplete={(quizAnsers) => {
						//setSavedAnswers(quizAnswers);
						//setQuizStatus(QuizStatus.Completed);

						dispatch({ type: "COMPLETE_QUIZ", quizId: String(id) });
					}}
				/>
			)}

			{ quizStatus === QuizStatus.Completed && (
				<QuizResults questions={quiz?.questionData} answers={quiz?.savedAnswers} />
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
