import cors from "@fastify/cors";
import fastify from "fastify";
import { db } from "./db-client";

const server = fastify();

server.register(cors, {});

const PORT = +(process.env.BACKEND_SERVER_PORT ?? 3001);

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
					'id', a.id,
					'answerText', a.answer_text,
					'isCorrect', a.is_correct
				)
			) AS quizAnswers
			FROM quiz_questions q
			JOIN quiz_answers a
			ON q.id = a.question_id
			WHERE q.quiz_id = :id
			GROUP BY q.id, q.question_text
			ORDER BY q.question_order;
	`);

	return data.all(request.params);
});

server.post("/quizzes/:id/start", (request, reply) => {
		const { id } = request.params as { id: number | string };
		const { userId } = request.body as { userId?: number };
		if (!userId) {
			reply.status(400).send({ error: "Missing userId in request body" });
			return;
		}
		// retrieve the quiz session for the user
		// For now, let's just return a dummy session
		// In a real application, you would query the database to get the session details

		// NEW QUIZ
		reply.send({
			sessionId: "session-abc",
			quizId: id,
			status: "not-started",
			startTime: "2025-08-17T20:00:00Z",
			answers: {}
		});

		// IN PROGRESS QUIZZ
		// reply.send({
		// 	sessionId: "session-abc",
		// 	quizId: id,
		// 	status: "in-progress",
		// 	startTime: "2025-08-17T20:00:00Z",
		// 	answers: { '1': 'b', '2': 'c' }
		// });

});

server.post("/quizzes/:id/answer", (request, reply) => {
		const { id } = request.params as { id: number | string };
		const { questionId, answerId, sessionId } = request.body as { questionId: number; answerId: string, sessionId: string };
		if (!questionId || !answerId || !sessionId) {
			reply.status(400).send({ error: "Missing questionId, answerId or sessionId in request body" });
			return;
		}
		// Save the answer to the database, now including sessionId


		// Optionally, you could return a success message
		reply.send({ success: true, quizId: id, questionId, answerId, sessionId });
});

server.post("/quizzes/:id/finish", (request, reply) => {
		const { id } = request.params as { id: number | string };
		const { sessionId } = request.body as { sessionId?: string };

		if (!sessionId) {
			reply.status(400).send({ error: "Missing sessionId in request body" });
			return;
		}

		// Save data here

		// For now, let's just return a dummy response
		reply.send({ quizId: id, sessionId });
});


server.listen({ port: PORT }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at http://localhost:${PORT}`);
});
