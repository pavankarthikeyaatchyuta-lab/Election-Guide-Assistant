from dataclasses import dataclass


@dataclass(frozen=True)
class Stage:
    id: str
    label: str
    emoji: str
    day: str
    summary: str
    simple: str
    deep: str
    example: str
    question: str


@dataclass(frozen=True)
class QuizQuestion:
    prompt: str
    options: tuple[str, str, str, str]
    answer: int
    success: str
    failure: str


STAGES: tuple[Stage, ...] = (
    Stage(
        id="announcement",
        label="Announcement",
        emoji="📢",
        day="Day 0",
        summary="The election authority publishes the official schedule and rules.",
        simple="This is the public start signal for the election.",
        deep="It sets the legal calendar for nominations, campaigning, voting, and counting.",
        example="Example: Polling dates are announced for each region.",
        question="What usually needs to happen right after the schedule is announced?",
    ),
    Stage(
        id="nomination",
        label="Nomination",
        emoji="📝",
        day="Day 2",
        summary="Candidates submit forms and documents to officially enter the race.",
        simple="People who want to contest must sign up correctly.",
        deep="Election officials review eligibility, paperwork, and deadlines before finalizing valid candidates.",
        example="Example: A candidate files nomination papers before the last date.",
        question="Why is checking forms important during nomination?",
    ),
    Stage(
        id="campaigning",
        label="Campaigning",
        emoji="📣",
        day="Day 6",
        summary="Candidates explain their plans and ask voters for support.",
        simple="This is when candidates talk to people and share ideas.",
        deep="Campaigning can include speeches, manifestos, outreach, and debates within election rules.",
        example="Example: A candidate holds a public meeting to explain policy promises.",
        question="How does campaigning help voters make a choice?",
    ),
    Stage(
        id="silence-period",
        label="Silence Period",
        emoji="🤫",
        day="Day 18",
        summary="Campaigning stops shortly before voting so voters can think calmly.",
        simple="This is a quiet time before the vote.",
        deep="The silence period reduces last-minute influence and protects a fair decision environment.",
        example="Example: No rallies or campaign messages are allowed in the final hours.",
        question="Why might a quiet period help voters?",
    ),
    Stage(
        id="voting",
        label="Voting",
        emoji="🗳️",
        day="Day 20",
        summary="Eligible voters cast their ballots at polling stations or approved channels.",
        simple="This is the day people choose by voting.",
        deep="Voting usually follows identity checks, ballot secrecy, and supervised procedures.",
        example="Example: A voter verifies identity and casts a secret ballot.",
        question="What makes voting both secure and fair?",
    ),
    Stage(
        id="counting",
        label="Counting",
        emoji="📦",
        day="Day 21",
        summary="Officials count votes and verify totals under supervision.",
        simple="Votes are opened and counted carefully.",
        deep="Counting includes reconciliation, observation, and result verification before declaration.",
        example="Example: Ballots are tallied in front of authorized observers.",
        question="Why does counting need supervision?",
    ),
    Stage(
        id="government-formation",
        label="Government Formation",
        emoji="🏛️",
        day="Day 24",
        summary="The winning majority or coalition forms the government after results.",
        simple="The group with enough support starts governing.",
        deep="If no single group has enough seats, coalition negotiations may decide who governs.",
        example="Example: Parties with a majority of seats form the new government.",
        question="What happens if no party wins enough seats alone?",
    ),
)


QUIZ_QUESTIONS: tuple[QuizQuestion, ...] = (
    QuizQuestion(
        prompt="Who usually announces the election schedule?",
        options=(
            "The election authority",
            "Any candidate",
            "Only the media",
            "Only voters",
        ),
        answer=0,
        success="Correct. The election authority releases the official schedule.",
        failure="Not quite. The official schedule is announced by the election authority.",
    ),
    QuizQuestion(
        prompt="What happens during nomination?",
        options=(
            "Votes are counted",
            "Candidates file forms",
            "Government is formed",
            "Campaigning is banned",
        ),
        answer=1,
        success="Correct. Nomination is when candidates submit their papers.",
        failure="Not quite. Nomination is the stage for filing candidate papers.",
    ),
    QuizQuestion(
        prompt="Which stage comes right before voting?",
        options=(
            "Campaigning",
            "Announcement",
            "Silence Period",
            "Counting",
        ),
        answer=2,
        success="Correct. The silence period happens just before voting.",
        failure="Not quite. The silence period is the step right before voting.",
    ),
    QuizQuestion(
        prompt="What is the main event on voting day?",
        options=(
            "Candidates submit forms",
            "Voters cast secret ballots",
            "Results are declared",
            "Parties form a coalition",
        ),
        answer=1,
        success="Correct. Voting day is when eligible voters cast ballots.",
        failure="Not quite. Voting day is for casting ballots, not counting or forming government.",
    ),
    QuizQuestion(
        prompt="What follows counting in the election flow?",
        options=(
            "Another nomination round",
            "Silence Period",
            "Government Formation",
            "Announcement",
        ),
        answer=2,
        success="Correct. Government formation happens after the results are known.",
        failure="Not quite. Government formation comes after counting and results.",
    ),
)


MODE_LABELS = {
    "quick": "Quick Overview",
    "guided": "Guided Journey",
    "timeline": "Timeline View",
    "quiz": "Quiz Mode",
}


ACTIONS = ("Next", "Explain Simple", "Deep Dive", "Quiz")
