from flow_manager import apply_action, apply_command, initialize_session, parse_command
from prompt_engine import build_response, format_response_card
import sys
import os
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')

# Lightweight .env loader
def load_env():
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ[key.strip()] = value.strip()

load_env()

try:
    from google import genai
    client = genai.Client()
except Exception as e:
    client = None


USER_TYPES = ("beginner", "student", "advanced")
LEARNING_MODES = ("quick", "guided", "timeline", "quiz")


def choose_value(prompt: str, valid_values: tuple[str, ...]) -> str:
    while True:
        value = input(prompt).strip().lower()
        if value in valid_values:
            return value
        print(f"Choose one of: {', '.join(valid_values)}")


def ask_gemini(question: str, stage_label: str) -> str:
    if not client:
        return "I'm sorry, the Gemini API is not configured. Please set the GEMINI_API_KEY."
    
    prompt = f"""
    You are ElectoGuide, an expert AI election assistant.
    The user is asking a question while they are in the '{stage_label}' stage.
    
    Question: {question}
    
    Provide a short, direct, and highly informative answer (max 3 sentences).
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        return response.text
    except Exception as e:
        return f"API Error: {str(e)}"


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

        parsed = parse_command(command)
        if not parsed:
            # It's an unrecognized command, treat it as a question for the AI
            from election_data import STAGES
            stage_label = STAGES[session.current_stage].label
            print("\n[🤖 Assistant is thinking...]")
            answer = ask_gemini(command, stage_label)
            print(f"\n💡 AI Response: {answer}")
            input("\nPress Enter to continue...")
            continue

        session = apply_action(session, parsed[0], parsed[1])


if __name__ == "__main__":
    main()
