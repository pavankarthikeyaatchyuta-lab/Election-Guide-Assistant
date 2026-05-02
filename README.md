# ElectoGuide: The Interactive Election Learning Assistant

ElectoGuide is a premium, lightweight interactive election learning assistant. It features a complete standalone Python CLI application and a visually stunning, responsive browser-based UI built with Vanilla JS, HTML, and CSS (with a space-themed glassmorphism aesthetic).

---

## 🎯 Chosen Vertical
**Civic Tech & Educational Technology (EdTech)**
The project focuses on electoral literacy. It aims to educate citizens, students, and political enthusiasts about the complex electoral process of a democracy by breaking it down into understandable, chronological stages.

---

## 🧠 Approach and Logic

The architecture of ElectoGuide is built around **State-Driven Adaptive Learning**. 

1. **Separation of Concerns**: The application strictly separates data (`election_data.py` / `flow.js`), state management (`flow_manager.py` / `state.js`), and presentation (CLI formatting / DOM manipulation).
2. **Adaptive Complexity**: The core logic relies on a state machine that tracks the user's *Persona* (Beginner, Student, Advanced) and *Learning Mode* (Guided, Quick, Timeline, Quiz). The system dynamically adjusts the verbosity, tone, and depth of the explanations based on these variables.
3. **Directed Progression**: The election process is modeled as a linear sequence of events (Announcement → Nomination → Campaigning, etc.). Users navigate this flow via a command parser that interprets actions (`next`, `simple`, `quiz`, `go to counting`) and updates the global state.

---

## ⚙️ How the Solution Works

ElectoGuide offers two identical functional experiences: a **Python Command-Line Interface (CLI)** and a **Web Dashboard**.

1. **Initialization**: The user starts by selecting their background (e.g., Beginner) and preferred learning style. This initializes the session state.
2. **Content Generation**: The engine pulls the current stage's data. If the user is a beginner, it fetches the `simpleExplanation` and `simpleTakeaway`. If advanced, it appends the `deep` dive and `advancedNote`.
3. **Interaction**: The user interacts with the "Learning Console" by clicking action buttons (Web) or typing commands (CLI). 
4. **State Mutation**: Actions like pressing "Next" or answering a "Quiz" question trigger state updates (e.g., `currentStage += 1`, `quizScore += 1`). 
5. **Re-rendering**: The interface immediately re-renders to reflect the new state, updating progress bars, timelines, and the lesson content.

---

## 📌 Assumptions Made

- **Generalized Democratic Model**: The election timeline is modeled on a generalized parliamentary democratic system (e.g., similar to India or the UK), standardized into 7 distinct universal phases.
- **Browser Capabilities**: For the Web UI, it is assumed the user has a modern web browser capable of supporting CSS Grid, Flexbox, and ES6 JavaScript. 
- **No External Dependencies (Except API Client)**: It is assumed that a lightweight architecture is preferred. Therefore, no heavy frontend frameworks (like React or Vue) were used. The only external Python package is `google-genai` for the AI integration.
- **Local Persistence**: It is assumed that `sessionStorage` and `localStorage` are enabled in the user's browser to persist setup preferences between the landing page and the main dashboard.

---

## 🤖 Google Services Integration

To fulfill the requirement for meaningful integration of Google Services, ElectoGuide integrates the **Google Gemini API** (`gemini-2.5-flash`). 
- **Context-Aware Q&A**: If a user types a custom question into the Web Dashboard's Command Bar or the Python CLI, the application sends the user's question along with the *current election stage* to the Gemini API. 
- **Dynamic Learning**: The AI generates a concise, contextually accurate response that explains the complex electoral nuance, returning it directly to the UI's Learning Console.
- **Secure Backend**: The API key is securely loaded via a `.env` file on the Python backend (`start.py`), which exposes a lightweight `/api/chat` endpoint for the frontend to query safely.

---

## 🚀 Getting Started

### Option 1: Web Application (Recommended)
1. Run the local development server:
   ```bash
   python start.py
   ```
2. The server will start on `http://127.0.0.1:8000/`.
3. Start at the landing page to select your profile, then proceed to the main learning dashboard.

### Option 2: Python CLI Application
1. Open your terminal in the project directory.
2. Run the main CLI script:
   ```bash
   python main.py
   ```
3. Follow the on-screen prompts. You can navigate by typing commands like `next`, `simple`, `deep`, `quiz`, or `go to voting`.

## 🧪 Testing

The Python core includes a test suite to ensure logical integrity. To run the automated tests:
```bash
python -m unittest discover -s tests
```
