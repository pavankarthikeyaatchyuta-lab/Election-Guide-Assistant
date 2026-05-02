import test from "node:test";
import assert from "node:assert/strict";

import {
  applyAction,
  applyCommand,
  buildView,
  initializeSession,
  parseCommand
} from "../src/core/assistantEngine.js";

test("parseCommand understands jump commands", () => {
  assert.deepEqual(parseCommand("go to voting"), {
    type: "goto",
    payload: "voting"
  });
});

test("guided flow advances stages", () => {
  let state = initializeSession("beginner", "guided");
  state = applyAction(state, "next");
  const view = buildView(state);

  assert.equal(view.title, "Nomination");
  assert.equal(view.progress, "[✔✔⬜⬜⬜⬜⬜]");
});

test("timeline mode renders timeline entries", () => {
  const state = initializeSession("student", "timeline");
  const view = buildView(state);

  assert.equal(view.timeline.length, 7);
  assert.equal(view.timeline[0].day, "Day 0");
});

test("quiz answers score immediately", () => {
  let state = initializeSession("student", "quiz");
  state = applyAction(state, "answer", 0);
  let view = buildView(state);

  assert.equal(view.quiz.feedback.includes("Correct"), true);

  state = applyAction(state, "next");
  view = buildView(state);
  assert.equal(view.explanation.includes("Question 2/5"), true);
});

test("unknown commands return a helpful hint", () => {
  const state = initializeSession("advanced", "quick");
  const nextState = applyCommand(state, "do magic");
  const view = buildView(nextState);

  assert.equal(view.hint.includes("next"), true);
});

test("language switch translates text", () => {
  let state = initializeSession("beginner", "guided", "en");
  let view = buildView(state);
  assert.equal(view.title, "Announcement");
  
  state = applyAction(state, "language", "hi");
  view = buildView(state);
  assert.equal(view.title, "घोषणा");
});

test("progress update displays correctly", () => {
  let state = initializeSession("beginner", "guided");
  
  assert.equal(buildView(state).progress, "[✔⬜⬜⬜⬜⬜⬜]");
  
  state = applyAction(state, "next");
  assert.equal(buildView(state).progress, "[✔✔⬜⬜⬜⬜⬜]");
  
  state = applyAction(state, "goto", "voting");
  assert.equal(buildView(state).progress, "[✔✔✔✔✔⬜⬜]");
});

test("command handling parses accessibility commands", () => {
  const state = initializeSession("beginner", "guided");
  const nextState = applyCommand(state, "explain like i'm 10");
  
  assert.equal(nextState.detail, "simple");
  assert.equal(nextState.lastAction, "simple");
});
