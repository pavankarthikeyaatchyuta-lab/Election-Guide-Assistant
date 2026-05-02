import { ACTIONS, MODE_LABELS, QUIZ_QUESTIONS, STAGES } from "../data/electionContent.js";

const STAGE_LOOKUP = new Map(
  STAGES.flatMap((stage, index) => [
    [stage.id, index],
    [stage.label.toLowerCase(), index]
  ])
);

function createQuizState() {
  return {
    active: false,
    index: 0,
    score: 0,
    answered: false,
    selected: null,
    feedback: "",
    completed: false
  };
}

export function createInitialState() {
  return {
    initialized: false,
    userType: "beginner",
    mode: "guided",
    currentStage: 0,
    detail: "default",
    interactionCount: 0,
    lastAction: "idle",
    systemHint: "",
    quiz: createQuizState()
  };
}

export function initializeSession(userType = "beginner", mode = "guided") {
  const state = createInitialState();
  state.initialized = true;
  state.userType = userType;
  state.mode = mode;
  state.lastAction = "start";

  if (mode === "quiz") {
    activateQuiz(state);
  }

  return state;
}

export function applyAction(state, action, payload = null) {
  const nextState = structuredClone(state);
  nextState.systemHint = "";

  if (!nextState.initialized && action !== "start") {
    nextState.systemHint = "Choose a user type and learning mode first.";
    return nextState;
  }

  switch (action) {
    case "next":
      return nextStep(nextState);
    case "skip":
      return nextStep(nextState);
    case "simple":
      nextState.detail = "simple";
      nextState.lastAction = "simple";
      nextState.interactionCount += 1;
      return nextState;
    case "deep":
      nextState.detail = "deep";
      nextState.lastAction = "deep";
      nextState.interactionCount += 1;
      return nextState;
    case "quiz":
      activateQuiz(nextState);
      nextState.lastAction = "quiz";
      nextState.interactionCount += 1;
      return nextState;
    case "answer":
      return answerQuiz(nextState, payload);
    case "goto":
      return jumpToStage(nextState, payload);
    default:
      nextState.systemHint = "Try Next, Explain Simple, Deep Dive, Quiz, or a stage command.";
      return nextState;
  }
}

export function applyCommand(state, rawInput) {
  const command = parseCommand(rawInput);

  if (!command) {
    const nextState = structuredClone(state);
    nextState.systemHint = "I did not catch that. Try `next`, `skip`, or `go to voting`.";
    return nextState;
  }

  return applyAction(state, command.type, command.payload);
}

export function buildView(state) {
  if (!state.initialized) {
    return {
      title: "Welcome",
      emoji: "🧭",
      explanation:
        "Pick your user type and learning mode. ElectoGuide will adapt the lesson style and pace.",
      example: "Example: Beginner + Guided Journey.",
      question: "Which mode should we start with?",
      actions: ACTIONS,
      progress: formatProgress(-1),
      modeLabel: "Not started",
      summary: "",
      hint: "You can begin with Quick Overview for a fast intro.",
      timeline: [],
      quiz: null
    };
  }

  if (state.quiz.active) {
    return buildQuizView(state);
  }

  return buildStageView(state);
}

function buildStageView(state) {
  const stage = STAGES[state.currentStage];
  const explanation = createExplanation(stage, state.userType, state.detail, state.mode);
  const summary = shouldShowMiniSummary(state)
    ? `Mini summary: We have reached ${stage.label}; next comes ${getNextStageLabel(state.currentStage)}.`
    : "";

  return {
    title: stage.label,
    emoji: stage.emoji,
    explanation,
    example: stage.example,
    question: stage.question,
    actions: ACTIONS,
    progress: formatProgress(state.currentStage),
    modeLabel: MODE_LABELS[state.mode],
    summary,
    hint:
      state.systemHint ||
      "Commands: `next`, `skip`, or `go to voting`.",
    timeline: state.mode === "timeline" ? buildTimeline() : [],
    quiz: null
  };
}

function buildQuizView(state) {
  if (state.quiz.completed) {
    return {
      title: "Quiz Complete",
      emoji: "🎯",
      explanation: `You scored ${state.quiz.score}/${QUIZ_QUESTIONS.length}. Review any stage or retake the quiz anytime.`,
      example: "Example: Counting comes before government formation.",
      question: "Would you like to go to a stage like voting or press Quiz to retry?",
      actions: ACTIONS,
      progress: formatProgress(state.currentStage),
      modeLabel: MODE_LABELS.quiz,
      summary: "",
      hint: state.systemHint || "Try `go to counting` or press Next to resume the stage flow.",
      timeline: [],
      quiz: {
        question: "",
        options: [],
        feedback: `Final score: ${state.quiz.score}/${QUIZ_QUESTIONS.length}`,
        answered: true,
        completed: true,
        index: QUIZ_QUESTIONS.length
      }
    };
  }

  const current = QUIZ_QUESTIONS[state.quiz.index];

  return {
    title: "Quiz Mode",
    emoji: "🎮",
    explanation: `Question ${state.quiz.index + 1}/${QUIZ_QUESTIONS.length}. ${current.prompt}`,
    example: "Example: The silence period happens before voting.",
    question: "Choose one option.",
    actions: ACTIONS,
    progress: formatProgress(state.currentStage),
    modeLabel: MODE_LABELS.quiz,
    summary: "",
    hint: state.systemHint || (state.quiz.answered ? "Press Next for the next question." : "Answer first, then continue."),
    timeline: [],
    quiz: {
      question: current.prompt,
      options: current.options,
      feedback: state.quiz.feedback,
      answered: state.quiz.answered,
      index: state.quiz.index
    }
  };
}

function createExplanation(stage, userType, detail, mode) {
  const primary =
    detail === "simple"
      ? stage.simple
      : detail === "deep"
        ? stage.deep
        : userType === "advanced"
          ? `${stage.summary} ${stage.deep}`
          : userType === "student"
            ? `${stage.summary} ${stage.simple}`
            : `${stage.simple} ${stage.summary}`;

  const modeNote =
    mode === "quick"
      ? "This is the short version."
      : mode === "guided"
        ? "We move stage by stage."
        : mode === "timeline"
          ? "Watch how the schedule moves over time."
          : "";

  return `${primary} ${modeNote}`.trim();
}

function nextStep(state) {
  if (state.quiz.active) {
    return advanceQuiz(state);
  }

  state.detail = "default";
  state.interactionCount += 1;

  if (state.currentStage < STAGES.length - 1) {
    state.currentStage += 1;
    state.lastAction = "next";
    return state;
  }

  state.lastAction = "next";
  state.systemHint = "You have reached the final stage. Try Quiz or jump to any stage.";
  return state;
}

function jumpToStage(state, target) {
  const normalized = String(target || "").toLowerCase().trim();
  const index = STAGE_LOOKUP.get(normalized);

  if (index === undefined) {
    state.systemHint = "That stage was not found. Try `go to voting` or `go to counting`.";
    return state;
  }

  state.currentStage = index;
  state.detail = "default";
  state.quiz = createQuizState();
  state.interactionCount += 1;
  state.lastAction = "goto";
  return state;
}

function activateQuiz(state) {
  state.quiz = createQuizState();
  state.quiz.active = true;
}

function answerQuiz(state, optionIndex) {
  if (!state.quiz.active || state.quiz.completed) {
    state.systemHint = "Start Quiz mode first.";
    return state;
  }

  if (state.quiz.answered) {
    state.systemHint = "Press Next to move to the next question.";
    return state;
  }

  const current = QUIZ_QUESTIONS[state.quiz.index];
  const correct = current.answer === optionIndex;

  state.quiz.answered = true;
  state.quiz.selected = optionIndex;
  state.quiz.feedback = correct ? current.success : current.failure;
  state.lastAction = "answer";
  state.interactionCount += 1;

  if (correct) {
    state.quiz.score += 1;
  }

  return state;
}

function advanceQuiz(state) {
  if (!state.quiz.answered && !state.quiz.completed) {
    state.systemHint = "Choose an answer before going next.";
    return state;
  }

  if (state.quiz.completed) {
    state.quiz = createQuizState();
    if (state.mode === "quiz") {
      state.mode = "guided";
    }
    state.lastAction = "resume";
    state.systemHint = "Quiz closed. You are back in the lesson flow.";
    return state;
  }

  if (state.quiz.index === QUIZ_QUESTIONS.length - 1) {
    state.quiz.completed = true;
    state.quiz.feedback = `Final score: ${state.quiz.score}/${QUIZ_QUESTIONS.length}`;
    state.lastAction = "quiz-complete";
    return state;
  }

  state.quiz.index += 1;
  state.quiz.answered = false;
  state.quiz.selected = null;
  state.quiz.feedback = "";
  state.lastAction = "quiz-next";
  return state;
}

function buildTimeline() {
  return STAGES.map((stage) => ({
    day: stage.day,
    event: stage.label,
    description: stage.summary
  }));
}

function shouldShowMiniSummary(state) {
  return (state.lastAction === "next" || state.lastAction === "goto") && state.currentStage > 0 && (state.currentStage + 1) % 2 === 0;
}

function getNextStageLabel(currentStage) {
  return STAGES[Math.min(currentStage + 1, STAGES.length - 1)].label;
}

function formatProgress(currentStage) {
  const segments = STAGES.map((_, index) => (index <= currentStage ? "✔" : "⬜")).join("");
  return `[${segments}]`;
}

export function parseCommand(rawInput) {
  const input = String(rawInput || "").trim().toLowerCase();

  if (!input) {
    return null;
  }

  if (input === "next") {
    return { type: "next" };
  }

  if (input === "skip") {
    return { type: "skip" };
  }

  if (input === "quiz") {
    return { type: "quiz" };
  }

  if (input === "explain simple" || input === "simple") {
    return { type: "simple" };
  }

  if (input === "deep dive" || input === "deep") {
    return { type: "deep" };
  }

  if (input.startsWith("go to ")) {
    return { type: "goto", payload: input.replace("go to ", "").trim() };
  }

  return null;
}
