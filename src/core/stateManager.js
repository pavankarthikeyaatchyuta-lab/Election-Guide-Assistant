import { ACTIONS, MODE_LABELS, QUIZ_QUESTIONS, STAGES } from "../data/electionContent.js";
import { HINDI_DICT } from "./translations.js";

export const STAGE_LOOKUP = new Map(
  STAGES.flatMap((stage, index) => [
    [stage.id, index],
    [stage.label.toLowerCase(), index]
  ])
);

export function explainSimple(text) {
  if (!text) return "";
  return "🧒 Simple: " + text.split(".")[0];
}

export function translate(text, lang) {
  if (!text) return text;
  if (lang === "hi") {
    // Trim text to avoid matching issues with spaces, but return original spacing
    const trimmed = text.trim();
    if (HINDI_DICT[trimmed]) {
      return text.replace(trimmed, HINDI_DICT[trimmed]);
    }
    return text;
  }
  return text;
}

export function speak(text) {
  if (typeof window !== "undefined" && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang === 'en-IN');
    if (indianVoice) utterance.voice = indianVoice;
    window.speechSynthesis.speak(utterance);
  }
}

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
    transitionTick: 0,
    quiz: createQuizState(),
    language: "en",
    isSpeaking: false
  };
}

export function initializeSession(userType = "beginner", mode = "guided", language = "en") {
  const state = createInitialState();
  state.initialized = true;
  state.userType = userType;
  state.mode = mode;
  state.language = language;
  state.lastAction = "start";
  state.transitionTick = 1;

  if (mode === "quiz") {
    state.quiz.active = true;
  }

  return state;
}

export function applyAction(state, action, payload = null) {
  const nextState = structuredClone(state);
  nextState.systemHint = "";
  nextState.transitionTick += 1;

  if (!nextState.initialized && action !== "start") {
    nextState.systemHint = translate("Choose a user type and learning mode first.", nextState.language);
    return nextState;
  }

  switch (action) {
    case "next":
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
      nextState.quiz = createQuizState();
      nextState.quiz.active = true;
      nextState.lastAction = "quiz";
      nextState.interactionCount += 1;
      return nextState;
    case "answer":
      return answerQuiz(nextState, payload);
    case "goto":
      return jumpToStage(nextState, payload);
    case "language":
      nextState.language = payload;
      nextState.lastAction = "language";
      return nextState;
    case "speak":
      nextState.isSpeaking = !nextState.isSpeaking;
      nextState.lastAction = "speak";
      return nextState;
    default:
      nextState.systemHint = translate("Try Next, Explain Simple, Deep Dive, Quiz, or a stage command.", nextState.language);
      return nextState;
  }
}

export function applyCommand(state, rawInput) {
  const command = parseCommand(rawInput);

  if (!command) {
    const nextState = structuredClone(state);
    nextState.systemHint = translate("I did not catch that. Try `next`, `skip`, or `go to voting`.", nextState.language);
    nextState.transitionTick += 1;
    return nextState;
  }

  return applyAction(state, command.type, command.payload);
}

function capitalize(value) {
  return String(value || "").replace(/-/g, " ").replace(/\b\w/g, match => match.toUpperCase());
}

function buildSummary(state, stage) {
  if (state.quiz.completed) return "Your score is now available and you can continue the stage journey.";
  if (state.quiz.active && !state.quiz.completed) return "Immediate feedback appears after each answer.";
  if ((state.lastAction === "next" || state.lastAction === "goto") && state.currentStage > 0 && state.currentStage % 2 === 0) {
    return "Mini summary: We reached " + stage.label + "; next is " + STAGES[Math.min(state.currentStage + 1, STAGES.length - 1)].label + ".";
  }
  return "";
}

function buildQuizExplanation(state, question) {
  if (state.quiz.completed) return "You scored " + state.quiz.score + "/" + QUIZ_QUESTIONS.length + ". Review a stage or press Next to return.";
  return "Question " + (state.quiz.index + 1) + "/" + QUIZ_QUESTIONS.length + ". " + question.prompt;
}

function buildStageDetailSections(stage, state, lang) {
  const explainIsSimple = state.detail === "simple" || state.userType === "beginner";
  const whyText = state.detail === "deep" || state.userType === "advanced"
    ? translate(stage.whyItMatters, lang) + " " + translate(stage.advancedNote, lang)
    : translate(stage.whyItMatters, lang);

  return [
    { title: translate("What Happens", lang), items: stage.whatHappens.map(i => translate(i, lang)) },
    { title: translate("Why It Matters", lang), items: [whyText] },
    { title: translate("Key Checks", lang), items: stage.keyChecks.map(i => translate(i, lang)) },
    { title: translate(explainIsSimple ? "Explain Like I'm 10" : "Deep Note", lang), items: [translate(explainIsSimple ? stage.simpleTakeaway : stage.advancedNote, lang)] }
  ];
}

function buildQuizDetailSections(state, lang) {
  if (state.quiz.completed) {
    return [{
      title: translate("Quiz Result", lang),
      items: [translate("Final score: ", lang) + state.quiz.score + "/" + QUIZ_QUESTIONS.length, translate("Jump to any stage to revise the election flow.", lang)]
    }];
  }
  return [{
    title: translate("How To Use Quiz Mode", lang),
    items: [translate("Answer one question at a time.", lang), translate("Read the feedback immediately after each answer.", lang), translate("Press Next to load the following question.", lang)]
  }];
}

function defaultHint(state) {
  if (state.quiz.active && !state.quiz.completed) {
    return state.quiz.answered ? "Press Next for the next question." : "Select an answer to unlock the next step.";
  }
  return "Try Next, Explain Simple, Deep Dive, Quiz, or go to voting.";
}

function buildSignals(state, lang) {
  const signals = [
    { label: translate("Profile: ", lang) + translate(capitalize(state.userType), lang), tone: "live" },
    { label: translate("Mode: ", lang) + translate(MODE_LABELS[state.mode], lang), tone: "success" },
    { label: translate("Detail: ", lang) + translate(capitalize(state.detail), lang), tone: state.detail === "default" ? "alert" : "live" },
    { label: translate("Interactions: ", lang) + state.interactionCount, tone: "live" }
  ];

  if (state.quiz.active && !state.quiz.completed) {
    signals.push({ label: translate("Quiz: Q", lang) + (state.quiz.index + 1) + "/" + QUIZ_QUESTIONS.length, tone: "success" });
  }
  if (state.quiz.completed) {
    signals.push({ label: translate("Quiz Score: ", lang) + state.quiz.score + "/" + QUIZ_QUESTIONS.length, tone: "success" });
  }
  if (state.systemHint) {
    signals.push({ label: translate("Hint Ready", lang), tone: "danger" });
  }
  return signals;
}

function buildActions(state, lang) {
  return ACTIONS.map(action => {
    let active = false;
    let disabled = false;

    if (state.quiz.active) {
      if (action.id === "simple" || action.id === "deep") disabled = true;
      if (action.id === "next" && !state.quiz.answered && !state.quiz.completed) disabled = true;
      if (action.id === "quiz") active = true;
    }

    if (!state.quiz.active && action.id === "simple" && state.detail === "simple") active = true;
    if (!state.quiz.active && action.id === "deep" && state.detail === "deep") active = true;

    return {
      id: action.id,
      label: translate(action.label, lang),
      active: active,
      disabled: disabled,
      kind: action.id === "next" ? "primary" : "default"
    };
  });
}

function buildStageRail(state, lang) {
  return STAGES.map((stage, index) => {
    let status = "upcoming";
    if (index < state.currentStage) status = "complete";
    if (index === state.currentStage) status = "current";

    return {
      id: stage.id,
      label: translate(stage.label, lang),
      emoji: stage.emoji,
      day: translate(stage.day, lang),
      status: status
    };
  });
}

export function buildView(state) {
  const lang = state.language;
  
  if (!state.initialized) {
    return {
      title: translate("Welcome", lang),
      modeLabel: translate("Not started", lang),
      detailLabel: translate("Default", lang),
      progress: formatProgress(-1),
      progressRatio: 0,
      assistantTitle: translate("[Welcome 🧭]", lang),
      explanation: translate("Pick your user type and learning mode. ElectoGuide will adapt the lesson style and pace.", lang),
      example: translate("Example: Beginner + Guided Journey.", lang),
      question: translate("Which mode should we start with?", lang),
      summary: "",
      hint: translate("You can begin with Quick Overview for a fast intro.", lang),
      timeline: [],
      detailSections: [],
      signals: [],
      actions: ACTIONS.map(a => ({ ...a, label: translate(a.label, lang) })),
      stages: buildStageRail({currentStage: -1}, lang),
      quiz: null,
      sessionPills: [],
      transitionTick: state.transitionTick,
      fullAudioText: translate("Welcome", lang) + ". " + translate("Pick your user type and learning mode. ElectoGuide will adapt the lesson style and pace.", lang)
    };
  }

  const stage = STAGES[state.currentStage];
  const timeline = state.mode === "timeline" ? buildTimeline(lang) : [];
  const progressRatio = ((state.currentStage + 1) / STAGES.length) * 100;
  const quizQuestion = state.quiz.active && !state.quiz.completed ? QUIZ_QUESTIONS[state.quiz.index] : null;

  let explanation = state.quiz.active
    ? buildQuizExplanation(state, quizQuestion, lang)
    : createExplanation(stage, state, lang);

  if (!state.quiz.active && state.detail === "simple") {
    explanation = explainSimple(explanation);
  }

  const titleText = translate(state.quiz.active ? (state.quiz.completed ? "Quiz Complete" : "Quiz Mode") : stage.label, lang);
  const hintText = translate(state.systemHint || defaultHint(state), lang);
  
  const exampleText = state.quiz.active
    ? translate(state.quiz.completed ? "Example: Counting comes before government formation." : "Example: The silence period happens before voting.", lang)
    : translate(stage.example, lang);

  const questionText = state.quiz.active
    ? translate(state.quiz.completed ? "Would you like to return to the lesson flow?" : "Choose one option.", lang)
    : translate(stage.question, lang);

  const summaryText = buildSummary(state, stage, lang);

  const fullAudioText = `${titleText}. ${explanation}. ${exampleText ? "Example: " + exampleText + "." : ""} ${questionText}. ${hintText}`;

  return {
    title: titleText,
    modeLabel: translate(state.quiz.active ? "Quiz Mode" : MODE_LABELS[state.mode], lang),
    detailLabel: translate(capitalize(state.detail), lang),
    progress: formatProgress(state.currentStage),
    progressRatio: Math.max(0, Math.min(100, progressRatio)),
    assistantTitle: "[" + titleText + " " + (state.quiz.active ? (state.quiz.completed ? "🎯" : "🎮") : stage.emoji) + "]",
    explanation: explanation,
    example: exampleText,
    question: questionText,
    summary: summaryText,
    hint: hintText,
    timeline: timeline,
    detailSections: state.quiz.active ? buildQuizDetailSections(state, lang) : buildStageDetailSections(stage, state, lang),
    signals: buildSignals(state, lang),
    actions: buildActions(state, lang),
    stages: buildStageRail(state, lang),
    quiz: buildQuizView(state, quizQuestion, lang),
    sessionPills: [
      translate("User", lang) + ": " + translate(capitalize(state.userType), lang),
      translate("Mode", lang) + ": " + translate(MODE_LABELS[state.mode], lang)
    ],
    transitionTick: state.transitionTick,
    fullAudioText: fullAudioText
  };
}

function buildQuizView(state, question, lang) {
  if (!state.quiz.active) return null;
  if (state.quiz.completed) {
    return {
      completed: true,
      feedback: translate("Final score: ", lang) + state.quiz.score + "/" + QUIZ_QUESTIONS.length
    };
  }

  return {
    completed: false,
    options: question.options.map(opt => translate(opt, lang)),
    selected: state.quiz.selected,
    answered: state.quiz.answered,
    correctAnswer: question.answer,
    feedback: translate(state.quiz.feedback, lang)
  };
}

function createExplanation(stage, state, lang) {
  let primary = "";
  if (state.detail === "simple") {
    primary = translate(stage.simple, lang);
  } else if (state.detail === "deep") {
    primary = translate(stage.deep, lang);
  } else if (state.userType === "advanced") {
    primary = translate(stage.summary, lang) + " " + translate(stage.deep, lang) + " " + translate(stage.advancedNote || "", lang);
  } else if (state.userType === "student") {
    primary = translate(stage.summary, lang) + " " + translate(stage.deep, lang);
  } else {
    primary = translate(stage.simple, lang) + " " + translate(stage.summary, lang);
  }

  let suffix = "";
  if (state.mode === "quick") suffix = translate("This is the short version.", lang);
  else if (state.mode === "guided") suffix = translate("We move stage by stage.", lang);
  else if (state.mode === "timeline") suffix = translate("Watch the sequence over time.", lang);

  return (primary + " " + suffix).trim();
}

function nextStep(state) {
  if (state.quiz.active) return advanceQuiz(state);

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

  state.interactionCount += 1;
  state.lastAction = "goto";

  if (index === undefined) {
    state.systemHint = "That stage was not found. Try `go to voting` or `go to counting`.";
    return state;
  }

  state.currentStage = index;
  state.detail = "default";
  state.quiz = createQuizState();
  return state;
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
  state.lastAction = "quiz-next";

  if (!state.quiz.answered && !state.quiz.completed) {
    state.systemHint = "Choose an answer before going next.";
    return state;
  }

  if (state.quiz.completed) {
    state.quiz = createQuizState();
    if (state.mode === "quiz") {
      state.mode = "guided";
    }
    state.systemHint = "Quiz closed. You are back in the lesson flow.";
    return state;
  }

  if (state.quiz.index === QUIZ_QUESTIONS.length - 1) {
    state.quiz.completed = true;
    state.quiz.feedback = "Final score: " + state.quiz.score + "/" + QUIZ_QUESTIONS.length;
    return state;
  }

  state.quiz.index += 1;
  state.quiz.answered = false;
  state.quiz.selected = null;
  state.quiz.feedback = "";
  return state;
}

function buildTimeline(lang) {
  return STAGES.map((stage) => ({
    day: translate(stage.day, lang),
    event: translate(stage.label, lang),
    description: translate(stage.summary, lang)
  }));
}

function formatProgress(currentStage) {
  const segments = STAGES.map((_, index) => (index <= currentStage ? "✔" : "⬜")).join("");
  return `[${segments}]`;
}

export function parseCommand(rawInput) {
  const input = String(rawInput || "").trim().toLowerCase();
  if (!input) return null;
  if (input === "next") return { type: "next" };
  if (input === "skip") return { type: "skip" };
  if (input === "quiz") return { type: "quiz" };
  if (input === "explain simple" || input === "simple" || input === "explain like i'm 10") return { type: "simple" };
  if (input === "deep dive" || input === "deep") return { type: "deep" };
  if (input.startsWith("go to ")) return { type: "goto", payload: input.replace("go to ", "").trim() };
  return null;
}
