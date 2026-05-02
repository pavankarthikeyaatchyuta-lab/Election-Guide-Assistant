from dataclasses import dataclass, field

from election_data import MODE_LABELS, STAGES
from quiz import QuizState, activate_quiz, advance_quiz, answer_question


STAGE_LOOKUP = {
    key: index
    for index, stage in enumerate(STAGES)
    for key in (stage.id, stage.label.lower())
}


@dataclass
class SessionState:
    initialized: bool = False
    user_type: str = "beginner"
    learning_mode: str = "guided"
    current_stage: int = 0
    detail_level: str = "default"
    interaction_count: int = 0
    last_action: str = "idle"
    system_hint: str = ""
    quiz: QuizState = field(default_factory=QuizState)


def create_session() -> SessionState:
    return SessionState()


def initialize_session(user_type: str = "beginner", learning_mode: str = "guided") -> SessionState:
    session = SessionState(
        initialized=True,
        user_type=user_type,
        learning_mode=learning_mode,
        last_action="start",
    )

    if learning_mode == "quiz":
        session.quiz = activate_quiz()

    return session


def parse_command(raw_input: str) -> tuple[str, str | None] | None:
    command = str(raw_input or "").strip().lower()

    if not command:
        return None
    if command in {"next", "skip", "quiz"}:
        return command, None
    if command in {"simple", "explain simple"}:
        return "simple", None
    if command in {"deep", "deep dive"}:
        return "deep", None
    if command.startswith("go to "):
        return "goto", command.replace("go to ", "", 1).strip()
    return None


def apply_action(session: SessionState, action: str, payload: str | int | None = None) -> SessionState:
    session.system_hint = ""

    if not session.initialized:
        session.system_hint = "Choose a user type and learning mode first."
        return session

    if action in {"next", "skip"}:
        return _advance(session)
    if action == "simple":
        session.detail_level = "simple"
        session.last_action = "simple"
        session.interaction_count += 1
        return session
    if action == "deep":
        session.detail_level = "deep"
        session.last_action = "deep"
        session.interaction_count += 1
        return session
    if action == "quiz":
        session.quiz = activate_quiz()
        session.last_action = "quiz"
        session.interaction_count += 1
        return session
    if action == "answer":
        session.quiz, session.system_hint = answer_question(session.quiz, int(payload))
        session.last_action = "answer"
        session.interaction_count += 1
        return session
    if action == "goto":
        return _jump_to_stage(session, str(payload or ""))

    session.system_hint = "Try Next, Explain Simple, Deep Dive, Quiz, or a stage command."
    return session


def apply_command(session: SessionState, raw_input: str) -> SessionState:
    parsed = parse_command(raw_input)

    if not parsed:
        session.system_hint = "I did not catch that. Try `next`, `skip`, or `go to voting`."
        return session

    action, payload = parsed
    return apply_action(session, action, payload)


def build_progress(stage_index: int) -> str:
    return "[" + "".join("✔" if index <= stage_index else "⬜" for index, _ in enumerate(STAGES)) + "]"


def build_timeline() -> list[dict[str, str]]:
    return [
        {
            "day": stage.day,
            "event": stage.label,
            "description": stage.summary,
        }
        for stage in STAGES
    ]


def mode_label(session: SessionState) -> str:
    return MODE_LABELS[session.learning_mode]


def _advance(session: SessionState) -> SessionState:
    if session.quiz.active:
        session.quiz, message = advance_quiz(session.quiz)
        session.system_hint = message
        if not session.quiz.active and session.learning_mode == "quiz":
            session.learning_mode = "guided"
        session.last_action = "next"
        return session

    session.detail_level = "default"
    session.interaction_count += 1

    if session.current_stage < len(STAGES) - 1:
        session.current_stage += 1
        session.last_action = "next"
        return session

    session.last_action = "next"
    session.system_hint = "You have reached the final stage. Try Quiz or jump to any stage."
    return session


def _jump_to_stage(session: SessionState, target: str) -> SessionState:
    stage_index = STAGE_LOOKUP.get(target.strip().lower())

    if stage_index is None:
        session.system_hint = "That stage was not found. Try `go to voting` or `go to counting`."
        return session

    session.current_stage = stage_index
    session.detail_level = "default"
    session.quiz = QuizState()
    session.interaction_count += 1
    session.last_action = "goto"
    return session
