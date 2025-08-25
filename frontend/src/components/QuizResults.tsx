import type { QuizQuestion, SavedAnswers } from "@/types/quiz-types";

type QuizResultsProps = {
  questions: QuizQuestion[];
  answers: SavedAnswers;
}

export function QuizResults({ questions, answers }: QuizResultsProps) {
    if (!questions.length) {
        return <div className="text-red-500 p-4">No questions available for this quiz.</div>;
    }

    const totalQuestions = questions.length;

    const quizStats = questions.reduce((acc, q) => {
        const answerId = answers[q.id];

        const chosenAnswer = q.quizAnswers.find(a => a.id === answerId);
        if (chosenAnswer?.isCorrect) {
            return { totalPoints: acc.totalPoints + q.points, numCorrect: acc.numCorrect + 1 };
        }
        return acc;
    }, { totalPoints: 0, numCorrect: 0 });

    const incorrectAnswers = questions.filter(q => {
        const answerId = answers[q.id];
        const chosenAnswer = q.quizAnswers.find(a => a.id === answerId);
        return chosenAnswer && !chosenAnswer.isCorrect;
    });

    return (
        <div>
            <QuizResultsTitle>Quiz Results</QuizResultsTitle>
            <QuizResultsSubtitle>You have completed the quiz!</QuizResultsSubtitle>
            <QuizResultsData>Num Correct: {quizStats.numCorrect}/{totalQuestions}</QuizResultsData>
            <QuizResultsData>Points: {quizStats.totalPoints}</QuizResultsData>

            <QuizResultsHeading>Incorrect Answers</QuizResultsHeading>
            {incorrectAnswers.length === 0 && <div>None! Great job!</div>}
            {incorrectAnswers.map(q => {
                return <QuizResultAnswers question={q} answers={answers} />;
            })}
        </div>
    )
}

function QuizResultsTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-lg font-bold">{children}</h2>
    );
}

function QuizResultsSubtitle({ children }: { children: React.ReactNode }) {
    return (
        <p className="mt-2">{children}</p>
    );
}   

function QuizResultsData({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-2">{children}</div>
    );
}

function QuizResultsHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="underline font-semibold">{children}</div>
    );
}

function QuizResultAnswers({ question, answers }: { question: QuizQuestion; answers: SavedAnswers }) {
    const answerId = answers[question.id];
    const chosenAnswer = question.quizAnswers.find(a => a.id === answerId);

    return (
        <div key={question.id} className="mt-2">
            <div className="font-semibold italic">{question.questionText}</div>
            <div>Your answer: {chosenAnswer?.answerText || "No answer"}</div>
            <div>Correct answer: {question.quizAnswers.find(a => a.isCorrect)?.answerText}</div>
        </div>
    );
}
