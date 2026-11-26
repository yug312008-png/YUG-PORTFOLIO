/* ==========================================================================
   Yug Patel Portfolio — Interactive Functionality (Vanilla JS)
   ========================================================================== */

(function () {
  "use strict";

  const DESKTOP_BREAKPOINT = 768;

  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = Array.from(document.querySelectorAll(".nav-link, .mobile-nav-link"));
  const anchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  const currentYearEl = document.getElementById("current-year");

  /* ------------------------------------------------------------------------
     Helper: Reduced Motion Check
     ------------------------------------------------------------------------ */
  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ------------------------------------------------------------------------
     Footer Copyright Year
     ------------------------------------------------------------------------ */
  function updateCopyrightYear() {
    if (currentYearEl) {
      currentYearEl.textContent = String(new Date().getFullYear());
    }
  }

  /* ------------------------------------------------------------------------
     Header Scroll State & Edge Section Activation
     ------------------------------------------------------------------------ */
  function handleScroll() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }

    if (sections.length === 0) return;

    if (window.scrollY < 40) {
      setActiveNavLink(sections[0].id);
      return;
    }

    const reachedBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24;

    if (reachedBottom) {
      setActiveNavLink(sections[sections.length - 1].id);
    }
  }

  /* ------------------------------------------------------------------------
     Mobile Hamburger Menu
     ------------------------------------------------------------------------ */
  function isMobileMenuOpen() {
    return Boolean(navToggle && navToggle.getAttribute("aria-expanded") === "true");
  }

  function openMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close navigation menu");
    mobileMenu.hidden = false;
    document.body.classList.add("menu-open");
  }

  function closeMobileMenu() {
    if (!navToggle || !mobileMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
    mobileMenu.hidden = true;
    document.body.classList.remove("menu-open");
  }

  function toggleMobileMenu() {
    if (isMobileMenuOpen()) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function initMobileMenu() {
    if (!navToggle || !mobileMenu) return;

    navToggle.addEventListener("click", toggleMobileMenu);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isMobileMenuOpen()) {
        closeMobileMenu();
        navToggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!isMobileMenuOpen() || !header) return;
      if (!header.contains(event.target)) {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > DESKTOP_BREAKPOINT && isMobileMenuOpen()) {
        closeMobileMenu();
      }
    });
  }

  /* ------------------------------------------------------------------------
     Active Navigation Link State
     ------------------------------------------------------------------------ */
  function setActiveNavLink(targetId) {
    navLinks.forEach(function (link) {
      const isMatch = link.getAttribute("href") === "#" + targetId;
      link.classList.toggle("is-active", isMatch);
      if (isMatch) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  /* ------------------------------------------------------------------------
     Smooth Scrolling & Functional Anchor Navigation
     ------------------------------------------------------------------------ */
  function scrollToElement(element, targetId) {
    const behavior = prefersReducedMotion() ? "auto" : "smooth";

    if (targetId === "home") {
      window.scrollTo({ top: 0, behavior: behavior });
      return;
    }

    const headerHeight = header ? header.offsetHeight : 0;
    const elementTop = element.getBoundingClientRect().top + window.scrollY;
    const targetTop = Math.max(0, elementTop - headerHeight);

    window.scrollTo({
      top: targetTop,
      behavior: behavior
    });
  }

  function initSmoothNavigation() {
    anchorLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;

        const targetId = href.slice(1);
        const targetSection = document.getElementById(targetId);

        if (isMobileMenuOpen()) {
          closeMobileMenu();
        }

        if (!targetSection) return;

        event.preventDefault();
        scrollToElement(targetSection, targetId);

        if (targetSection.tagName === "SECTION") {
          setActiveNavLink(targetId);
        }

        if (window.history && typeof window.history.replaceState === "function") {
          window.history.replaceState(null, "", "#" + targetId);
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     Active Section Observer
     ------------------------------------------------------------------------ */
  function initSectionSpy() {
    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.target.id) {
            setActiveNavLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0
      }
    );

    sections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  /* ------------------------------------------------------------------------
     Subtle Entrance Animations
     ------------------------------------------------------------------------ */
  function initRevealAnimations() {
    if (revealElements.length === 0) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      revealElements.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     Initialize
     ------------------------------------------------------------------------ */
  function init() {
    updateCopyrightYear();
    handleScroll();
    initMobileMenu();
    initSmoothNavigation();
    initSectionSpy();
    initRevealAnimations();

    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
