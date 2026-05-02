# ElectoGuide: The Interactive Election Learning Assistant

ElectoGuide is a premium, lightweight interactive election learning assistant designed to educate users on the electoral process. It features a complete standalone Python CLI application and a visually stunning, responsive browser-based UI built with Vanilla JS, HTML, and CSS (with a space-themed glassmorphism aesthetic).

The application guides users step-by-step through the election timeline, from the initial announcement to government formation. It features adaptive language complexity (simple vs. deep dive explanations), timeline visualizations, interactive quizzes, and a command-line style interface integrated right into the web dashboard.

## 🚀 Getting Started

You can run ElectoGuide either as a Web Application or as a Command-Line Application.

### Option 1: Web Application (Recommended)
The web application provides a rich, responsive interface with a beautiful space theme.
1. Run the local development server:
   ```bash
   python start.py
   ```
2. The server will start on `http://127.0.0.1:8000/` and automatically open your default web browser.
3. Start at the landing page (`index.html`) to select your profile and mode, then proceed to the main learning dashboard (`dashboard.html`).

### Option 2: Python CLI Application
If you prefer a text-based terminal experience:
1. Open your terminal in the project directory.
2. Run the main CLI script:
   ```bash
   python main.py
   ```
3. Follow the on-screen prompts. You can navigate by typing commands like `next`, `simple`, `deep`, `quiz`, or `go to voting`.

## ✨ Key Features
- **Comprehensive Election Journey**: 7 detailed stages covering Announcement, Nomination, Campaigning, Silence Period, Voting, Counting, and Government Formation.
- **Adaptive UX**: Content automatically adjusts depth based on user profile (Beginner, Student, Advanced) and selected mode (Quick, Guided, Timeline, Quiz).
- **Interactive Command Parser**: Navigate using natural commands (e.g., `next`, `skip`, `explain simple`, `go to counting`).
- **Knowledge Check**: Built-in interactive quiz system to test your understanding.
- **Premium Design**: Dark space theme, glassmorphism UI cards, and responsive CSS grid layout.

## 📂 Project Structure

### Web UI
- `index.html`: Landing page for session setup and preferences.
- `dashboard.html`: The main learning workspace layout.
- `src/app.js`: Core controller and state management for the browser UI.
- `src/landing.js`: Handles profile selection and redirects.
- `src/styles.css`: Complete styling system, CSS grid layout, and space background animations.
- `start.py`: A lightweight Python HTTP server to serve the static web files.

### Python Core (CLI / Backend Logic)
- `main.py`: Interactive CLI entry point.
- `prompt_engine.py`: Formats text outputs and response cards for the terminal.
- `flow_manager.py`: Manages session state and command flow.
- `quiz.py`: Isolated logic for the quiz engine.
- `election_data.py`: The central data store containing detailed stage content and quiz questions.

## 🧪 Testing

The Python core includes a test suite to ensure logical integrity. To run the automated tests:
```bash
python -m unittest discover -s tests
```
