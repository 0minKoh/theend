/**
 * TheEnd 글로벌 인터랙션 및 동적 레이아웃 스크립트
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. 헤더 및 푸터 글로벌 동적 주입 실행
    renderGlobalHeaderAndFooter();
    
    // 2. 기존 인터랙션 엔진 구동
    initProductDropdown();
    initScrollHeader();
    initFadeInAnimation();
});

/**
 * 0. 글로벌 헤더 & 푸터 동적 주입 엔진 (GitHub Pages 서브디렉토리 완벽 대응)
 */
function renderGlobalHeaderAndFooter() {
    const headerContainer = document.getElementById("global-header");
    const footerContainer = document.getElementById("global-footer");

    // <html> 태그의 lang 속성을 읽어 기본 언어 설정 (기본값 en)
    let lang = document.documentElement.lang || 'en';
    if (lang.startsWith('ko')) lang = 'ko';
    else if (lang.startsWith('ja') || lang.startsWith('jp')) lang = 'jp';
    else if (lang.startsWith('zh')) lang = 'zh';
    else lang = 'en';

    // ✨ [핵심] GitHub Pages 서브디렉토리(/theend) 자동 감지 로직
    // github.io 호스팅 환경일 때는 '/theend'를 적용하고, 로컬(localhost) 환경일 때는 빈 문자열('') 처리
    const BASE_PATH = window.location.hostname.includes('github.io') ? '/theend' : '';

    // 다국어 사전 정의
    const i18n = {
        ko: { home: "Home", products: "Products", blog: "Blog", them: "TheM (Closed Beta)", iclaw: "iClaw (준비 중)", aclaw: "aClaw (준비 중)" },
        en: { home: "Home", products: "Products", blog: "Blog", them: "TheM (Closed Beta)", iclaw: "iClaw (Soon)", aclaw: "aClaw (Soon)" },
        jp: { home: "Home", products: "Products", blog: "Blog", them: "TheM (Closed Beta)", iclaw: "iClaw (Soon)", aclaw: "aClaw (Soon)" },
        zh: { home: "Home", products: "Products", blog: "Blog", them: "TheM (Closed Beta)", iclaw: "iClaw (Soon)", aclaw: "aClaw (Soon)" }
    };

    const text = i18n[lang];

    // 현재 사용자가 TheM 상세 페이지에 있는지 판단하여 언어 탭 클릭 시 매끄러운 대칭 이동 구현
    const isTheM = window.location.pathname.includes('/products/the-m/');
    const getLangPath = (targetLang) => isTheM ? `${BASE_PATH}/products/the-m/main/${targetLang}/` : `${BASE_PATH}/main/${targetLang}/`;

    // 헤더 주입 (모든 링크 내부 주소 앞단에 ${BASE_PATH} 변수를 주입합니다)
    if (headerContainer) {
        headerContainer.innerHTML = `
            <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                <a href="${BASE_PATH}/main/${lang}/" class="text-xl font-bold tracking-tight hover:opacity-80 transition font-mono-tech">TheEnd</a>
                
                <nav class="hidden md:flex items-center space-x-8 text-sm font-medium text-[#8A8F98]">
                    <a href="${BASE_PATH}/main/${lang}/" class="text-white">${text.home}</a>
                    
                    <div class="relative group">
                        <button class="dropdown-trigger text-white flex items-center gap-1 transition">
                            ${text.products}
                            <svg class="w-3 h-3 text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div class="dropdown-menu absolute left-0 mt-2 w-48 bg-[#13141C] border border-[#1F222C] rounded-xl shadow-xl p-1.5 z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
                            <a href="${BASE_PATH}/products/the-m/main/${lang}/" class="block px-3 py-2.5 text-xs rounded-lg hover:bg-[#1F222C] hover:text-white transition font-mono-tech">${text.them}</a>
                            <a href="${BASE_PATH}/products/i-claw/" class="block px-3 py-2.5 text-xs rounded-lg hover:bg-[#1F222C] hover:text-white transition font-mono-tech">${text.iclaw}</a>
                            <a href="${BASE_PATH}/products/a-claw/" class="block px-3 py-2.5 text-xs rounded-lg hover:bg-[#1F222C] hover:text-white transition font-mono-tech">${text.aclaw}</a>
                        </div>
                    </div>
                    
                    <a href="${BASE_PATH}/blog/" class="hover:text-white transition">${text.blog}</a>
                    
                    <div class="flex items-center space-x-1.5 font-mono-tech text-[11px] border border-[#1F222C] p-0.5 rounded-lg bg-[#13141C]/50">
                        <a href="${getLangPath('ko')}" class="px-2 py-0.5 rounded ${lang === 'ko' ? 'text-white bg-[#1F222C] font-semibold' : 'hover:text-white'} transition">KO</a>
                        <a href="${getLangPath('en')}" class="px-2 py-0.5 rounded ${lang === 'en' ? 'text-white bg-[#1F222C] font-semibold' : 'hover:text-white'} transition">EN</a>
                        <a href="${getLangPath('jp')}" class="px-2 py-0.5 rounded ${lang === 'jp' ? 'text-white bg-[#1F222C] font-semibold' : 'hover:text-white'} transition">JP</a>
                        <a href="${getLangPath('zh')}" class="px-2 py-0.5 rounded ${lang === 'zh' ? 'text-white bg-[#1F222C] font-semibold' : 'hover:text-white'} transition">ZH</a>
                    </div>
                </nav>
            </div>
        `;
    }

    // 푸터 주입
    if (footerContainer) {
        footerContainer.innerHTML = `
            <div class="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="font-mono-tech">&copy; 2026 TheEnd. All rights reserved.</div>
                <div class="flex space-x-6">
                    <a href="https://github.com" class="hover:text-[#8A8F98] transition" target="_blank">GitHub</a>
                </div>
            </div>
        `;
    }
}

/**
 * 1. 헤더 내비게이션 드롭다운 제어 (Mouse & Focus)
 */
function initProductDropdown() {
    const dropdownBtn = document.querySelector(".dropdown-trigger");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    if (!dropdownBtn || !dropdownMenu) return;

    dropdownBtn.addEventListener("click", (e) => {
        e.preventDefault();
        dropdownMenu.classList.toggle("opacity-100");
        dropdownMenu.classList.toggle("pointer-events-auto");
    });

    document.addEventListener("click", (e) => {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove("opacity-100", "pointer-events-auto");
        }
    });
}

/**
 * 2. 스크롤 시 헤더 보더라인 활성화
 */
function initScrollHeader() {
    const header = document.querySelector("header");
    if (!header) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            header.classList.add("border-b", "border-[#1F222C]");
            header.classList.remove("border-transparent");
        } else {
            header.classList.remove("border-b", "border-[#1F222C]");
            header.classList.add("border-transparent");
        }
    });
}

/**
 * 3. 스크롤 인터랙션 엔진
 */
function initFadeInAnimation() {
    const fadeElements = document.querySelectorAll("[data-fade]");
    const observerOptions = { root: null, threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove("opacity-0", "translate-y-4");
                entry.target.classList.add("opacity-100", "translate-y-0");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
}