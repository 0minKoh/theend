import os
import re

header_pattern = re.compile(r'<header.*?>.*?</header>', re.DOTALL)
footer_pattern = re.compile(r'<footer.*?>.*?</footer>', re.DOTALL)
css_pattern = re.compile(r'href="[^"]*?assets/css/style\.css"')
js_pattern = re.compile(r'src="[^"]*?assets/js/main\.js"')

clean_header = '<header id="global-header" class="border-b border-transparent backdrop-blur-md bg-[#090A0F]/80 sticky top-0 z-50 transition-all duration-300"></header>'
clean_footer = '<footer id="global-footer" class="border-t border-[#1F222C]/60 py-10 text-xs text-[#525866]"></footer>'

def clean_html_file(file_path, root_dir):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Calculate exact depth relative to the project root to prevent 404s
    relative_dir = os.path.relpath(os.path.dirname(file_path), root_dir)
    if relative_dir == '.':
        depth_prefix = './'
    else:
        depth = len(relative_dir.replace('\\', '/').split('/'))
        depth_prefix = '../' * depth

    # 1. Inject global layout shells
    content = header_pattern.sub(clean_header, content)
    content = footer_pattern.sub(clean_footer, content)

    # 2. Bind core styles and scripts using fail-safe relative paths
    content = css_pattern.sub(f'href="{depth_prefix}assets/css/style.css"', content)
    content = js_pattern.sub(f'src="{depth_prefix}assets/js/main.js"', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✔ Fixed paths & components: {file_path} (Depth prefix: {depth_prefix})")

def run_automation():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith('.html'):
                if dirpath == root_dir and filename == 'index.html':
                    continue
                file_full_path = os.path.join(dirpath, filename)
                clean_html_file(file_full_path, root_dir)

if __name__ == "__main__":
    run_automation()
    print("🎉 Asset 404 vulnerabilities fixed across all subdirectories!")