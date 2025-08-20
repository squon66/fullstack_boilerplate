import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/types/quiz-types";
import { Question } from "@/pages/quiz";

interface StepperProps {
  questions: QuizQuestion[];
  onComplete?: () => void;
}

export const QuizStepper: React.FC<StepperProps> = ({ questions, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps: number = questions.length;

  const handleNext = (): void => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (onComplete) {
      onComplete();
    }
  };  

  const setAnswer = () => {};

  return (
    <div className="relative w-[600px] mx-auto mt-10">
      {questions.map((q: QuizQuestion, idx: number) => (
        <Step
          key={q.id}
          step={currentStep === idx + 1 ? 100 : 0}
          totalSteps={100}
        >
          {currentStep === idx + 1 && (
            <Question
              question={q}
              onSelect={setAnswer}
              onNext={handleNext}
              isLast={currentStep === totalSteps}
            />
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
