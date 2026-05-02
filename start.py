from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import webbrowser
import json
import os

# Lightweight .env loader to avoid external dependencies
def load_env():
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        try:
            content = env_path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            content = env_path.read_text(encoding="utf-16")
        
        for line in content.splitlines():
            line = line.replace("\x00", "").strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                os.environ[key.strip()] = value.strip()

load_env()

try:
    from google import genai
    client = genai.Client()
except Exception as e:
    client = None
    print(f"Warning: Gemini API client could not be initialized. {e}")

from google.cloud import storage
from google.cloud import firestore

try:
    storage_client = storage.Client()
    buckets = list(storage_client.list_buckets())
except Exception as e:
    print("Storage init failed:", e)

db = None
try:
    db = firestore.Client()
except Exception as e:
    print("Firestore init failed:", e)

def log_interaction(event_type, data):
    if not db:
        return
    try:
        db.collection("logs").add({
            "event": event_type,
            "data": data,
            "timestamp": firestore.SERVER_TIMESTAMP
        })
    except Exception as e:
        print("Logging failed:", e)


class APITryingRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        root = Path(__file__).resolve().parent
        super().__init__(*args, directory=str(root), **kwargs)

    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                stage_context = data.get('stageContext', '')
                user_question = data.get('question', '').strip()[:500]
                
                log_interaction("user_query", user_question)
                
                if not client:
                    raise Exception("Gemini client is not initialized (missing API key).")
                
                prompt = f"""
                You are ElectoGuide, an expert AI election assistant.
                The user is asking a question while they are in the following election stage:
                {stage_context}
                
                Question: {user_question}
                
                Provide a short, direct, and highly informative answer (max 3-4 sentences). Do not use markdown headers, just plain text.
                """
                
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                )
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'answer': response.text}).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()


def main() -> None:
    host = "0.0.0.0"
    port = int(os.environ.get("PORT", 8000))
    url = f"http://127.0.0.1:{port}/dashboard.html"
    print(f"ElectoGuide running at port {port}")
    # Only open browser if running locally (not in Cloud Run)
    if not os.environ.get("PORT"):
        webbrowser.open(url)
    ThreadingHTTPServer((host, port), APITryingRequestHandler).serve_forever()


if __name__ == "__main__":
    main()
