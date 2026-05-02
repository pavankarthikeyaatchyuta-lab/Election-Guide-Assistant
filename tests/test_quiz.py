import unittest

from quiz import activate_quiz, advance_quiz, answer_question


class QuizTests(unittest.TestCase):
    def test_correct_answer_increases_score(self) -> None:
        quiz_state = activate_quiz()
        quiz_state, message = answer_question(quiz_state, 0)
        self.assertEqual(quiz_state.score, 1)
        self.assertIn("Correct", message)

    def test_next_requires_answer_first(self) -> None:
        quiz_state = activate_quiz()
        quiz_state, message = advance_quiz(quiz_state)
        self.assertIn("Choose an answer", message)

    def test_quiz_advances_after_answer(self) -> None:
        quiz_state = activate_quiz()
        quiz_state, _ = answer_question(quiz_state, 0)
        quiz_state, message = advance_quiz(quiz_state)
        self.assertEqual(quiz_state.index, 1)
        self.assertIn("Next question", message)


if __name__ == "__main__":
    unittest.main()
