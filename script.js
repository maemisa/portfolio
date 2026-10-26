(function () {
  "use strict";

  var CONTACT_EMAIL = "misamaeprincess@gmail.com"; // keep in sync with index.html

  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("navMenu");

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav__link");

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute("id");
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  var revealTargets = document.querySelectorAll(
    ".section__head, .service-card, .work-card, .step, .quote, .stat, .about__photo, .about__body, .commission, .contact__form"
  );
  if ("IntersectionObserver" in window && revealTargets.length) {
    revealTargets.forEach(function (el) { el.classList.add("reveal"); });
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }

  // Contact form: GitHub Pages can't receive form data, so the form opens
  // the visitor's email app with the message already filled in (mailto).
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        note.textContent = "Please fill in every field before sending.";
        return;
      }
      var name = form.elements["name"].value.trim();
      var email = form.elements["email"].value.trim();
      var message = form.elements["message"].value.trim();
      var subject = "Portfolio message from " + name;
      var body = message + "\n\n— " + name + " (" + email + ")";
      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      note.innerHTML = 'Opening your email app… If nothing opens, please email me at <a href="mailto:' +
        CONTACT_EMAIL + '">' + CONTACT_EMAIL + "</a>.";
      form.reset();
    });
  }

  // Newsletter: same approach — opens an email asking to be added to updates.
  var news = document.getElementById("newsletter");
  if (news) {
    news.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = news.querySelector("input");
      if (!input.checkValidity()) { input.focus(); return; }
      var subject = "Newsletter sign-up";
      var body = "Please add this email to your updates list: " + input.value.trim();
      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      input.value = "";
    });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

/* =====================================================
   WORK SECTION — carousels, filters and project popup
   ===================================================== */
(function () {
  "use strict";

  // 1. Screen carousels (one per card)
  document.querySelectorAll(".pw-preview").forEach(function (preview) {
    var track = preview.querySelector(".pw-track");
    var dots = preview.querySelectorAll(".pw-dot");
    var prev = preview.querySelector(".pw-prev");
    var next = preview.querySelector(".pw-next");
    var total = dots.length;
    var index = 0;
    if (!track || !total) return;

    function show(n) {
      index = (n + total) % total;
      track.style.transform = "translateX(-" + (index * 100 / total) + "%)";
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === index); });
    }
    if (prev) prev.addEventListener("click", function (e) { e.stopPropagation(); show(index - 1); });
    if (next) next.addEventListener("click", function (e) { e.stopPropagation(); show(index + 1); });
  });

  // 2. Category filters
  var filterBtns = document.querySelectorAll(".pw-filter");
  var cards = document.querySelectorAll(".pw-card");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var filter = btn.getAttribute("data-filter");
      filterBtns.forEach(function (b) { b.classList.toggle("is-active", b === btn); });
      cards.forEach(function (card) {
        var cats = (card.getAttribute("data-categories") || "").split(" ");
        card.style.display = (filter === "all" || cats.indexOf(filter) !== -1) ? "flex" : "none";
      });
    });
  });

  // 3. Project popup.
  //    TODO: put your real links in "live" (deployed project) and "code" (GitHub repo).
  //    Leave a link as "" and its button is hidden automatically.
  var projects = {
    "recipe-finder": {
      tag: "Class project",
      title: "Recipe Finder",
      desc: "A small app where you type an ingredient and see matching recipes.",
      role: "Built the layout and the search logic.",
      stack: ["HTML", "CSS", "JavaScript"],
      live: "",
      code: ""
    },
    "study-planner": {
      tag: "Class project",
      title: "Study Planner",
      desc: "A to-do style planner for tracking assignments and due dates on a phone.",
      role: "Designed the interface and saved tasks in the browser.",
      stack: ["HTML", "CSS", "localStorage"],
      live: "",
      code: ""
    },
    "weather-dashboard": {
      tag: "Class project",
      title: "Weather Dashboard",
      desc: "Look up the current weather for a city, with loading and error states.",
      role: "Connected the API and built the responsive cards.",
      stack: ["JavaScript", "API", "CSS Grid"],
      live: "",
      code: ""
    }
  };

  var modal = document.getElementById("pwModal");
  if (!modal) return;
  var closeBtn = document.getElementById("pwModalClose");
  var liveLink = document.getElementById("pwModalLive");
  var codeLink = document.getElementById("pwModalCode");
  var linksBox = modal.querySelector(".pw-modal__links");
  var lastFocus = null;

  function setLink(el, url) {
    if (url) { el.href = url; el.style.display = ""; }
    else { el.removeAttribute("href"); el.style.display = "none"; }
  }

  function openModal(id) {
    var p = projects[id];
    if (!p) return;
    document.getElementById("pwModalTag").textContent = p.tag;
    document.getElementById("pwModalTitle").textContent = p.title;
    document.getElementById("pwModalDesc").textContent = p.desc;
    document.getElementById("pwModalRole").textContent = p.role;

    var stack = document.getElementById("pwModalStack");
    stack.innerHTML = "";
    p.stack.forEach(function (t) {
      var chip = document.createElement("span");
      chip.textContent = t;
      stack.appendChild(chip);
    });

    setLink(liveLink, p.live);
    setLink(codeLink, p.code);
    linksBox.style.display = (p.live || p.code) ? "flex" : "none";

    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll(".pw-view").forEach(function (btn) {
    btn.addEventListener("click", function () { openModal(btn.getAttribute("data-project")); });
  });
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });
})();