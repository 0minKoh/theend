import os
import re

# 🚀 [핵심 설정] 본인의 GitHub Pages 저장소(Repository) 이름을 정확히 입력합니다.
# 주소창의 https://0minkoh.github.io/theend/ 에서 'theend'에 해당합니다.
REPOSITORY_NAME = "theend"

header_pattern = re.compile(r'<header.*?>.*?</header>', re.DOTALL)
footer_pattern = re.compile(r'<footer.*?>.*?</footer>', re.DOTALL)
css_pattern = re.compile(r'href="[^"]*?assets/css/style\.css"')
js_pattern = re.compile(r'src="[^"]*?assets/js/main\.js"')

clean_header = '<header id="global-header" class="border-b border-transparent backdrop-blur-md bg-[#090A0F]/80 sticky top-0 z-50 transition-all duration-300"></header>'
clean_footer = '<footer id="global-footer" class="border-t border-[#1F222C]/60 py-10 text-xs text-[#525866]"></footer>'

def clean_html_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. 헤더/푸터 빈 껍데기 레이아웃 주입
    content = header_pattern.sub(clean_header, content)
    content = footer_pattern.sub(clean_footer, content)

    # 2. 슬래시 유무와 상관없이 항상 일치하도록 저장소 절대 경로 주입
    content = css_pattern.sub(f'href="/{REPOSITORY_NAME}/assets/css/style.css"', content)
    content = js_pattern.sub(f'src="/{REPOSITORY_NAME}/assets/js/main.js"', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✔ 절대 경로 가드레일 적용 완료: {file_path}")

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
    run_automation()
    print("🎉 GitHub Pages 슬래시 누락 방어 아키텍처 적용 완료!")