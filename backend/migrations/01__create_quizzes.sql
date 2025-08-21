 -- Quizzes table
CREATE TABLE quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Perhaps it would be better to have a junction table to link quizzes and questions (many-to-many relationship)
-- so that a question can belong to multiple quizzes.
-- However, for simplicity, we will assume each question belongs to one quiz.

-- Questions table
CREATE TABLE quiz_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    points INTEGER DEFAULT 1, -- how many points this question is worth
    question_order INTEGER, -- allows change of order of questions
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
    UNIQUE (quiz_id, question_order) -- ensure unique order values for questions in a particular quiz
);

-- 3) Answers table
CREATE TABLE quiz_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct INTEGER NOT NULL DEFAULT 0 CHECK(is_correct IN (0, 1)), -- value should be 1 or 0
    FOREIGN KEY (question_id) REFERENCES quiz_questions (id) ON DELETE CASCADE
);

-- ensure only one correct answer per question
CREATE UNIQUE INDEX one_correct_answer_per_question
    ON quiz_answers (question_id)
    WHERE is_correct = 1;

-- -- Table to record each user's quiz attempt, including total time taken
-- CREATE TABLE user_quiz_sessions (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER NOT NULL,
--     quiz_id INTEGER NOT NULL,
--     started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     completed_at DATETIME,
--     total_time_seconds INTEGER, -- total time to take the quiz in seconds
--     FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
--     FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
-- );

-- -- Table to record each answer a user gives during a quiz attempt
-- CREATE TABLE user_quiz_answers (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     session_id INTEGER NOT NULL,
--     question_id INTEGER NOT NULL,
--     answer_id INTEGER NOT NULL,
--     answered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (attempt_id) REFERENCES user_quiz_attempts (id) ON DELETE CASCADE,
--     FOREIGN KEY (question_id) REFERENCES quiz_questions (id) ON DELETE CASCADE,
--     FOREIGN KEY (answer_id) REFERENCES quiz_answers (id) ON DELETE CASCADE
-- );