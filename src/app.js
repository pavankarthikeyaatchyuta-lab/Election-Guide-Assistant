(function () {
  const STAGES = [
    {
      id: "announcement",
      label: "Announcement",
      emoji: "📢",
      day: "Day 0",
      summary: "The election authority publishes the official schedule and rules.",
      simple: "This is the public start signal for the election.",
      deep: "It sets the legal calendar for nominations, campaigning, voting, and counting.",
      example: "Polling dates are announced for each region.",
      question: "What usually needs to happen right after the schedule is announced?",
      whatHappens: [
        "The election body publishes the official calendar for nomination, campaigning, voting, and counting.",
        "Political parties, candidates, officials, and voters all start preparing around the same dates.",
        "Administrative rules such as polling logistics, monitoring, and code enforcement usually begin from here."
      ],
      whyItMatters: "A public schedule creates predictability and fairness because everyone works under one official timetable.",
      keyChecks: [
        "Official dates are publicly available",
        "Rules are clearly notified",
        "Election staff begin operational planning"
      ],
      simpleTakeaway: "It is like announcing the full exam schedule before tests begin.",
      advancedNote: "This stage establishes administrative certainty, because later decisions and disputes are judged against the published calendar."
    },
    {
      id: "nomination",
      label: "Nomination",
      emoji: "📝",
      day: "Day 2",
      summary: "Candidates submit forms and documents to officially enter the race.",
      simple: "People who want to contest must sign up correctly.",
      deep: "Election officials review eligibility, paperwork, and deadlines before finalizing valid candidates.",
      example: "A candidate files nomination papers before the last date.",
      question: "Why is checking forms important during nomination?",
      whatHappens: [
        "Candidates submit nomination forms, declarations, and any required supporting documents.",
        "Officials check whether the candidate meets legal and procedural requirements.",
        "A final candidate list is prepared after scrutiny and any withdrawal period."
      ],
      whyItMatters: "Nomination determines who can legally appear on the ballot, so accuracy here directly affects the contest.",
      keyChecks: [
        "Submission before deadline",
        "Eligibility verification",
        "Complete and valid paperwork"
      ],
      simpleTakeaway: "This is the official sign-up step for people who want to compete.",
      advancedNote: "Nomination scrutiny is a high-impact filter because acceptance or rejection directly shapes the candidate field."
    },
    {
      id: "campaigning",
      label: "Campaigning",
      emoji: "📣",
      day: "Day 6",
      summary: "Candidates explain their plans and ask voters for support.",
      simple: "This is when candidates talk to people and share ideas.",
      deep: "Campaigning can include speeches, manifestos, outreach, and debates within election rules.",
      example: "A candidate holds a public meeting to explain policy promises.",
      question: "How does campaigning help voters make a choice?",
      whatHappens: [
        "Candidates and parties explain ideas, promises, and records through public outreach and media.",
        "Voters compare alternatives and begin deciding which candidate or party better matches their expectations.",
        "Campaign rules usually restrict unfair practices such as bribery, intimidation, or hidden spending."
      ],
      whyItMatters: "Campaigning informs voters, but it must also be regulated so influence is lawful and reasonably fair.",
      keyChecks: [
        "Spending oversight",
        "Monitoring for rule violations",
        "Equal opportunity for lawful outreach"
      ],
      simpleTakeaway: "This is when candidates explain why people should vote for them.",
      advancedNote: "A healthy campaign phase balances political expression with enforceable limits that protect fairness and public order."
    },
    {
      id: "silence-period",
      label: "Silence Period",
      emoji: "🤫",
      day: "Day 18",
      summary: "Campaigning stops shortly before voting so voters can think calmly.",
      simple: "This is a quiet time before the vote.",
      deep: "The silence period reduces last-minute influence and protects a fair decision environment.",
      example: "No rallies or campaign messages are allowed in the final hours.",
      question: "Why might a quiet period help voters?",
      whatHappens: [
        "Campaign events and many forms of promotional messaging must stop before polling starts.",
        "Election workers focus on final polling arrangements rather than political activity.",
        "Voters get time to think without strong last-minute pressure."
      ],
      whyItMatters: "The silence period reduces the impact of emotional, manipulative, or hurried last-minute campaigning.",
      keyChecks: [
        "No fresh campaign events",
        "Monitoring of media or digital outreach",
        "Polling areas stay free from campaign activity"
      ],
      simpleTakeaway: "It is a quiet pause before the real decision day.",
      advancedNote: "This stage protects the decision environment, especially where misinformation or pressure could spike just before polling."
    },
    {
      id: "voting",
      label: "Voting",
      emoji: "🗳️",
      day: "Day 20",
      summary: "Eligible voters cast their ballots at polling stations or approved channels.",
      simple: "This is the day people choose by voting.",
      deep: "Voting usually follows identity checks, ballot secrecy, and supervised procedures.",
      example: "A voter verifies identity and casts a secret ballot.",
      question: "What makes voting both secure and fair?",
      whatHappens: [
        "Voters are identified, checked against the electoral roll, and allowed to cast their ballot in secret.",
        "Polling staff handle queues, voter assistance, ballot procedures, and incident reporting.",
        "Observers or party agents may watch the process without interfering with secrecy."
      ],
      whyItMatters: "Voting is the core democratic act, so access, secrecy, accuracy, and public trust all matter here.",
      keyChecks: [
        "Voter identity verification",
        "Secret ballot protection",
        "Secure handling of ballots or machines"
      ],
      simpleTakeaway: "This is the moment when each voter makes the actual choice.",
      advancedNote: "Polling design must balance speed, accessibility, fraud prevention, and verifiable procedure under real-world conditions."
    },
    {
      id: "counting",
      label: "Counting",
      emoji: "📦",
      day: "Day 21",
      summary: "Officials count votes and verify totals under supervision.",
      simple: "Votes are opened and counted carefully.",
      deep: "Counting includes reconciliation, observation, and result verification before declaration.",
      example: "Ballots are tallied in front of authorized observers.",
      question: "Why does counting need supervision?",
      whatHappens: [
        "Votes are counted according to formal procedure after polling ends.",
        "Officials reconcile totals with polling records and resolve doubtful or disputed cases.",
        "Observers monitor the process so the declared result can be trusted."
      ],
      whyItMatters: "Even a strong voting process can lose trust if the count is opaque, rushed, or poorly documented.",
      keyChecks: [
        "Reconciliation of totals",
        "Transparent counting steps",
        "Clear recording of disputes and results"
      ],
      simpleTakeaway: "This is where every valid vote gets added carefully.",
      advancedNote: "Counting is not just arithmetic; it is a verification and chain-of-custody process that must produce a defensible result."
    },
    {
      id: "government-formation",
      label: "Government Formation",
      emoji: "🏛️",
      day: "Day 24",
      summary: "The winning majority or coalition forms the government after results.",
      simple: "The group with enough support starts governing.",
      deep: "If no single group has enough seats, coalition negotiations may decide who governs.",
      example: "Parties with a majority of seats form the new government.",
      question: "What happens if no party wins enough seats alone?",
      whatHappens: [
        "Election results are translated into seats, and the side with enough support moves toward forming government.",
        "If no party has a majority, alliances or coalitions may be negotiated.",
        "Leadership, cabinet roles, and governing support are finalized in this phase."
      ],
      whyItMatters: "Winning votes is not the final step; the result must still become a stable and workable government.",
      keyChecks: [
        "Majority support in the legislature",
        "Coalition agreements if needed",
        "Orderly transfer or continuation of executive authority"
      ],
      simpleTakeaway: "After the election, the winners still have to organize a government that can actually run.",
      advancedNote: "Government formation tests whether an electoral result can be converted into governability, especially in coalition-heavy systems."
    }
  ];

  const MODE_LABELS = {
    quick: "Quick Overview",
    guided: "Guided Journey",
    timeline: "Timeline View",
    quiz: "Quiz Mode"
  };

  const ACTIONS = [
    { id: "next", label: "Next" },
    { id: "simple", label: "Explain Simple" },
    { id: "deep", label: "Deep Dive" },
    { id: "quiz", label: "Quiz" }
  ];

  const QUIZ_QUESTIONS = [
    {
      prompt: "Who usually announces the election schedule?",
      options: ["The election authority", "Any candidate", "Only the media", "Only voters"],
      answer: 0,
      success: "Correct. The election authority releases the official schedule.",
      failure: "Not quite. The official schedule is announced by the election authority."
    },
    {
      prompt: "What happens during nomination?",
      options: ["Votes are counted", "Candidates file forms", "Government is formed", "Campaigning is banned"],
      answer: 1,
      success: "Correct. Nomination is when candidates submit their papers.",
      failure: "Not quite. Nomination is the stage for filing candidate papers."
    },
    {
      prompt: "Which stage comes right before voting?",
      options: ["Campaigning", "Announcement", "Silence Period", "Counting"],
      answer: 2,
      success: "Correct. The silence period happens just before voting.",
      failure: "Not quite. The silence period is the step right before voting."
    },
    {
      prompt: "What is the main event on voting day?",
      options: ["Candidates submit forms", "Voters cast secret ballots", "Results are declared", "Parties form a coalition"],
      answer: 1,
      success: "Correct. Voting day is when eligible voters cast ballots.",
      failure: "Not quite. Voting day is for casting ballots, not counting or forming government."
    },
    {
      prompt: "What follows counting in the election flow?",
      options: ["Another nomination round", "Silence Period", "Government Formation", "Announcement"],
      answer: 2,
      success: "Correct. Government formation happens after the results are known.",
      failure: "Not quite. Government formation comes after counting and results."
    }
  ];

  const STAGE_LOOKUP = new Map(
    STAGES.flatMap(function (stage, index) {
      return [[stage.id, index], [stage.label.toLowerCase(), index]];
    })
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

  function createInitialState() {
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
      quiz: createQuizState()
    };
  }

  function initializeSession(userType, mode) {
    const state = createInitialState();
    state.initialized = true;
    state.userType = userType || "beginner";
    state.mode = mode || "guided";
    state.lastAction = "start";
    state.transitionTick = 1;

    if (state.mode === "quiz") {
      state.quiz.active = true;
    }

    return state;
  }

  function savePreferences(preferences) {
    try {
      const raw = JSON.stringify(preferences);
      window.sessionStorage.setItem("electoguide-preferences", raw);
      window.localStorage.setItem("electoguide-preferences", raw);
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function cloneState(state) {
    return JSON.parse(JSON.stringify(state));
  }

  function parseCommand(rawInput) {
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
    if (input === "simple" || input === "explain simple") {
      return { type: "simple" };
    }
    if (input === "deep" || input === "deep dive") {
      return { type: "deep" };
    }
    if (input.indexOf("go to ") === 0) {
      return { type: "goto", payload: input.replace("go to ", "").trim() };
    }
    return null;
  }

  function applyCommand(state, rawInput) {
    const parsed = parseCommand(rawInput);
    const nextState = cloneState(state);

    if (!parsed) {
      nextState.systemHint = "Try `next`, `simple`, `quiz`, or `go to voting`.";
      nextState.transitionTick += 1;
      return nextState;
    }

    return applyAction(nextState, parsed.type, parsed.payload);
  }

  function applyAction(state, action, payload) {
    const nextState = cloneState(state);
    nextState.systemHint = "";
    nextState.transitionTick += 1;

    switch (action) {
      case "next":
      case "skip":
        return nextStep(nextState);
      case "simple":
        nextState.detail = "simple";
        nextState.interactionCount += 1;
        nextState.lastAction = "simple";
        return nextState;
      case "deep":
        nextState.detail = "deep";
        nextState.interactionCount += 1;
        nextState.lastAction = "deep";
        return nextState;
      case "quiz":
        nextState.quiz = createQuizState();
        nextState.quiz.active = true;
        nextState.interactionCount += 1;
        nextState.lastAction = "quiz";
        return nextState;
      case "goto":
        return jumpToStage(nextState, payload);
      case "answer":
        return answerQuiz(nextState, Number(payload));
      default:
        nextState.systemHint = "That action is not supported.";
        return nextState;
    }
  }

  function nextStep(state) {
    if (state.quiz.active) {
      return nextQuizStep(state);
    }

    state.detail = "default";
    state.interactionCount += 1;
    state.lastAction = "next";

    if (state.currentStage < STAGES.length - 1) {
      state.currentStage += 1;
      return state;
    }

    state.systemHint = "You are at the final stage. Try Quiz or jump to another stage.";
    return state;
  }

  function jumpToStage(state, payload) {
    const target = String(payload || "").toLowerCase().trim();
    const index = STAGE_LOOKUP.get(target);

    state.interactionCount += 1;
    state.lastAction = "goto";

    if (index === undefined) {
      state.systemHint = "Stage not found. Try `go to voting` or `go to counting`.";
      return state;
    }

    state.currentStage = index;
    state.quiz = createQuizState();
    state.detail = "default";
    return state;
  }

  function answerQuiz(state, optionIndex) {
    if (!state.quiz.active || state.quiz.completed) {
      state.systemHint = "Start Quiz mode first.";
      return state;
    }
    if (state.quiz.answered) {
      state.systemHint = "Press Next for the next question.";
      return state;
    }

    const question = QUIZ_QUESTIONS[state.quiz.index];
    const correct = question.answer === optionIndex;

    state.quiz.answered = true;
    state.quiz.selected = optionIndex;
    state.quiz.feedback = correct ? question.success : question.failure;
    state.interactionCount += 1;
    state.lastAction = "answer";

    if (correct) {
      state.quiz.score += 1;
    }

    return state;
  }

  function nextQuizStep(state) {
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

  function createExplanation(stage, state) {
    let primary = "";

    if (state.detail === "simple") {
      primary = stage.simple;
    } else if (state.detail === "deep") {
      primary = stage.deep;
    } else if (state.userType === "advanced") {
      primary = stage.summary + " " + stage.deep + " " + stage.advancedNote;
    } else if (state.userType === "student") {
      primary = stage.summary + " " + stage.deep;
    } else {
      primary = stage.simple + " " + stage.summary;
    }

    let suffix = "";
    if (state.mode === "quick") {
      suffix = "This is the short version.";
    } else if (state.mode === "guided") {
      suffix = "We move stage by stage.";
    } else if (state.mode === "timeline") {
      suffix = "Watch the sequence over time.";
    }

    return (primary + " " + suffix).trim();
  }

  function formatProgress(stageIndex) {
    return "[" + STAGES.map(function (_, index) {
      return index <= stageIndex ? "✔" : "⬜";
    }).join("") + "]";
  }

  function buildTimeline() {
    return STAGES.map(function (stage) {
      return {
        day: stage.day,
        event: stage.label,
        description: stage.summary
      };
    });
  }

  function buildSignals(state) {
    const signals = [
      { label: "Profile: " + capitalize(state.userType), tone: "live" },
      { label: "Mode: " + MODE_LABELS[state.mode], tone: "success" },
      { label: "Detail: " + capitalize(state.detail), tone: state.detail === "default" ? "alert" : "live" },
      { label: "Interactions: " + state.interactionCount, tone: "live" }
    ];

    if (state.quiz.active && !state.quiz.completed) {
      signals.push({ label: "Quiz: Q" + (state.quiz.index + 1) + "/" + QUIZ_QUESTIONS.length, tone: "success" });
    }
    if (state.quiz.completed) {
      signals.push({ label: "Quiz Score: " + state.quiz.score + "/" + QUIZ_QUESTIONS.length, tone: "success" });
    }
    if (state.systemHint) {
      signals.push({ label: "Hint Ready", tone: "danger" });
    }

    return signals;
  }

  function buildActions(state) {
    return ACTIONS.map(function (action) {
      let active = false;
      let disabled = false;

      if (state.quiz.active) {
        if (action.id === "simple" || action.id === "deep") {
          disabled = true;
        }
        if (action.id === "next" && !state.quiz.answered && !state.quiz.completed) {
          disabled = true;
        }
        if (action.id === "quiz") {
          active = true;
        }
      }

      if (!state.quiz.active && action.id === "simple" && state.detail === "simple") {
        active = true;
      }
      if (!state.quiz.active && action.id === "deep" && state.detail === "deep") {
        active = true;
      }

      return {
        id: action.id,
        label: action.label,
        active: active,
        disabled: disabled,
        kind: action.id === "next" ? "primary" : "default"
      };
    });
  }

  function buildStageRail(state) {
    return STAGES.map(function (stage, index) {
      let status = "upcoming";
      if (index < state.currentStage) {
        status = "complete";
      }
      if (index === state.currentStage) {
        status = "current";
      }

      return {
        id: stage.id,
        label: stage.label,
        emoji: stage.emoji,
        day: stage.day,
        status: status
      };
    });
  }

  function buildView(state) {
    const stage = STAGES[state.currentStage];
    const timeline = state.mode === "timeline" ? buildTimeline() : [];
    const progressRatio = ((state.currentStage + 1) / STAGES.length) * 100;
    const quizQuestion = state.quiz.active && !state.quiz.completed ? QUIZ_QUESTIONS[state.quiz.index] : null;

    return {
      title: state.quiz.active ? (state.quiz.completed ? "Quiz Complete" : "Quiz Mode") : stage.label,
      modeLabel: state.quiz.active ? "Quiz Mode" : MODE_LABELS[state.mode],
      detailLabel: capitalize(state.detail),
      progress: formatProgress(state.currentStage),
      progressRatio: Math.max(0, Math.min(100, progressRatio)),
      assistantTitle: "[" + (state.quiz.active ? (state.quiz.completed ? "Quiz Complete 🎯" : "Quiz Mode 🎮") : (stage.label + " " + stage.emoji)) + "]",
      explanation: state.quiz.active
        ? buildQuizExplanation(state, quizQuestion)
        : createExplanation(stage, state),
      example: state.quiz.active
        ? (state.quiz.completed ? "Example: Counting comes before government formation." : "Example: The silence period happens before voting.")
        : stage.example,
      question: state.quiz.active
        ? (state.quiz.completed ? "Would you like to return to the lesson flow?" : "Choose one option.")
        : stage.question,
      summary: buildSummary(state, stage),
      hint: state.systemHint || defaultHint(state),
      timeline: timeline,
      detailSections: state.quiz.active ? buildQuizDetailSections(state) : buildStageDetailSections(stage, state),
      signals: buildSignals(state),
      actions: buildActions(state),
      stages: buildStageRail(state),
      quiz: buildQuizView(state, quizQuestion),
      sessionPills: [
        "User: " + capitalize(state.userType),
        "Mode: " + MODE_LABELS[state.mode]
      ],
      transitionTick: state.transitionTick
    };
  }

  function buildSummary(state, stage) {
    if (state.quiz.completed) {
      return "Your score is now available and you can continue the stage journey.";
    }
    if (state.quiz.active && !state.quiz.completed) {
      return "Immediate feedback appears after each answer.";
    }
    if ((state.lastAction === "next" || state.lastAction === "goto") && state.currentStage > 0 && state.currentStage % 2 === 0) {
      return "Mini summary: We reached " + stage.label + "; next is " + STAGES[Math.min(state.currentStage + 1, STAGES.length - 1)].label + ".";
    }
    return "";
  }

  function buildQuizExplanation(state, question) {
    if (state.quiz.completed) {
      return "You scored " + state.quiz.score + "/" + QUIZ_QUESTIONS.length + ". Review a stage or press Next to return.";
    }
    return "Question " + (state.quiz.index + 1) + "/" + QUIZ_QUESTIONS.length + ". " + question.prompt;
  }

  function buildStageDetailSections(stage, state) {
    const explainSimple = state.detail === "simple" || state.userType === "beginner";
    const whyText = state.detail === "deep" || state.userType === "advanced"
      ? stage.whyItMatters + " " + stage.advancedNote
      : stage.whyItMatters;

    return [
      {
        title: "What Happens",
        items: stage.whatHappens
      },
      {
        title: "Why It Matters",
        items: [whyText]
      },
      {
        title: "Key Checks",
        items: stage.keyChecks
      },
      {
        title: explainSimple ? "Explain Like I'm 10" : "Deep Note",
        items: [explainSimple ? stage.simpleTakeaway : stage.advancedNote]
      }
    ];
  }

  function buildQuizDetailSections(state) {
    if (state.quiz.completed) {
      return [
        {
          title: "Quiz Result",
          items: [
            "Final score: " + state.quiz.score + "/" + QUIZ_QUESTIONS.length,
            "Jump to any stage to revise the election flow."
          ]
        }
      ];
    }

    return [
      {
        title: "How To Use Quiz Mode",
        items: [
          "Answer one question at a time.",
          "Read the feedback immediately after each answer.",
          "Press Next to load the following question."
        ]
      }
    ];
  }

  function buildQuizView(state, question) {
    if (!state.quiz.active) {
      return null;
    }
    if (state.quiz.completed) {
      return {
        completed: true,
        feedback: "Final score: " + state.quiz.score + "/" + QUIZ_QUESTIONS.length
      };
    }

    return {
      completed: false,
      options: question.options,
      selected: state.quiz.selected,
      answered: state.quiz.answered,
      correctAnswer: question.answer,
      feedback: state.quiz.feedback
    };
  }

  function defaultHint(state) {
    if (state.quiz.active && !state.quiz.completed) {
      return state.quiz.answered ? "Press Next for the next question." : "Select an answer to unlock the next step.";
    }
    return "Try Next, Explain Simple, Deep Dive, Quiz, or go to voting.";
  }

  function capitalize(value) {
    return String(value || "").replace(/-/g, " ").replace(/\b\w/g, function (match) {
      return match.toUpperCase();
    });
  }

  const sessionSummary = document.querySelector("#session-summary");
  const progressText = document.querySelector("#progress-text");
  const modeText = document.querySelector("#mode-text");
  const progressFill = document.querySelector("#progress-fill");
  const stageRail = document.querySelector("#stage-rail");
  const assistantCard = document.querySelector("#assistant-card");
  const cardTitle = document.querySelector("#card-title");
  const detailPill = document.querySelector("#detail-pill");
  const quizOptions = document.querySelector("#quiz-options");
  const actionRow = document.querySelector("#action-row");
  const commandForm = document.querySelector("#command-form");
  const profileForm = document.querySelector("#profile-form");
  const profileUserType = document.querySelector("#profile-user-type");
  const profileLearningMode = document.querySelector("#profile-learning-mode");
  const signalList = document.querySelector("#signal-list");
  const timelinePanel = document.querySelector("#timeline-panel");
  const timelineList = document.querySelector("#timeline-list");

  const preferences = readPreferences();
  let state = initializeSession(preferences.userType, preferences.learningMode);

  function readPreferences() {
    const params = new URLSearchParams(window.location.search);
    const userTypeParam = params.get("userType");
    const modeParam = params.get("learningMode");

    if (userTypeParam || modeParam) {
      const queryPreferences = {
        userType: userTypeParam || "beginner",
        learningMode: modeParam || "guided"
      };
      savePreferences(queryPreferences);
      return queryPreferences;
    }

    try {
      const raw = window.sessionStorage.getItem("electoguide-preferences");
      if (raw) {
        return JSON.parse(raw);
      }
      const localRaw = window.localStorage.getItem("electoguide-preferences");
      if (localRaw) {
        return JSON.parse(localRaw);
      }
    } catch (error) {
      return { userType: "beginner", learningMode: "guided" };
    }

    return { userType: "beginner", learningMode: "guided" };
  }

  function render() {
    const view = buildView(state);

    if (profileUserType) {
      profileUserType.value = state.userType;
    }
    if (profileLearningMode) {
      profileLearningMode.value = state.mode;
    }

    sessionSummary.innerHTML = view.sessionPills.map(function (pill) {
      return '<span class="pill" data-tone="live">' + pill + "</span>";
    }).join("");

    progressText.textContent = view.progress;
    modeText.textContent = view.modeLabel;
    progressFill.style.width = view.progressRatio + "%";
    cardTitle.textContent = state.quiz.active ? "Quiz Console" : "Learning Console";
    detailPill.textContent = view.detailLabel;

    stageRail.innerHTML = view.stages.map(function (stage) {
      return (
        '<button class="stage-button" type="button" data-stage="' +
        stage.id +
        '" data-status="' + stage.status + '">' +
        '<span class="stage-emoji">' + stage.emoji + "</span>" +
        '<span class="stage-name">' + stage.label + "</span>" +
        '<span class="stage-day">' + stage.day + "</span>" +
        "</button>"
      );
    }).join("");

    assistantCard.innerHTML =
      '<div class="assistant-surface" data-tick="' + view.transitionTick + '">' +
      '<div class="assistant-head">' +
      '<p class="assistant-title">' + view.assistantTitle + "</p>" +
      '<span class="status-pill">' + view.modeLabel + "</span>" +
      "</div>" +
      '<div class="assistant-copy">' +
      '<p>' + view.explanation + "</p>" +
      '<p><strong>Example:</strong> ' + view.example + "</p>" +
      '<p><strong>Question:</strong> ' + view.question + "</p>" +
      (view.summary ? '<p><strong>Summary:</strong> ' + view.summary + "</p>" : "") +
      '<p><strong>Hint:</strong> ' + view.hint + "</p>" +
      "</div>" +
      '<div class="detail-grid">' +
      view.detailSections.map(function (section) {
        return (
          '<section class="detail-box">' +
          '<p class="detail-title">' + section.title + "</p>" +
          '<ul class="detail-list">' +
          section.items.map(function (item) {
            return "<li>" + item + "</li>";
          }).join("") +
          "</ul>" +
          "</section>"
        );
      }).join("") +
      "</div>" +
      "</div>";

    renderQuiz(view.quiz);
    renderActions(view.actions);

    signalList.innerHTML = view.signals.map(function (signal) {
      return '<span class="pill" data-tone="' + signal.tone + '">' + signal.label + "</span>";
    }).join("");

    timelinePanel.hidden = view.timeline.length === 0;
    timelineList.innerHTML = view.timeline.map(function (entry) {
      return (
        '<article class="timeline-item">' +
        '<p class="timeline-day">' + entry.day + "</p>" +
        '<p class="timeline-event">' + entry.event + "</p>" +
        '<p class="timeline-description">' + entry.description + "</p>" +
        "</article>"
      );
    }).join("");
  }

  function renderQuiz(quiz) {
    if (!quiz) {
      quizOptions.innerHTML = "";
      return;
    }

    if (quiz.completed) {
      quizOptions.innerHTML = '<div class="feedback-card">' + quiz.feedback + "</div>";
      return;
    }

    quizOptions.innerHTML = quiz.options.map(function (option, index) {
      let stateName = "idle";

      if (quiz.answered) {
        if (index === quiz.correctAnswer) {
          stateName = "correct";
        } else if (index === quiz.selected) {
          stateName = "wrong";
        }
      }

      return (
        '<button class="option-button" type="button" data-option="' +
        index +
        '" data-state="' + stateName + '"' +
        (quiz.answered ? " disabled" : "") +
        ">" +
        String.fromCharCode(65 + index) +
        ". " + option +
        "</button>"
      );
    }).join("") + (quiz.feedback ? '<div class="feedback-card">' + quiz.feedback + "</div>" : "");
  }

  function renderActions(actions) {
    actionRow.innerHTML = actions.map(function (action) {
      return (
        '<button class="action-button" type="button" data-action="' +
        action.id +
        '" data-active="' + String(action.active) +
        '" data-kind="' + action.kind + '"' +
        (action.disabled ? " disabled" : "") +
        ">" + action.label + "</button>"
      );
    }).join("");
  }

  commandForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const input = new FormData(commandForm).get("command");
    state = applyCommand(state, input);
    commandForm.reset();
    render();
  });

  if (profileForm) {
    profileForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nextPreferences = {
        userType: profileUserType.value,
        learningMode: profileLearningMode.value
      };

      savePreferences(nextPreferences);
      state = initializeSession(nextPreferences.userType, nextPreferences.learningMode);
      render();
    });
  }

  actionRow.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) {
      return;
    }
    state = applyAction(state, button.dataset.action);
    render();
  });

  quizOptions.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-option]");
    if (!button) {
      return;
    }
    state = applyAction(state, "answer", Number(button.dataset.option));
    render();
  });

  stageRail.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-stage]");
    if (!button) {
      return;
    }
    state = applyAction(state, "goto", button.dataset.stage);
    render();
  });

  render();
}());
