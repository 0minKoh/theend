import os
import re

# 🚀 [설정] GitHub Pages 배포용 서브디렉토리 경로를 명시합니다.
BASE_PATH = "/theend"

header_pattern = re.compile(r'<header.*?>.*?</header>', re.DOTALL)
footer_pattern = re.compile(r'<footer.*?>.*?</footer>', re.DOTALL)
css_pattern = re.compile(r'href="[^"]*?assets/css/style\.css"')
js_pattern = re.compile(r'src="[^"]*?assets/js/main\.js"')

clean_header = '<header id="global-header" class="border-b border-transparent backdrop-blur-md bg-[#090A0F]/80 sticky top-0 z-50 transition-all duration-300"></header>'
clean_footer = '<footer id="global-footer" class="border-t border-[#1F222C]/60 py-10 text-xs text-[#525866]"></footer>'

def clean_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    content = header_pattern.sub(clean_header, content)
    content = footer_pattern.sub(clean_footer, content)

    # ✨ BASE_PATH 변수를 녹여내어 태그 주소를 정밀 주입합니다.
    content = css_pattern.sub(f'href="{BASE_PATH}/assets/css/style.css"', content)
    content = js_pattern.sub(f'src="{BASE_PATH}/assets/js/main.js"', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✔ ️자동 전환 완료: {file_path}")

def run_automation():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('.html'):
                if dirpath == root_dir and filename == 'index.html':
                    continue
                file_full_path = os.path.join(dirpath, filename)
                clean_html_file(file_full_path)

if __name__ == "__main__":
    print("🚀 TheEnd 프로젝트 깃허브 페이지 서브디렉토리 호환 스크립트를 구동합니다.")
    run_automation()
    print("🎉 배포 준비가 완벽히 완료되었습니다! 변경사항을 push 하셔도 좋습니다.")