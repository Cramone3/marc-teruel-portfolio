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

// Automation workflow modal
(function () {
  const triggers = document.querySelectorAll(".work-card-trigger[data-workflow]");
  const closeBtn = document.getElementById("automation-modal-close");
  const modal = document.getElementById("automation-modal");
  const titleEl = document.getElementById("automation-modal-title");
  const descEl = document.getElementById("automation-modal-desc");
  const chainEl = document.getElementById("automation-modal-chain");
  const branchesEl = document.getElementById("automation-modal-branches");
  if (!triggers.length || !modal) return;

  const workflows = {
    "appointment-reminder": {
      title: "Appointment Confirmation + Reminder",
      desc: "GoHighLevel automation that confirms a booked discovery call, then sends timed reminders leading up to it.",
      steps: [
        { label: "Booked<br>Appointment", type: "trigger" },
        { label: "Confirmation<br>Email", type: "action" },
        { label: "Wait<br>24h", type: "action" },
        { label: "Reminder<br>Email", type: "action" },
        { label: "Wait<br>1h", type: "action" },
        { label: "Reminder<br>Email", type: "action" },
        { label: "Wait<br>5m", type: "action" },
        { label: "Final<br>Reminder", type: "action" },
      ],
    },
    "inbound-webhook": {
      title: "Inbound Webhook",
      desc: "GoHighLevel automation that catches an inbound webhook, enriches the contact via Apollo, and tags it for routing.",
      steps: [
        { label: "Inbound<br>Webhook", type: "trigger" },
        { label: "Get Contact<br>Details from Apollo", type: "action" },
        { label: "Tag: apollo<br>inbound", type: "action" },
      ],
    },
    "lead-source": {
      title: "Lead Source",
      desc: "GoHighLevel automation that routes a submitted lead into a nurture sequence based on how they found us.",
      steps: [
        { label: "Form<br>Submitted", type: "trigger" },
        { label: "Add Tag:<br>new-lead", type: "action" },
        { label: "Pipeline Stage:<br>New Lead", type: "action" },
        { label: "Wait<br>30s", type: "action" },
        { label: "Condition:<br>Lead Source?", type: "action" },
      ],
      branches: [
        {
          label: "If Social Media",
          steps: [
            { label: "Add Tag:<br>social-media-lead", type: "action" },
            { label: "Email:<br>Welcome", type: "action" },
            { label: "Wait<br>30 days", type: "action" },
            { label: "Remove Tag:<br>new-lead", type: "action" },
          ],
        },
        {
          label: "If Website",
          steps: [
            { label: "Add Tag:<br>website-lead", type: "action" },
            { label: "Email:<br>Popular Links", type: "action" },
            { label: "Wait<br>30 days", type: "action" },
            { label: "Remove Tag:<br>new-lead", type: "action" },
          ],
        },
        {
          label: "If Referral",
          steps: [
            { label: "Add Tag:<br>referral-lead", type: "action" },
            { label: "Email:<br>Thank You", type: "action" },
            { label: "Wait<br>30 days", type: "action" },
            { label: "Remove Tag:<br>new-lead", type: "action" },
          ],
        },
      ],
    },
  };

  function buildChainMarkup(steps) {
    return steps
      .map((step, i) => {
        const node = `<div class="wf-node wf-${step.type}">${step.label}</div>`;
        return i < steps.length - 1 ? node + '<div class="wf-arrow"></div>' : node;
      })
      .join("");
  }

  function buildBranchesMarkup(branches) {
    if (!branches || !branches.length) return "";
    return branches
      .map(
        (branch) =>
          `<p class="wf-branch-label">${branch.label}</p><div class="wf-chain">${buildChainMarkup(branch.steps)}</div>`
      )
      .join("");
  }

  function openModal(key) {
    const workflow = workflows[key];
    if (!workflow) return;
    titleEl.textContent = workflow.title;
    descEl.textContent = workflow.desc;
    chainEl.innerHTML = buildChainMarkup(workflow.steps);
    branchesEl.innerHTML = buildBranchesMarkup(workflow.branches);
    modal.hidden = false;
  }

  function closeModal() {
    modal.hidden = true;
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openModal(trigger.dataset.workflow));
  });

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });
})();
