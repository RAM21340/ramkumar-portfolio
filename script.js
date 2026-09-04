const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const progress = document.querySelector(".scroll-progress");

// Restore the user's preferred theme.
const savedTheme = localStorage.getItem("portfolio-theme");
const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = savedTheme || (preferredDark ? "dark" : "light");
root.dataset.theme = initialTheme;
themeIcon.textContent = initialTheme === "dark" ? "☀" : "☾";

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
  themeIcon.textContent = nextTheme === "dark" ? "☀" : "☾";
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

// Fade/slide elements into view.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 45, 180)}ms`;
  observer.observe(el);
});

// Highlight the navigation item for the section currently on screen.
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav-links > a");

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });

sections.forEach(section => sectionObserver.observe(section));

// Reading progress indicator.
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${(window.scrollY / max) * 100}%`;
}, { passive: true });

// Subtle magnetic hover effect for buttons/links.
document.querySelectorAll(".magnetic").forEach(el => {
  el.addEventListener("mousemove", e => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.12;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.12;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
