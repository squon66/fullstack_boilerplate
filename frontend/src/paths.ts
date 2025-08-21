
import { type Params, path as pathFactory } from "static-path";

const SERVER_HOST = import.meta.env.VITE_BACKEND_SERVER || "localhost:3001";
export const SERVER_ORIGIN = `http://${SERVER_HOST}`;

const apiUrlFactory = <T extends string>(pattern: T) => {
	const builder = pathFactory(pattern);
	return (params: Params<T>) => SERVER_ORIGIN + builder(params);
};

// api urls
export const quizzesApiUrl = apiUrlFactory("/quizzes");
export const quizApiUrl = apiUrlFactory("/quizzes/:id");
export const startQuizApiUrl = apiUrlFactory("/quizzes/:id/start");
export const finishQuizApiUrl = apiUrlFactory("/quizzes/:id/finish");
export const answerQuizApiUrl = apiUrlFactory("/quizzes/:id/answer");

// local routes
export const rootPath = pathFactory("/");
export const quizPath = pathFactory("/quizzes/:id");
export const quizzesPath = pathFactory("/quizzes");
