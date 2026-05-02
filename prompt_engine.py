from election_data import ACTIONS, MODE_LABELS, QUIZ_QUESTIONS, STAGES
from flow_manager import SessionState, build_progress, build_timeline


def build_response(session: SessionState) -> dict[str, object]:
    if not session.initialized:
        return {
            "title": "Welcome",
            "emoji": "🧭",
            "explanation": "Choose your user type and learning mode. ElectoGuide will adapt the lesson style.",
            "example": "Example: Beginner + Guided Journey",
            "question": "Which mode should we start with?",
            "actions": ACTIONS,
            "progress": build_progress(-1),
            "mode": "Not started",
            "summary": "",
            "hint": "Try Quick Overview for a short start.",
            "timeline": [],
            "quiz": None,
        }

    if session.quiz.active:
        return _build_quiz_response(session)

    stage = STAGES[session.current_stage]
    summary = ""
    if session.last_action in {"next", "goto"} and session.current_stage > 0 and session.current_stage % 2 == 0:
        next_stage = STAGES[min(session.current_stage + 1, len(STAGES) - 1)].label
        summary = f"Mini summary: We reached {stage.label}; next is {next_stage}."

    return {
        "title": stage.label,
        "emoji": stage.emoji,
        "explanation": _build_explanation(stage, session),
        "example": stage.example,
        "question": stage.question,
        "actions": ACTIONS,
        "progress": build_progress(session.current_stage),
        "mode": MODE_LABELS[session.learning_mode],
        "summary": summary,
        "hint": session.system_hint or "Commands: next, skip, go to voting.",
        "timeline": build_timeline() if session.learning_mode == "timeline" else [],
        "quiz": None,
    }


def format_response_card(response: dict[str, object]) -> str:
    lines = [
        f"[{response['title']} {response['emoji']}]",
        str(response["explanation"]),
        str(response["example"]),
        f"Actions: [{response['actions'][0]}] [{response['actions'][1]}] [{response['actions'][2]}] [{response['actions'][3]}]",
        f"Progress: {response['progress']}",
        f"Question: {response['question']}",
    ]

    if response["summary"]:
        lines.append(str(response["summary"]))
    if response["hint"]:
        lines.append(f"Hint: {response['hint']}")
    if response["timeline"]:
        lines.append("Timeline:")
        for item in response["timeline"]:
            lines.append(f"{item['day']} -> {item['event']} -> {item['description']}")
    if response["quiz"]:
        quiz = response["quiz"]
        for index, option in enumerate(quiz["options"], start=1):
            lines.append(f"{index}. {option}")
        if quiz["feedback"]:
            lines.append(f"Feedback: {quiz['feedback']}")

    return "\n".join(lines)


def _build_quiz_response(session: SessionState) -> dict[str, object]:
    if session.quiz.completed:
        return {
            "title": "Quiz Complete",
            "emoji": "🎯",
            "explanation": f"You scored {session.quiz.score}/{len(QUIZ_QUESTIONS)}. Review any stage or retry the quiz.",
            "example": "Example: Counting comes before government formation.",
            "question": "Would you like to go to voting or press Quiz to retry?",
            "actions": ACTIONS,
            "progress": build_progress(session.current_stage),
            "mode": MODE_LABELS["quiz"],
            "summary": "",
            "hint": session.system_hint or "Press Next to return to the lesson flow.",
            "timeline": [],
            "quiz": {
                "prompt": "",
                "options": (),
                "feedback": f"Final score: {session.quiz.score}/{len(QUIZ_QUESTIONS)}",
            },
        }

    question = QUIZ_QUESTIONS[session.quiz.index]
    return {
        "title": "Quiz Mode",
        "emoji": "🎮",
        "explanation": f"Question {session.quiz.index + 1}/{len(QUIZ_QUESTIONS)}. {question.prompt}",
        "example": "Example: The silence period happens before voting.",
        "question": "Choose one option.",
        "actions": ACTIONS,
        "progress": build_progress(session.current_stage),
        "mode": MODE_LABELS["quiz"],
        "summary": "",
        "hint": session.system_hint or ("Press Next for the next question." if session.quiz.answered else "Answer first, then continue."),
        "timeline": [],
        "quiz": {
            "prompt": question.prompt,
            "options": question.options,
            "feedback": session.quiz.feedback,
        },
    }


def _build_explanation(stage, session: SessionState) -> str:
    if session.detail_level == "simple":
        primary = stage.simple
    elif session.detail_level == "deep":
        primary = stage.deep
    elif session.user_type == "advanced":
        primary = f"{stage.summary} {stage.deep}"
    elif session.user_type == "student":
        primary = f"{stage.summary} {stage.simple}"
    else:
        primary = f"{stage.simple} {stage.summary}"

    if session.learning_mode == "quick":
        suffix = "This is the short version."
    elif session.learning_mode == "guided":
        suffix = "We move stage by stage."
    elif session.learning_mode == "timeline":
        suffix = "Watch how the schedule moves over time."
    else:
        suffix = ""

    return f"{primary} {suffix}".strip()
