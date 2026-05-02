from flow_manager import apply_action, apply_command, initialize_session
from prompt_engine import build_response, format_response_card
import sys

sys.stdout.reconfigure(encoding='utf-8')

USER_TYPES = ("beginner", "student", "advanced")
LEARNING_MODES = ("quick", "guided", "timeline", "quiz")


def choose_value(prompt: str, valid_values: tuple[str, ...]) -> str:
    while True:
        value = input(prompt).strip().lower()
        if value in valid_values:
            return value
        print(f"Choose one of: {', '.join(valid_values)}")


def main() -> None:
    print("ElectoGuide")
    user_type = choose_value("User type (beginner/student/advanced): ", USER_TYPES)
    learning_mode = choose_value("Learning mode (quick/guided/timeline/quiz): ", LEARNING_MODES)

    session = initialize_session(user_type, learning_mode)

    while True:
        print()
        print(format_response_card(build_response(session)))
        command = input("> ").strip()

        if command.lower() in {"exit", "quit"}:
            break

        if session.quiz.active and command in {"1", "2", "3", "4"}:
            session = apply_action(session, "answer", int(command) - 1)
            continue

        session = apply_command(session, command)


if __name__ == "__main__":
    main()
