from dataclasses import dataclass

from election_data import QUIZ_QUESTIONS, QuizQuestion


@dataclass
class QuizState:
    active: bool = False
    index: int = 0
    score: int = 0
    answered: bool = False
    selected: int | None = None
    feedback: str = ""
    completed: bool = False


def activate_quiz() -> QuizState:
    return QuizState(active=True)


def current_question(quiz_state: QuizState) -> QuizQuestion | None:
    if not quiz_state.active or quiz_state.completed:
        return None
    return QUIZ_QUESTIONS[quiz_state.index]


def answer_question(quiz_state: QuizState, option_index: int) -> tuple[QuizState, str]:
    if not quiz_state.active or quiz_state.completed:
        return quiz_state, "Start Quiz mode first."

    if quiz_state.answered:
        return quiz_state, "Press Next to move to the next question."

    question = QUIZ_QUESTIONS[quiz_state.index]
    quiz_state.answered = True
    quiz_state.selected = option_index
    is_correct = question.answer == option_index
    quiz_state.feedback = question.success if is_correct else question.failure

    if is_correct:
        quiz_state.score += 1

    return quiz_state, quiz_state.feedback


def advance_quiz(quiz_state: QuizState) -> tuple[QuizState, str]:
    if not quiz_state.active:
        return quiz_state, "Start Quiz mode first."

    if quiz_state.completed:
        return QuizState(), "Quiz closed. You are back in the lesson flow."

    if not quiz_state.answered:
        return quiz_state, "Choose an answer before going next."

    if quiz_state.index == len(QUIZ_QUESTIONS) - 1:
        quiz_state.completed = True
        quiz_state.feedback = f"Final score: {quiz_state.score}/{len(QUIZ_QUESTIONS)}"
        return quiz_state, quiz_state.feedback

    quiz_state.index += 1
    quiz_state.answered = False
    quiz_state.selected = None
    quiz_state.feedback = ""
    return quiz_state, "Next question ready."
