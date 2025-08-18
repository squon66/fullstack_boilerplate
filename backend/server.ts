import cors from "@fastify/cors";
import fastify from "fastify";
import { db } from "./db-client";

const server = fastify();

server.register(cors, {});

const PORT = +(process.env.BACKEND_SERVER_PORT ?? 3001);

server.get("/", async (_request, _reply) => {
	return "hello world\n";
});

server.get("/users", (_request, reply) => {
	const data = db.prepare("SELECT * FROM users").all();

	return data;
});

server.get("/quizzes", (_request, reply) => {
	const data = db.prepare("SELECT * FROM quizzes").all();

	return data;
});

server.get("/quizzes/:id", (request, reply) => {
	//const data = db.prepare("SELECT * FROM quiz_questions WHERE quiz_id = :id");
	const data = db.prepare(`
		SELECT
			q.id,
			q.question_text as questionText,
			q.points,
			q.question_order,
			json_group_array(
				json_object(
				'answer_id', a.id,
				'answer_text', a.answer_text,
				'is_correct', a.is_correct
				)
			) AS answers
			FROM quiz_questions q
			JOIN quiz_answers a
			ON q.id = a.question_id
			WHERE q.quiz_id = :id
			GROUP BY q.id, q.question_text
			ORDER BY q.question_order;
	`);

	return data.all(request.params);
});

server.listen({ port: PORT }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at http://localhost:${PORT}`);
});
