document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const revealTargets = document.querySelectorAll(
  ".section, .hero-text, .hero-photo, .work-card, .process-card, .contact-card"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealTargets.forEach((el) => observer.observe(el));

const siteHeader = document.querySelector(".site-header");

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const targetId = link.getAttribute("href").slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();

    const headerHeight = siteHeader.offsetHeight;
    const viewportHeight = window.innerHeight;
    const availableHeight = viewportHeight - headerHeight;
    const rect = target.getBoundingClientRect();
    const sectionHeight = rect.height;

    let scrollTarget;
    if (sectionHeight <= availableHeight) {
      scrollTarget =
        window.scrollY + rect.top - headerHeight - (availableHeight - sectionHeight) / 2;
    } else {
      scrollTarget = window.scrollY + rect.top - headerHeight - 16;
    }

    window.scrollTo({ top: Math.max(scrollTarget, 0), behavior: "smooth" });
  });
});
