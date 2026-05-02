import { STAGES } from "./data/electionContent.js";
import {
  initializeSession,
  applyAction,
  parseCommand,
  buildView,
  speak
} from "./core/stateManager.js";

function savePreferences(preferences) {
  try {
    const raw = JSON.stringify(preferences);
    window.sessionStorage.setItem("electoguide-preferences", raw);
    window.localStorage.setItem("electoguide-preferences", raw);
  } catch (error) {
    // Ignore storage failures.
  }
}

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
const languageSelect = document.querySelector("#language-select");
const audioButton = document.querySelector("#audio-button");

const preferences = readPreferences();
let state = initializeSession(preferences.userType, preferences.learningMode, "en");

function render() {
  const view = buildView(state);

  if (profileUserType) profileUserType.value = state.userType;
  if (profileLearningMode) profileLearningMode.value = state.mode;
  if (languageSelect) languageSelect.value = state.language;

  if (sessionSummary && view.sessionPills) {
    sessionSummary.innerHTML = view.sessionPills.map(function (pill) {
      return '<span class="pill" data-tone="live">' + pill + "</span>";
    }).join("");
  }

  if (progressText) progressText.textContent = view.progress;
  if (modeText) modeText.textContent = view.modeLabel;
  if (progressFill) progressFill.style.width = view.progressRatio + "%";
  if (cardTitle) cardTitle.textContent = state.quiz.active ? "Quiz Console" : "Learning Console";
  if (detailPill) detailPill.textContent = view.detailLabel;

  if (stageRail) {
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
  }

  if (assistantCard) {
    assistantCard.innerHTML =
      '<div class="assistant-surface" data-tick="' + view.transitionTick + '">' +
      '<div class="assistant-head">' +
      '<p class="assistant-title">' + view.assistantTitle + "</p>" +
      '<span class="status-pill">' + view.modeLabel + "</span>" +
      "</div>" +
      '<div class="assistant-copy">' +
      '<p>' + view.explanation + "</p>" +
      (view.example ? '<p><strong>Example:</strong> ' + view.example + "</p>" : "") +
      (view.question ? '<p><strong>Question:</strong> ' + view.question + "</p>" : "") +
      (view.summary ? '<p><strong>Summary:</strong> ' + view.summary + "</p>" : "") +
      (view.hint ? '<p><strong>Hint:</strong> ' + view.hint + "</p>" : "") +
      "</div>" +
      '<div class="detail-grid">' +
      (view.detailSections.length === 0 
        ? '<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--muted); font-style: italic; border: 1px dashed rgba(126, 249, 255, 0.2); border-radius: 12px;">Start your journey or switch modes to see detailed breakdowns!</div>'
        : view.detailSections.map(function (section) {
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
          }).join("")) +
      "</div>" +
      "</div>";
  }

  renderQuiz(view.quiz);
  renderActions(view.actions);

  if (signalList) {
    signalList.innerHTML = view.signals.map(function (signal) {
      return '<span class="pill" data-tone="' + signal.tone + '">' + signal.label + "</span>";
    }).join("");
  }

  if (timelinePanel && timelineList) {
    timelinePanel.hidden = view.timeline.length === 0;
    timelineList.innerHTML = view.timeline.length === 0 
      ? '<div style="text-align: center; padding: 2rem; color: var(--muted); font-style: italic;">No timeline events available yet.</div>'
      : view.timeline.map(function (entry) {
          return (
            '<article class="timeline-item">' +
            '<p class="timeline-day eyebrow">' + entry.day + "</p>" +
            '<p class="timeline-event">' + entry.event + "</p>" +
            '<p class="timeline-description">' + entry.description + "</p>" +
            "</article>"
          );
        }).join("");
  }

  if (state.lastAction === "speak" && state.isSpeaking) {
    speak(view.explanation);
    state.isSpeaking = false; // reset flag
  }
}

function renderQuiz(quiz) {
  if (!quizOptions) return;
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
  if (!actionRow) return;
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

if (commandForm) {
  const submitCommand = async (input) => {
    const parsed = parseCommand(input);

    if (!parsed) {
      state.systemHint = '<span class="thinking-pulse">🧠 Asking AI</span><span class="thinking-dots"></span>';
      render();

      try {
        const stageLabel = STAGES[state.currentStage].label;
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: input, stageContext: stageLabel })
        });
        
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }

        const data = await response.json();
        if (data.answer) {
          state.systemHint = "💡 AI: " + data.answer;
        } else {
          state.systemHint = "API Error: " + (data.error || "Unknown error");
        }
      } catch (error) {
        state.systemHint = "Error connecting to AI backend. Make sure `python start.py` is running.";
      }
      commandForm.reset();
      render();
    } else {
      state = applyAction(state, parsed.type, parsed.payload);
      commandForm.reset();
      render();
    }
  };

  commandForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const input = new FormData(commandForm).get("command");
    submitCommand(input);
  });
  
  // Voice Input Logic
  const voiceBtn = document.getElementById("voice-input-btn");
  if (voiceBtn) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = state.language === "hi" ? "hi-IN" : "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = function() {
        voiceBtn.classList.add("recording");
        voiceBtn.title = "Listening...";
      };

      recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const inputField = document.getElementById("command-input");
        if (inputField) {
          inputField.value = transcript;
          submitCommand(transcript);
        }
      };

      recognition.onerror = function(event) {
        console.error("Speech recognition error", event.error);
        voiceBtn.classList.remove("recording");
        voiceBtn.title = "Voice Input Error";
        state.systemHint = "Microphone error: " + event.error;
        render();
      };

      recognition.onend = function() {
        voiceBtn.classList.remove("recording");
        voiceBtn.title = "Voice Input";
      };

      voiceBtn.addEventListener("click", function() {
        // Update language just in case it changed since init
        recognition.lang = state.language === "hi" ? "hi-IN" : "en-US";
        recognition.start();
      });
    } else {
      voiceBtn.style.display = "none";
    }
  }

  // Demo Chips Logic
  const demoChips = document.querySelectorAll(".demo-chip");
  demoChips.forEach(chip => {
    chip.addEventListener("click", function() {
      const text = this.textContent;
      const inputField = document.getElementById("command-input");
      if (inputField) {
        inputField.value = text;
        submitCommand(text);
      }
    });
  });
}

if (profileForm) {
  profileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const nextPreferences = {
      userType: profileUserType.value,
      learningMode: profileLearningMode.value
    };

    savePreferences(nextPreferences);
    state = initializeSession(nextPreferences.userType, nextPreferences.learningMode, state.language);
    render();
  });
}

if (actionRow) {
  actionRow.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    state = applyAction(state, button.dataset.action);
    render();
  });
}

if (quizOptions) {
  quizOptions.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-option]");
    if (!button) return;
    state = applyAction(state, "answer", Number(button.dataset.option));
    render();
  });
}

if (stageRail) {
  stageRail.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-stage]");
    if (!button) return;
    state = applyAction(state, "goto", button.dataset.stage);
    render();
  });
}

if (languageSelect) {
  languageSelect.addEventListener("change", function(event) {
    state = applyAction(state, "language", event.target.value);
    render();
  });
}

if (audioButton) {
  audioButton.addEventListener("click", function(event) {
    const currentView = buildView(state);
    speak(currentView.fullAudioText);
  });
}

render();
