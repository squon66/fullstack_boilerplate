import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { QuizAnswerWithValue, QuizQuestion, SavedAnswers } from "@/types/quiz-types";
import { Question } from "@/components/question";
import { useQuiz } from "@/hooks/use-quiz";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { answerQuizApiUrl } from "@/paths";

interface StepperProps {
  //squestions: QuizQuestion[];
  onComplete?: (quizAnswers: SavedAnswers) => void;
}

//export const Stepper: React.FC<StepperProps> = ({ onComplete }) => {
export function QuizStepper({ onComplete }: StepperProps) {
  const quizCtx = useQuiz()

  const { state, dispatch } = quizCtx;
  const {currentQuiz} = state || {};
  const questions: QuizQuestion[] = currentQuiz?.questionData || [];
  if (!questions.length) {
    return <div className="text-red-500 p-4">No questions available for this quiz.</div>;
  }

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answerValues, setAnswerValues] = useState<SavedAnswers>(currentQuiz?.savedAnswers || {});

  const totalSteps: number = questions.length;
  const currentQuestion = questions[currentStep];

  const handleNext = (): void => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else if (onComplete) {
      onComplete(answerValues);
    }
  };
    const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Update answerValues for the current question
  const onQuestionAnswered = (answerId: string) => {
    setAnswerValues((prev) => ({
      ...prev,
      [currentQuestion.id]: answerId,
    }));

    const quizId = String(currentQuiz?.quizId);
    
    fetch(answerQuizApiUrl({ id: quizId }), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          answerId: answerId,
          sessionId: 'session-id',
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "SAVE_ANSWER", quizId: quizId, answerId: answerId });
      })
      .catch((error) => {
        console.error("Error starting quiz:", error);
      });
  };

  return (
    <div className="relative w-[600px] mx-auto mt-10">
      <Progress value={(currentStep / totalSteps) * 100} />
      {questions.map((q: QuizQuestion, idx: number) => (
        <Step
          key={q.id}
          step={currentStep === idx ? 100 : 0}
          totalSteps={100}
        >
          {currentStep === idx && (
            <>
              <Question
                question={q}
                savedAnswer={answerValues[q.id]}
                onQuestionAnswered={onQuestionAnswered}
              />
              <QuestionFooter
                onNext={handleNext}
                onPrevious={handlePrevious}
                isFirst={currentStep === 0}
                isLast={currentStep >= totalSteps - 1}
                questionAnswered={!!answerValues[currentQuestion.id]}
              />
            </>
          )}
        </Step>
      ))}
    </div>
  );
};

export const Step = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & { step: number; totalSteps: number }
>(({ className, step, totalSteps, ...props }, ref) => {
	const progressValue = (step / totalSteps) * 100;

	return (
		<div
			ref={ref}
			className={cn(
				"transition-opacity duration-300",
				progressValue === 100 ? "opacity-100" : "opacity-0",
				className,
			)}
			{...props}
		>
			{props.children}
		</div>
	);
});
Step.displayName = "Step"

type QuestionFooterProps = {
	onNext: () => void;
	onPrevious: () => void;
	isFirst: boolean;
	isLast: boolean;
	questionAnswered: boolean;
};

function QuestionFooter({ onNext, onPrevious, isFirst, isLast, questionAnswered }: QuestionFooterProps) {
	return (
		<div className="flex gap-4 mt-2">
			<Button
				onClick={onPrevious}
				disabled={isFirst}
			>
				Previous
			</Button>
			<Button
				onClick={onNext}
				disabled={!questionAnswered}
			>
				{isLast ? "Finish" : "Next"}
			</Button>
		</div>
	);
}
