from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import webbrowser


def main() -> None:
    root = Path(__file__).resolve().parent
    host = "127.0.0.1"
    port = 8000

    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(root), **kwargs)

    url = f"http://{host}:{port}/index.html"
    print(f"ElectoGuide running at {url}")
    webbrowser.open(url)
    ThreadingHTTPServer((host, port), Handler).serve_forever()


if __name__ == "__main__":
    main()
