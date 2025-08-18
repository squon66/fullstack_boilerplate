import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { quizPath } from "@/paths";
import type { QuizAnswer, QuizQuestion, QuizWithProgress } from "@/types/quiz-types";
import { useState } from "react";
import { Link } from "react-router-dom";

function LeftTableCell({ children }: { children: React.ReactNode }) {
	return (
		<TableCell className="text-left">
			{children}
		</TableCell>
	);
}

function CenterTableHead({ children }: { children: React.ReactNode }) {
	return (
		<TableHead className="text-center">
			{children}
		</TableHead>
	);
}

function QuizItem({ title, id, quizStatus }: QuizWithProgress) {
	let buttonLabel = 'Take quiz';
	if (quizStatus === QuizStatus.InProgress) {
		buttonLabel = 'Continue quiz';
	} else if (quizStatus === QuizStatus.Completed) {
		buttonLabel = 'Review quiz';
	}

	return (
		<TableRow key={id}	>
			<LeftTableCell>{title}</LeftTableCell>
			<TableCell>{quizStatus}</TableCell>
			<TableCell>
				<Button asChild>
					<Link to={quizPath({ id: id.toString()})}>{buttonLabel}</Link>
				</Button>
			</TableCell>
		</TableRow>
	);
}

export enum QuizStatus {
	NotStarted = "Not Started",
	InProgress = "In Progress",
	Completed = "Completed"
}

//Quiz data
export type Quiz = {
	id: number;
	title: string;
	quizStatus: QuizStatus;
};

export function QuizzesList({ quizzes }: { quizzes: QuizWithProgress[] }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<CenterTableHead>Status</CenterTableHead>
					<CenterTableHead>Actions</CenterTableHead>
				</TableRow>
			</TableHeader>
			<TableBody>{quizzes.map((quiz) => QuizItem(quiz))}</TableBody>
		</Table>
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
