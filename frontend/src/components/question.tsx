import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { QuizAnswer, QuizQuestion } from "@/types/quiz-types";
import { useState } from "react";

type QuestionProps = {
  question: QuizQuestion;
  savedAnswer: string;
  onQuestionAnswered: (answerId: string) => void;
}

function QuestionText({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-lg font-semibold">{children}</h2>
  );
}
export function Question({ question, savedAnswer, onQuestionAnswered }: QuestionProps) {
  const onAnswerSelected = (answerId: string) => {
    onQuestionAnswered(answerId);
  };

	return (
		<div className="p-6 transition-opacity duration-300">
      <QuestionText>{question.questionText}</QuestionText>
			<Answers answers={question.quizAnswers} savedAnswerId={savedAnswer} onAnswerSelected={onAnswerSelected} />
		</div>
	);
}

type AnswersProps = {
  answers: QuizAnswer[];
  savedAnswerId: string;
  onAnswerSelected?: (answerId: string) => void;
};

function Answers({ answers, savedAnswerId, onAnswerSelected }: AnswersProps) {
    const [value, setValue] = useState<string>(savedAnswerId);

    const onValueChange= (value: string) => {
        setValue(value);
        onAnswerSelected?.(value);
    };  

  return (
    <RadioGroup value={value} onValueChange={onValueChange} className="flex flex-col gap-2">
      {answers.map((answer: QuizAnswer) => (
        <Answer
          key={answer.id}
          answer={answer}
        />
      ))}
    </RadioGroup>
  );
};

type AnswerProps = {
  answer: QuizAnswer;
}

function Answer({ answer }: AnswerProps) {
	const { id, answerText } = answer;
  return (
    <RadioGroupContainer>
      <RadioGroupItem value={id} id={`option${id}`} />
      <RadioGroupLabel id={id} answerText={answerText} />
    </RadioGroupContainer>
  );
};

function RadioGroupContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center">
      {children}
    </div>
  );
}

function RadioGroupLabel({ id, answerText }: { id: string; answerText: string }) {
  return (
    <label htmlFor={`option${id}`} className="ml-2">{answerText}</label>
  );  
}
