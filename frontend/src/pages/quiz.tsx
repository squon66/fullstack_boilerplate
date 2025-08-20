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
import type { Quiz, QuizAnswer, QuizQuestion, QuizQuestionsWithProgress, QuizWithProgress, SavedAnswer } from "@/types/quiz-types";
import { QuizStatus } from "@/components/quiz";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function QuizPage() {
	const { id } = useParams();
	if (!id) throw new Error("Quiz id param is required");

	// const quizCtx = useContext(QuizContext);
	// if (!quizCtx) throw new Error("Must be used within QuizProvider");

	// const { state, dispatch } = quizCtx;
	// const { quizzes, lastQuizId, questions } = state;
	// if (!quizzes) throw new Error("No quizzes available in context");

	// const selectedQuiz: QuizWithProgress | undefined = quizzes.find((quiz: QuizWithProgress) => quiz.id.toString() === id);
	// if (!selectedQuiz) throw new Error(`Quiz with id ${id} not found in parsed quizzes`);

	//const [questionData, setQuestionData] = useState<QuizQuestionsWithProgress[] | null>(null);
	const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [quizStatus, setQuizStatus] = useState<QuizStatus | null>(QuizStatus.NotStarted);

	useEffect(() => {
		// if (selectedQuiz.id === lastQuizId) {
		// 	setQuestionData(questions);
		// 	return; // Quizzes already loaded in context
		// }

		fetch(quizApiUrl({ id }))
			.then((res) => res.json())
			.then((data) => {
				if (!data?.length) {
					throw new Error("No questions found for this quiz");
				}

				const parsedQuestionData = data.map((q) => {
					if (typeof q.quizAnswers === "string") {
						(q.quizAnswers = JSON.parse(q.quizAnswers as string) as QuizAnswer[]);
					}
					return q;
				});
				setQuiz(parsedQuestionData);
				// const parsedQuestionData = data.map((q) => {
				// 	return {
				// 		...q,
				// 		savedAnswer: JSON.parse(q.answers as string) as SavedAnswer,
				// 	}
				// });

				//setQuestionData(parsedQuestionData);
			})
			.catch(setError);
	}, [id]);

	if (error)
		return (
			<div className="text-red-500 p-4">
				<p className="font-bold mb-1">An error has occurred:</p>
				<p>{error.message}</p>
			</div>
		);

	if (!quiz) return <div className="text-center p-8">Loading...</div>;

	const onStartQuiz = () => {
		setQuizStatus(QuizStatus.InProgress);
		//dispatch({ type: "START_QUIZ", quizId: selectedQuiz.id });
	};

	//const { quizStatus, title } = selectedQuiz;

	const title = 'Quiz Title'; //quiz.title || "Quiz";

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
					questions={quiz}
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

type QuestionProps = {
  question: QuizQuestion;
  onSelect: (answer: string, index: number) => void;
  onNext: () => void;
  isLast: boolean;
}

export function Question({ question, onSelect, onNext, isLast }: QuestionProps) {
  const [questionAnswered, setQuestionAnswered] = useState<boolean>(false);

  const setAnswer = (answer: string, index: number) => {
    console.log("Selected answer:", answer, "for question index:", index);
    setQuestionAnswered(true);
    // Here you can handle the selected answer, e.g., store it in state or send it to a server
  };
  return (
    <div className="p-6 transition-opacity duration-300">
      <h2 className="mb-4 text-lg font-semibold">{question.questionText}</h2>
      <Answers answers={question.quizAnswers} onSelect={setAnswer} />
      <Button
        className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded"
        onClick={onNext}
        disabled={!questionAnswered}
      >
        {isLast ? "Finish" : "Next"}
      </Button>
    </div>
  );
}

type AnswersProps = {
  answers: QuizAnswer[];
  onSelect?: (answer: string, index: number) => void;
};

function Answers({ answers, onSelect }: AnswersProps) {
	console.log(answers)
    const [value, setValue] = useState<string>('');

    const onAnswerSelected = (value: string) => {
        setValue(value);
        const index = Number.parseInt(value, 10);
        if (onSelect) {
        onSelect(answers[index].answerText, index);
        }
    };  

  return (
    <RadioGroup value={value} onValueChange={onAnswerSelected} className="flex flex-col gap-2">
      {answers.map((answer: QuizAnswer, i: number) => (
        <Answer
          key={answer.id}
          answer={answer}
          index={i}
        />
      ))}
    </RadioGroup>
  );
};

interface AnswerProps {
  answer: QuizAnswer;
  index: number;
  onSelect?: (answer: string, index: number) => void;
}

function Answer({ answer, index, onSelect }: AnswerProps) {
  return (
    <div className="flex items-center">
      <RadioGroupItem value={index + ''} id={`option${index}`} />
      <label htmlFor={`option${index}`} className="ml-2">{answer.answerText}</label>
    </div>
  );
};
