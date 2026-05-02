# ElectoGuide: The Interactive Election Learning Assistant

ElectoGuide is an interactive election learning assistant designed to educate citizens, students, and political enthusiasts about the complex electoral process of a democracy. It features a responsive browser-based UI built with Vanilla JS, HTML, and CSS (featuring a space-themed aesthetic).

## 🌐 Live Demo
https://electoguide-655808244864.asia-south1.run.app

---

## 📢 Project Announcement
Check out the [official launch post on LinkedIn](https://www.linkedin.com/posts/pavan-karthikeya-atchyuta-3a5040354_promptwarsvirtual-buildwithai-promptwarsvirtual-ugcPost-7456380450064846848-IdGf?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFhIRi0Bgd3lw3t73PozqDSMLW6jDLjPfL8).

---

## 🎯 Chosen Vertical
**Civic Tech & Educational Technology (EdTech)**
The project focuses on electoral literacy. It breaks down the democratic electoral process into an understandable, chronological journey.

---

## ⚙️ GenAI vs Custom Logic

### Handled by GenAI (Google Gemini):
- Natural language understanding for unscripted queries
- Contextual, adaptive explanations based on the user's current election stage
- Dynamic answers to specific user questions (e.g., "What is the voting process?")

### Built manually:
- State machine and core transition logic (`stateManager.js`)
- UI/UX design and interaction handling
- Timeline visualization
- Voice/audio TTS integration
- Offline multilingual support (English/Hindi toggle)

---

## 🧠 Approach and Logic

The architecture of ElectoGuide is built around **State-Driven Adaptive Learning**. 

1. **Separation of Concerns**: The application strictly separates data (`electionContent.js`), state management (`stateManager.js` - centralized shared logic), and presentation (DOM manipulation in `app.js`).
2. **Adaptive Complexity**: The core logic relies on a state machine that tracks the user's *Persona* (Beginner, Student, Advanced) and *Learning Mode* (Guided, Quick, Timeline, Quiz). The system dynamically adjusts the verbosity, tone, and depth of the explanations based on these variables.
3. **Directed Progression**: The election process is modeled as a linear sequence of events (Announcement → Nomination → Campaigning, etc.). Users navigate this flow via a command parser that interprets actions (`next`, `simple`, `quiz`, `go to counting`) and updates the global state.

---

## 🤖 Google Services Integration

To fulfill the requirement for meaningful integration of Google Services, ElectoGuide natively integrates multiple Google Cloud APIs:

1. **Google Gemini API** (`gemini-2.5-flash`): Powers the contextual AI assistant to provide dynamic, stage-aware explanations.
2. **Google Cloud Firestore**: Provides a robust backend logging mechanism to safely track interaction events and user queries.
3. **Google Cloud Storage**: Initialized within the backend environment to prepare for scalable static asset and state storage.
4. **Google Cloud Run**: The entire application is containerized and deployed as a scalable, serverless container on GCP.

**Why Gemini 2.5 Flash?**
- **Latency Advantage**: Flash provides near-instantaneous responses, which is critical for a smooth, conversational educational flow.
- **Cost Efficiency**: It is highly cost-effective for generating short, contextual educational explanations at scale.

- **Context-Aware Q&A**: If a user types a custom question into the Web Dashboard's Command Bar, the application sends the user's question along with the *current election stage* to the Gemini API. 
- **Dynamic Learning**: The AI generates a concise, contextually accurate response that explains the complex electoral nuance, returning it directly to the UI's Learning Console.

---

## 🧠 Prompt Engineering Evolution

Throughout development, our prompt structure evolved to improve accuracy and context:
- **Initial Phase**: Initial prompts were generic Q&A (e.g., "Answer this user question: {question}"). This resulted in overly broad answers.
- **Context Injection**: Improved by adding the current election stage context (e.g., "The user is in the 'Polling Day' stage. Answer: {question}").
- **Final Prompt Structure**:
  - Persona instructions ("You are ElectoGuide, an expert AI election assistant.")
  - Current stage context injected dynamically
  - User query
  - Output constraints ("Provide a short, direct, and highly informative answer. max 3-4 sentences. Do not use markdown headers.")
- **Result**: This ensured context-aware, adaptive, and consistently formatted responses.

---

## ✨ Advanced Features

ElectoGuide includes several accessibility and multi-modal features designed to improve usability for a diverse audience:

- **Voice Input (Web Speech API):** Hands-free command execution. Users can click the microphone icon 🎤 to speak their questions or commands. The system transcribes and submits them using native browser technology.
- **Audio-Based Learning Mode:** A native Text-to-Speech integration using the `SpeechSynthesis` API. Users can click the "🔊 Listen" button to have the full context of the current card read aloud automatically. 
- **Multilingual Support (English + Hindi):** A rule-based offline translation system instantly translates the user interface, stage descriptions, and quiz content into Hindi dynamically.
- **Interactive Visual Timeline:** The "Timeline Mode" isn't just a list—it's a responsive, vertical UI stepper with glowing neon accents and pulsing waypoints that physically visualizes the user's journey through the election process.
- **Accessibility Enhancements:** Features include a specialized "Explain Like I'm 10" mode that simplifies vocabulary and sentence structure, alongside a design system with larger, readable fonts and ARIA-compliant button labels.

---

## 🎤 Hackathon Demo Narrative

To demonstrate maximum impact, use this exact narrative flow during a pitch:

1. **The Hook:** *"Imagine a first-time voter in a rural area who has no idea how an EVM works. They don't need a textbook, they need a guide."*
2. **The Voice Demo:** *"Instead of typing, they can just ask."* → Click the 🎤 button and speak *"What is the voting process?"*
3. **The Multimodal Shift:** Let the AI generate the explanation. Then say, *"But what if they don't read English well?"* → Instantly switch the language dropdown to **Hindi**. The entire UI instantly translates offline. 
4. **The Accessibility Win:** Hit the **🔊 Listen** button and let the browser read the Hindi explanation aloud.
5. **The Visual Finish:** Switch to the "Timeline View" mode and scroll through the glowing visual journey to show how the system visualizes complex data.

---

## ☁️ Deploying the Application (Google Cloud Run)

1. Open your terminal (PowerShell or Command Prompt) in the project directory.

2. (Optional but recommended) Set your active project:
```bash
gcloud config set project YOUR_PROJECT_ID
```

3. For Windows PowerShell users, run:
```powershell
$env:PYTHONUTF8=1
```

4. Deploy the application using the Dockerfile configuration:
```powershell
gcloud run deploy electoguide --source . --region asia-south1 --project electoguide-495113 --allow-unauthenticated --port 8080
```
> **Note**: For first-time deployment, you must also pass your API key by adding `--set-env-vars GEMINI_API_KEY=<your-api-key>` to the command above. Subsequent deployments will preserve this key.

5. Wait for the build and deployment to complete. Once finished, the CLI will output a Service URL.
6. Open the Service URL in your browser to access the live application.

---

## 💻 Additional Interfaces

### Python CLI Application
While the Web Dashboard is the primary experience, ElectoGuide also includes a fully functional Python Command-Line Interface.
1. Run the main CLI script:
   ```bash
   python main.py
   ```
2. Navigate by typing commands like `next`, `simple`, `deep`, `quiz`, or `go to voting`.
