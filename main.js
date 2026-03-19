(function () {
  const header = document.querySelector("header.site-header");
  const mobileMenu = document.getElementById("mobileMenu");
  const hamburger = document.querySelector(".hamburger");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      mobileMenu.setAttribute("aria-hidden", String(!isOpen));
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-close-menu='true']");
      if (a) {
        mobileMenu.classList.remove("open");
        mobileMenu.setAttribute("aria-hidden", "true");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Reveal sections as they enter viewport
  const revealTargets = document.querySelectorAll("main > section:not(.hero), footer.site-footer");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealTargets.length) {
    revealTargets.forEach((el) => el.classList.add("scroll-reveal"));

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((el) => el.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
      );

      revealTargets.forEach((el) => observer.observe(el));
    }
  }

  // FormSubmit: show thank-you after redirect back to this page
  (function handleFormSubmitReturn() {
    if (window.location.hash !== "#estimate-sent") return;
    const formCardEl = document.getElementById("estimate-form-card");
    const successEl = document.getElementById("success-message");
    if (formCardEl) formCardEl.style.display = "none";
    if (successEl) successEl.classList.add("show");
    const clean =
      window.location.pathname + window.location.search + "#contact";
    history.replaceState(null, "", clean);
  })();

  // Contact form validation + FormSubmit POST
  const form = document.getElementById("estimate-form");
  const formsubmitNext = document.getElementById("formsubmit-next");
  const formsubmitReplyto = document.getElementById("formsubmit-replyto");

  if (formsubmitNext) {
    formsubmitNext.value =
      window.location.origin +
      window.location.pathname +
      window.location.search +
      "#estimate-sent";
  }

  const requiredFields = [
    { id: "firstName", msg: "Please enter your first name." },
    { id: "phone", msg: "Please enter your phone number." },
    { id: "email", msg: "Please enter your email address." }
  ];

  function setError(fieldId, errorText) {
    const input = document.getElementById(fieldId);
    const errEl = document.getElementById("error-" + fieldId);
    if (!input || !errEl) return;
    input.setAttribute("aria-invalid", errorText ? "true" : "false");
    errEl.textContent = errorText || "";
  }

  function validate() {
    let ok = true;
    requiredFields.forEach((f) => {
      const input = document.getElementById(f.id);
      const value = (input && input.value ? input.value.trim() : "");
      const empty = value.length === 0;
      if (empty) {
        ok = false;
        setError(f.id, f.msg);
      } else {
        setError(f.id, "");
      }
    });
    return ok;
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validate()) return;

      const formEl = e.currentTarget;
      const emailInput = document.getElementById("email");
      if (formsubmitReplyto && emailInput) {
        formsubmitReplyto.value = (emailInput.value || "").trim();
      }
      if (formsubmitNext) {
        formsubmitNext.value =
          window.location.origin +
          window.location.pathname +
          window.location.search +
          "#estimate-sent";
      }

      formEl.submit();
    });
  }

  // Close mobile menu on scroll (avoids covering content)
  window.addEventListener("scroll", () => {
    if (mobileMenu && mobileMenu.classList.contains("open")) {
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
      if (hamburger) hamburger.setAttribute("aria-expanded", "false");
    }
  });
})();
