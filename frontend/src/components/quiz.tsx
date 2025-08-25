import { QuizContext } from "@/components/quiz-provider";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { quizPath } from "@/paths";
import type { QuizWithProgress } from "@/types/quiz-types";
import { useContext } from "react";
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

export enum QuizStatus {
	NotStarted = "Not Started",
	InProgress = "In Progress",
	Completed = "Completed"
}

//function QuizItem({ title, id, quizStatus }: QuizWithProgress) {
function QuizItem(quiz: QuizWithProgress) {
	const quizCtx = useContext(QuizContext);
	const { state } = quizCtx;
	const { quizzes } = state;
	const selectedQuiz = quizzes.find((q) => q?.id === quiz?.id);

	const { quizStatus, title, id } = selectedQuiz || {};

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

export function QuizzesList({ quizzes }: { quizzes: QuizWithProgress[] }) {
//export function QuizzesList({ quizzes }: { quizzes: Quiz[] }) {
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
