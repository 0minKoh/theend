/**
 * TheEnd 글로벌 인터랙션 스크립트
 */
document.addEventListener("DOMContentLoaded", () => {
    initProductDropdown();
    initScrollHeader();
    initFadeInAnimation();
});

/**
 * 1. 헤더 내비게이션 드롭다운 제어 (Mouse & Focus)
 */
function initProductDropdown() {
    const dropdownBtn = document.querySelector(".dropdown-trigger");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (!dropdownBtn || !dropdownMenu) return;

    // Hover 처리는 CSS(group-hover)로 처리하고, 여기서는 웹 접근성(Focus) 및 클릭 예외 처리만 보조
    dropdownBtn.addEventListener("click", (e) => {
        e.preventDefault();
        dropdownMenu.classList.toggle("opacity-100");
        dropdownMenu.classList.toggle("pointer-events-auto");
    });

    // 외부 클릭 시 드롭다운 닫기
    document.addEventListener("click", (e) => {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove("opacity-100", "pointer-events-auto");
        }
    });
}

/**
 * 2. 스크롤 시 헤더 보더라인 활성화 (상태 변화)
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
 * 3. 스크롤 인터랙션 (콘텐츠가 부드럽게 등장하는 효과)
 * HTML 요소에 'opacity-0 translate-y-4 transition-all duration-700'과 'data-fade'를 주면 작동
 */
function initFadeInAnimation() {
    const fadeElements = document.querySelectorAll("[data-fade]");
    
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove("opacity-0", "translate-y-4");
                entry.target.classList.add("opacity-100", "translate-y-0");
                observer.unobserve(entry.target); // 한 번 등장하면 관찰 해제
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
}