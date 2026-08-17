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
    "no-show-nurture": {
      title: "No-Show Nurture",
      desc: "GoHighLevel automation that follows up after a missed appointment with a reschedule email, then checks in again a day later.",
      steps: [
        { label: "Appointment<br>Status", type: "trigger" },
        { label: "Email:<br>Reschedule Follow-up", type: "action" },
        { label: "Wait<br>1 day", type: "action" },
        { label: "Email:<br>Just Checking In", type: "action" },
      ],
    },
    "lead-scdc-1": {
      title: "Lead SCDC (1 of 3) — Trigger & Patient Routing",
      desc: "A larger dental-clinic (Smile and Co) lead workflow, split across 3 cards. Part 1: the form submission routes into a new-patient vs. existing-patient path, each notifying the team and sending a tailored welcome email.",
      steps: [
        { label: "Form<br>Submitted", type: "trigger" },
        { label: "Wait", type: "action" },
        { label: "Condition:<br>New Patient?", type: "action" },
      ],
      branches: [
        {
          label: "If Yes — New Patient",
          steps: [
            { label: "Add<br>Tag", type: "action" },
            { label: "Create/Update<br>Opportunity", type: "action" },
            { label: "Assign to<br>User", type: "action" },
            { label: "Email + Internal<br>Notification", type: "action" },
            { label: "Welcome<br>Email", type: "action" },
          ],
        },
        {
          label: "If No — Existing Patient",
          steps: [
            { label: "Add<br>Tag", type: "action" },
            { label: "Create/Update<br>Opportunity", type: "action" },
            { label: "Assign to<br>User", type: "action" },
            { label: "Email + Internal<br>Notification", type: "action" },
            { label: "Welcome Back<br>Email", type: "action" },
          ],
        },
      ],
    },
    "lead-scdc-2": {
      title: "Lead SCDC (2 of 3) — Reminder Cadence",
      desc: "Part 2: if the lead still hasn't booked, an escalating reminder cadence runs (identically for both the new- and existing-patient paths from Part 1) until they book or drop off.",
      steps: [
        { label: "Condition:<br>Booked a Schedule?", type: "action" },
      ],
      branches: [
        {
          label: "1st Follow-up — Day 1",
          steps: [
            { label: "Wait<br>1 day", type: "action" },
            { label: "Email:<br>Reminder", type: "action" },
          ],
        },
        {
          label: "2nd Follow-up — Day 4",
          steps: [
            { label: "Wait<br>3 days", type: "action" },
            { label: "Wait<br>3 days", type: "action" },
            { label: "Email:<br>Reminder", type: "action" },
          ],
        },
        {
          label: "3rd Follow-up — Day 11",
          steps: [
            { label: "Wait<br>7 days", type: "action" },
            { label: "Email:<br>Reminder", type: "action" },
          ],
        },
      ],
    },
    "lead-scdc-3": {
      title: "Lead SCDC (3 of 3) — Final Follow-up",
      desc: "Part 3: the last touch in the cadence — a final \"Last Chance\" email before the contact is removed from the workflow.",
      steps: [
        { label: "Condition:<br>Still Hasn't Booked?", type: "action" },
        { label: "Email:<br>Last Chance — Free Smile Assessment", type: "action" },
        { label: "Wait", type: "action" },
        { label: "Remove from<br>Workflow", type: "action" },
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
