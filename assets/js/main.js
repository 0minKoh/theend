/**
 * TheEnd 글로벌 인터랙션 및 다국어 모바일 대응 레이아웃 엔진
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. 헤더 및 푸터 글로벌 동적 주입 실행
    renderGlobalHeaderAndFooter();
    
    // 2. 기존 인터랙션 엔진 구동
    initProductDropdown();
    initScrollHeader();
    initFadeInAnimation();
    
    // 3. 모바일 메뉴 토글 엔진 구동
    initMobileMenu();
});

/**
 * 0. 글로벌 헤더 & 푸터 동적 주입 엔진 (모바일 반응형 레이아웃 탑재)
 */
function renderGlobalHeaderAndFooter() {
    const headerContainer = document.getElementById("global-header");
    const footerContainer = document.getElementById("global-footer");

    let lang = document.documentElement.lang || 'en';
    if (lang.startsWith('ko')) lang = 'ko';
    else if (lang.startsWith('ja') || lang.startsWith('jp')) lang = 'jp';
    else if (lang.startsWith('zh')) lang = 'zh';
    else lang = 'en';

    // GitHub Pages 서브디렉토리 자동 경로 계산
    const pathParts = window.location.pathname.split('/');
    const BASE_PATH = window.location.hostname.includes('github.io') ? '/' + pathParts[1] : '';
    console.log('BASE_PATH:', BASE_PATH);

    const i18n = {
        ko: { home: "Home", products: "Products", blog: "Blog", them: "TheM (Closed Beta)", iclaw: "iClaw (준비 중)", aclaw: "aClaw (준비 중)" },
        en: { home: "Home", products: "Products", blog: "Blog", them: "TheM (Closed Beta)", iclaw: "iClaw (Soon)", aclaw: "aClaw (Soon)" },
        jp: { home: "Home", products: "Products", blog: "Blog", them: "TheM (Closed Beta)", iclaw: "iClaw (Soon)", aclaw: "aClaw (Soon)" },
        zh: { home: "Home", products: "Products", blog: "Blog", them: "TheM (Closed Beta)", iclaw: "iClaw (Soon)", aclaw: "aClaw (Soon)" }
    };
    const text = i18n[lang];

    const isTheM = window.location.pathname.includes('/products/the-m/');
    const getLangPath = (targetLang) => isTheM ? `${BASE_PATH}/products/the-m/main/${targetLang}/` : `${BASE_PATH}/main/${targetLang}/`;

    if (headerContainer) {
        headerContainer.innerHTML = `
            <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between relative">
                <!-- 브랜드 로고 -->
                <a href="${BASE_PATH}/main/${lang}/" class="text-xl font-bold tracking-tight hover:opacity-80 transition font-mono-tech z-50">TheEnd</a>
                
                <!-- [데스크톱 전용] 내비게이션 바 (md 이상 노출) -->
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

                <!-- [모바일 전용] 햄버거 토글 버튼 (md 미만 노출) -->
                <button id="mobile-menu-trigger" class="flex md:hidden text-[#8A8F98] hover:text-white transition p-1 focus:outline-none z-50" aria-label="Toggle Menu">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path id="hamburger-icon-path" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>

                <!-- [모바일 전용] 풀블리드 드롭다운 메뉴 오버레이 패널 -->
                <div id="mobile-menu" class="hidden absolute top-16 left-0 w-full bg-[#090A0F]/95 backdrop-blur-xl border-b border-[#1F222C] flex flex-col px-6 py-8 space-y-6 text-base font-medium text-[#8A8F98] transition-all duration-300 z-40 shadow-2xl">
                    <a href="${BASE_PATH}/main/${lang}/" class="text-white hover:text-white transition">${text.home}</a>
                    <div class="space-y-3">
                        <span class="text-xs tracking-widest text-[#525866] font-mono-tech block uppercase">${text.products}</span>
                        <div class="pl-4 flex flex-col space-y-4 border-l border-[#1F222C]">
                            <a href="${BASE_PATH}/products/the-m/main/${lang}/" class="hover:text-white transition text-sm">${text.them}</a>
                            <a href="${BASE_PATH}/products/i-claw/" class="hover:text-white transition text-sm">${text.iclaw}</a>
                            <a href="${BASE_PATH}/products/a-claw/" class="hover:text-white transition text-sm">${text.aclaw}</a>
                        </div>
                    </div>
                    <a href="${BASE_PATH}/blog/" class="hover:text-white transition">${text.blog}</a>
                    
                    <div class="pt-4 border-t border-[#1F222C]/60 flex items-center space-x-2 font-mono-tech text-xs">
                        <a href="${getLangPath('ko')}" class="px-2.5 py-1 rounded ${lang === 'ko' ? 'text-white bg-[#1F222C] font-semibold' : 'bg-[#13141C]'}" >KO</a>
                        <a href="${getLangPath('en')}" class="px-2.5 py-1 rounded ${lang === 'en' ? 'text-white bg-[#1F222C] font-semibold' : 'bg-[#13141C]'}" >EN</a>
                        <a href="${getLangPath('jp')}" class="px-2.5 py-1 rounded ${lang === 'jp' ? 'text-white bg-[#1F222C] font-semibold' : 'bg-[#13141C]'}" >JP</a>
                        <a href="${getLangPath('zh')}" class="px-2.5 py-1 rounded ${lang === 'zh' ? 'text-white bg-[#1F222C] font-semibold' : 'bg-[#13141C]'}" >ZH</a>
                    </div>
                </div>
            </div>
        `;
    }

    if (footerContainer) {
        footerContainer.innerHTML = `
            <div class="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div class="font-mono-tech">&copy; 2026 TheEnd. All rights reserved.</div>
                <div class="flex space-x-6">
                    <a href="https://github.com/0minKoh/theend" class="hover:text-[#8A8F98] transition" target="_blank">GitHub</a>
                </div>
            </div>
        `;
    }
}

/**
 * 0-B. 모바일 메뉴 토글 인터랙션 컨트롤러
 */
function initMobileMenu() {
    const trigger = document.getElementById("mobile-menu-trigger");
    const menu = document.getElementById("mobile-menu");
    const iconPath = document.getElementById("hamburger-icon-path");
    if (!trigger || !menu || !iconPath) return;

    trigger.addEventListener("click", () => {
        const isHidden = menu.classList.contains("hidden");
        if (isHidden) {
            menu.classList.remove("hidden");
            // 햄버거 삼선 세로줄에서 미니멀한 'X' 아이콘으로 SVG 패스 변경
            iconPath.setAttribute("d", "M6 18L18 6M6 6l12 12");
            iconPath.classList.add("text-white");
        } else {
            menu.classList.add("hidden");
            // 원래 삼선 메뉴 아이콘 패스로 원복
            iconPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
            iconPath.classList.remove("text-white");
        }
    });

    // 모바일 메뉴 열린 상태에서 데스크톱 화면으로 리사이즈 시 오버레이 강제 폐쇄 가드레일
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768 && !menu.classList.contains("hidden")) {
            menu.classList.add("hidden");
            iconPath.setAttribute("d", "M4 6h16M4 12h16M4 18h16");
        }
    });
}

/**
 * 1. 데스크톱 드롭다운 제어
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
 * 2. 스크롤 헤더 보더 제어
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
 * 3. 페이드인 애니메이션 인터랙션
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