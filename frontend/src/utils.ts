import { LOCAL_STORAGE_QUESTION_DATA, LOCAL_STORAGE_QUIZ_DATA } from "@/consts/quiz-constants";
import type { Quiz } from "@/types/quiz-types";

const getQuizzes = (): Quiz[] => {
    // Retrieve quizzes from localStorage
    // If not found, return an empty array
    const savedQuizzes = localStorage.getItem(LOCAL_STORAGE_QUIZ_DATA);
    return savedQuizzes ? JSON.parse(savedQuizzes) : [];
}

// We can also implement saving and retrievine quizzes from the db and modify these
// functions to check db if localStorage data doesn't exist
const getQuizQuestions = (): Quiz[] | null => {
    // Retrieve quiz questions from localStorage
    // If not found, return null
    const savedQuestions = localStorage.getItem(LOCAL_STORAGE_QUESTION_DATA);
    return savedQuestions ? JSON.parse(savedQuestions) : null;
}

export const getInitialState = () => {
    const savedQuizzes = getQuizzes()
    const savedQuestions = getQuizQuestions()

    return {
        quizzes: savedQuizzes,
        currentQuiz: savedQuestions,
    }
}
   