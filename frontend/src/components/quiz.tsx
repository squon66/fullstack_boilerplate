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
import type { Quiz, QuizAnswer, QuizQuestion, QuizWithProgress } from "@/types/quiz-types";
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

export enum QuizStatus {
	NotStarted = "Not Started",
	InProgress = "In Progress",
	Completed = "Completed"
}

function QuizItem({ title, id }: Quiz) {
	let buttonLabel = 'Take quiz';
	// if (quizStatus === QuizStatus.InProgress) {
	// 	buttonLabel = 'Continue quiz';
	// } else if (quizStatus === QuizStatus.Completed) {
	// 	buttonLabel = 'Review quiz';
	// }

	const quizStatus = QuizStatus.NotStarted;

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

//Quiz data
// export type Quiz = {
// 	id: number;
// 	title: string;
// 	//quizStatus: QuizStatus;
// };

export function QuizzesList({ quizzes }: { quizzes: Quiz[] }) {
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
