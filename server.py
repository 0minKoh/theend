import http.server
import socketserver

PORT = 5500

class GitHubPagesLocalHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # 브라우저가 /theend 로 시작하는 경로를 요청하면, 로컬 서빙을 위해 해당 파트를 제거합니다.
        if path.startswith('/theend'):
            path = path[7:] # '/theend' 가 7글자이므로 앞부분을 잘라냄
        return super().translate_path(path)

with socketserver.TCPServer(("", PORT), MyHandler if 'MyHandler' in globals() else GitHubPagesLocalHandler) as httpd:
    print(f"🚀 Local GitHub Pages Server running at:")
    print(f"   👉 http://localhost:{PORT}/main/ko/")
    print(f"   👉 http://localhost:{PORT}/products/the-m/main/ko/")
    httpd.serve_forever()