import http.server
import socketserver
import os

PORT = 8080
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Keep logs clean
        pass

if __name__ == '__main__':
    with ThreadedHTTPServer(('0.0.0.0', PORT), QuietHandler) as httpd:
        print(f"Server ready at http://127.0.0.1:{PORT}")
        httpd.serve_forever()
