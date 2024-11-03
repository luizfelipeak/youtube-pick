// navigation
const primaryNav = document.querySelector("#primary-navigation");
const navBtn = document.querySelector("#nav-btn");
const scrollWatcher = document.createElement("div");
let prevScrollPosition = window.scrollY;
const categoriesBtn = document.querySelector("#btn-categories");

// language
const langBtn = document.querySelector("#btn-lang");
const menuLang = document.querySelector(".menu-language");

// navigation observer
const navObserver = new IntersectionObserver(entries => {
    primaryNav.classList.toggle("scrolled", !entries[0].isIntersecting);
}, {rootMargin: "80px 0px 0px 0px"});

function navigationDisplay() {
    let scrollPosition = window.scrollY;

    if(prevScrollPosition > scrollPosition) {
        primaryNav.classList.remove("hidden");
    }
    else if(scrollPosition > 100) {
        primaryNav.classList.add("hidden");
        langBtn.setAttribute("aria-expanded", "false");
        navBtn.setAttribute("aria-expanded", "false");
        categoriesBtn.setAttribute("aria-expanded", "false");
    }
    prevScrollPosition = scrollPosition;
}

scrollWatcher.setAttribute("data-scroll-watcher", "");
primaryNav.before(scrollWatcher);
navObserver.observe(scrollWatcher);
window.addEventListener("scroll", navigationDisplay);

navBtn.addEventListener("click", () => {
    const isOpened = navBtn.getAttribute("aria-expanded") === "true";
    isOpened ? navBtn.setAttribute("aria-expanded", "false") : navBtn.setAttribute("aria-expanded", "true");
});

categoriesBtn.addEventListener("click", () => {
    const isOpened = categoriesBtn.getAttribute("aria-expanded") === "true";
    isOpened ? categoriesBtn.setAttribute("aria-expanded", "false") : categoriesBtn.setAttribute("aria-expanded", "true");
});

langBtn.addEventListener("click", () => {
    const isOpened = langBtn.getAttribute("aria-expanded") === "true";
    isOpened ? langBtn.setAttribute("aria-expanded", "false") : langBtn.setAttribute("aria-expanded", "true");
});