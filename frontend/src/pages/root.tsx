import { QuizzesList } from "@/components/quiz";
import { useFetchQuizzes } from "@/hooks/use-fetch";


export function RootPage() {

	const { quizzes, loading, error } = useFetchQuizzes();

	if (error) return <div>An error has occurred: {error.message}</div>;

	if (loading) return <div className="text-center p-8">Loading...</div>;

	// const welcomeText = state.savedData?.length ? 'Welcome back!' : `Welcome ${'uo'}!`;
	const welcomeText = false ? 'Welcome back!' : `Welcome ${'uo'}!`;

	return (
		<>
			<h2 className="text-xl font-bold text-muted-foreground mt-5">{welcomeText}</h2>
			<div className="text-m text-muted-foreground mt-5">Please select a quiz to take from the options below.</div>
			<div className="mt-10 text-lg text-center">
				<QuizzesList quizzes={quizzes} />
			</div>
		</>
	);
}
