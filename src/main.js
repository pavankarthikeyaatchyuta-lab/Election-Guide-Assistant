import { ACTIONS } from "./data/electionContent.js";
import {
  applyAction,
  applyCommand,
  buildView,
  createInitialState,
  initializeSession
} from "./core/assistantEngine.js";

const setupForm = document.querySelector("#setup-form");
const commandForm = document.querySelector("#command-form");
const assistantCard = document.querySelector("#assistant-card");
const actionRow = document.querySelector("#action-row");
const quizOptions = document.querySelector("#quiz-options");
const progressText = document.querySelector("#progress-text");
const modeText = document.querySelector("#mode-text");
const timelinePanel = document.querySelector("#timeline-panel");
const timelineList = document.querySelector("#timeline-list");

let state = createInitialState();

render();

setupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(setupForm);
  state = initializeSession(formData.get("userType"), formData.get("learningMode"));
  render();
});

commandForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = new FormData(commandForm).get("command");
  state = applyCommand(state, input);
  commandForm.reset();
  render();
});

actionRow.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  state = applyAction(state, button.dataset.action);
  render();
});

quizOptions.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-option]");

  if (!button) {
    return;
  }

  state = applyAction(state, "answer", Number(button.dataset.option));
  render();
});

function render() {
  const view = buildView(state);

  progressText.textContent = view.progress;
  modeText.textContent = view.modeLabel;

  assistantCard.innerHTML = `
    <p class="section-title">[${view.title} ${view.emoji}]</p>
    <p class="explanation">${view.explanation}</p>
    <p class="example">${view.example}</p>
    <p class="question"><strong>Question:</strong> ${view.question}</p>
    ${view.summary ? `<p class="summary">${view.summary}</p>` : ""}
    <p class="hint">${view.hint}</p>
  `;

  actionRow.innerHTML = ACTIONS.map(
    (action) =>
      `<button class="chip-button" type="button" data-action="${action.id}">${action.label}</button>`
  ).join("");

  renderQuiz(view.quiz);
  renderTimeline(view.timeline);
}

function renderQuiz(quiz) {
  if (!quiz || quiz.completed) {
    quizOptions.innerHTML = quiz?.feedback
      ? `<div class="feedback-card">${quiz.feedback}</div>`
      : "";
    return;
  }

  quizOptions.innerHTML = `
    ${quiz.options
      .map(
        (option, index) => `
          <button
            class="option-button"
            type="button"
            data-option="${index}"
            ${quiz.answered ? "disabled" : ""}
          >
            ${String.fromCharCode(65 + index)}. ${option}
          </button>
        `
      )
      .join("")}
    ${quiz.feedback ? `<div class="feedback-card">${quiz.feedback}</div>` : ""}
  `;
}

function renderTimeline(entries) {
  const shouldShow = Array.isArray(entries) && entries.length > 0;
  timelinePanel.hidden = !shouldShow;

  if (!shouldShow) {
    timelineList.innerHTML = "";
    return;
  }

  timelineList.innerHTML = entries
    .map(
      (entry) => `
        <article class="timeline-item">
          <p class="timeline-day">${entry.day}</p>
          <p class="timeline-event">${entry.event}</p>
          <p class="timeline-description">${entry.description}</p>
        </article>
      `
    )
    .join("");
}
