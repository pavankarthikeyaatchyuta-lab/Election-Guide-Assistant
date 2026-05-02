from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import webbrowser
import json
import os

# Lightweight .env loader to avoid external dependencies
def load_env():
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            line = line.strip()
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


class APITryingRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        root = Path(__file__).resolve().parent
        super().__init__(*args, directory=str(root), **kwargs)

    def do_POST(self):
        if self.path == '/api/chat':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                stage_context = data.get('stageContext', '')
                user_question = data.get('question', '')
                
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
    host = "127.0.0.1"
    port = 8000
    url = f"http://{host}:{port}/dashboard.html"
    print(f"ElectoGuide running at {url}")
    webbrowser.open(url)
    ThreadingHTTPServer((host, port), APITryingRequestHandler).serve_forever()


if __name__ == "__main__":
    main()
