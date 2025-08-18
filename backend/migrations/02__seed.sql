-- Create some test usrs
INSERT INTO users (name, email) VALUES
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com'),
  ('Alice Johnson', 'alice@example.com'),
  ('Bob Brown', 'bob@example.com');

-- Create test quizs
INSERT INTO quizzes (title) VALUES
  ('Basic Skeletal System Quiz'),
  ('Cardiovascular System Basics'),
  ('Digestive System Overview');

-- Insert questions for quizzex
INSERT INTO quiz_questions (quiz_id, question_text, points, question_order) VALUES 
  -- Questions for quiz #1
  (1, 'Which bone is the longest in the human body?', 2, 4),
  (1, 'How many bones are in the adult human body?', 1, 3),
  (1, 'Which part of the skull protects the brain?', 3, 2),
  (1, 'What is the common name for the clavicle?', 1, 1),

  -- Questions for quiz #2
  (2, 'Which chamber of the heart pumps blood to the body?', 1, 1),
  (2, 'What is the main function of red blood cells?', 2, 2),
  (2, 'Which blood vessel carries oxygenated blood?', 1, 3),
  (2, 'How many chambers are in the human heart?', 3, 4),
  (2, 'Question 5', 1, 5),

  -- Questions for quiz #3
  (3, 'Where does chemical digestion begin?', 2, 1),
  (3, 'Which organ produces bile?', 1, 2),
  (3, 'What is the longest part of the digestive system?', 2, 3),
  (3, 'Which enzyme breaks down proteins in the stomach?', 3, 4);

-- Insert answers for questions

INSERT INTO quiz_answers (question_id, answer_text, is_correct) VALUES
  -- Insert answers for question #1
  (1, 'Femur', 1),
  (1, 'Tibia', 0),
  (1, 'Humerus', 0),
  (1, 'Radius', 0),

  -- Insert answers for question #2
  (2, '186', 0),
  (2, '206', 1),
  (2, '226', 0),
  (2, '196', 0),

  -- Insert answers for question #3
  (3, 'Mandible', 0),
  (3, 'Maxilla', 0),
  (3, 'Cranium', 1),
  (3, 'Hyoid', 0),

  -- Insert answers for question #4
  (4, 'Wishbone', 0),
  (4, 'Shoulderblade', 0),
  (4, 'Neckbone', 0),
  (4, 'Collarbone', 1),

  -- Insert answers for question #5
  (5, 'Right ventricle', 0),
  (5, 'Left atrium', 0),
  (5, 'Right atrium', 0),
  (5, 'Left ventricle', 1),

  -- Insert answers for question #6
  (6, 'Fight infection', 0),
  (6, 'Form blood clots', 0),
  (6, 'Carry oxygen', 1),
  (6, 'Produce antibodies', 0),

  -- Insert answers for question #7
  (7, 'Veins', 0),
  (7, 'Arteries', 1),
  (7, 'Capillaries', 0),
  (7, 'Venules', 0),

  -- Insert answers for question #8
  (8, '4', 1),
  (8, '2', 0),
  (8, '3', 0),
  (8, '6', 0),

  -- Insert answers fo  r question #9
  (9, 'Stomach', 0),
  (9, 'Small intestine', 0),
  (9, 'Mouth', 1),
  (9, 'Esophagus', 0),

  -- Insert answers for question #10
  (10, 'Pancreas', 0),
  (10, 'Gallbladder', 0),
  (10, 'Stomach', 0),
  (10, 'Liver', 1),

  -- Insert answers for question #11
  (11, 'Small intestine', 1),
  (11, 'Large intestine', 0),
  (11, 'Esophagus', 0),
  (11, 'Stomach', 0),

  -- Insert answers for question #12
  (12, 'Amylase', 0),
  (12, 'Pepsin', 1),
  (12, 'Lipase', 0),
  (12, 'Trypsin', 0);