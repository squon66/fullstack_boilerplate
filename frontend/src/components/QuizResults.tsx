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
            <h2 className="text-lg font-bold">Quiz Results</h2>
            <p className="mt-2">You have completed the quiz!</p>
            <div className="mt-2">Num Correct: {quizStats.numCorrect}/{totalQuestions}</div>
            <div className="mt-2">Points: {quizStats.totalPoints}</div>
            
            <div className="underline font-semibold">Incorrect Answers</div>
            {incorrectAnswers.length === 0 && <div>None! Great job!</div>}
            {incorrectAnswers.map(q => {
                const answerId = answers[q.id];
                const chosenAnswer = q.quizAnswers.find(a => a.id === answerId);
                return (
                    <div key={q.id} className="mt-2">
                        <div className="font-semibold italic">{q.questionText}</div>
                        <div>Your answer: {chosenAnswer?.answerText || "No answer"}</div>
                        <div>Correct answer: {q.quizAnswers.find(a => a.isCorrect)?.answerText}</div>
                    </div>
                );
            })}
        </div>
    )
}
