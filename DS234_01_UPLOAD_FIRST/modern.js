(function () {
  "use strict";

  function headerOffset() {
    const header = document.getElementById("quarto-header");
    if (!header) {
      return 20;
    }
    return Math.ceil(header.getBoundingClientRect().height) + 10;
  }

  function scrollToTarget(target, pushHash) {
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top =
      target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
    window.scrollTo({
      top,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });

    if (pushHash && target.id) {
      window.history.pushState(null, "", "#" + target.id);
    }
  }

  function enableSmoothScrolling() {
    document.addEventListener("click", function (event) {
      const link = event.target.closest(
        'a[data-scroll-target], #TOC a[href^="#"], a.quarto-xref[href^="#"]'
      );
      if (!link) {
        return;
      }

      const rawTarget =
        link.getAttribute("data-scroll-target") || link.getAttribute("href");
      if (!rawTarget || rawTarget === "#") {
        return;
      }

      if (!rawTarget.startsWith("#")) {
        return;
      }

      const target = document.querySelector(rawTarget);
      if (!target) {
        return;
      }

      event.preventDefault();
      scrollToTarget(target, true);
    });

    if (window.location.hash && window.location.hash.length > 1) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        window.setTimeout(function () {
          scrollToTarget(target, false);
        }, 120);
      }
    }
  }

  function styleExerciseParagraphs() {
    const paragraphs = document.querySelectorAll("main.content p");
    paragraphs.forEach(function (paragraph) {
      const strong = paragraph.querySelector(":scope > strong");
      if (!strong) {
        return;
      }
      const label = strong.textContent.trim();
      if (/^Exercise\b/i.test(label)) {
        paragraph.classList.add("exercise-item");
      }
    });
  }

  function collapsibleLongSections() {
    const candidates = document.querySelectorAll(
      "main.content section.level2, main.content section.level3"
    );

    candidates.forEach(function (section) {
      if (section.id && (section.id.startsWith("exercise-") || section.id.includes("chapexercise"))) {
        return;
      }

      const nestedSection = Array.from(section.children).some(function (child) {
        return child.tagName === "SECTION";
      });
      if (nestedSection) {
        return;
      }

      const heading = section.querySelector(":scope > h2, :scope > h3");
      if (!heading) {
        return;
      }

      const blocks = Array.from(section.children).filter(function (child) {
        return !/^H[1-6]$/.test(child.tagName);
      });

      if (blocks.length < 8) {
        return;
      }

      section.classList.add("ds-collapsible");

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "ds-collapse-toggle";
      toggle.textContent = "Collapse";
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Collapse this section");

      toggle.addEventListener("click", function () {
        const isCollapsed = section.classList.toggle("ds-collapsed");
        toggle.textContent = isCollapsed ? "Expand" : "Collapse";
        toggle.setAttribute("aria-expanded", String(!isCollapsed));
        toggle.setAttribute(
          "aria-label",
          isCollapsed ? "Expand this section" : "Collapse this section"
        );
      });

      heading.appendChild(toggle);
    });
  }

  function improveAnchors() {
    const anchors = document.querySelectorAll("a.anchorjs-link");
    anchors.forEach(function (anchor) {
      anchor.setAttribute("aria-label", "Section link");
      anchor.setAttribute("title", "Section link");
    });
  }

  function injectThemeSprites() {
    if (document.querySelector(".ds-theme-sprites")) {
      return;
    }

    const sprites = [
      { cls: "ds-sprite-charizard", src: "theme-images/mega-charizard.png" },
      { cls: "ds-sprite-meowth", src: "theme-images/meowth.jpg" },
      { cls: "ds-sprite-mewtwo", src: "theme-images/mewtwo.png" },
      { cls: "ds-sprite-rayquaza", src: "theme-images/rayquaza.webp" },
      { cls: "ds-sprite-squirtle", src: "theme-images/squirtle.png" },
      { cls: "ds-sprite-triforce", src: "theme-images/triforce.png" },
      { cls: "ds-sprite-zelda", src: "theme-images/zelda.jpg" }
    ];

    const wrapper = document.createElement("div");
    wrapper.className = "ds-theme-sprites";
    wrapper.setAttribute("aria-hidden", "true");

    sprites.forEach(function (sprite) {
      const image = document.createElement("img");
      image.className = "ds-theme-sprite " + sprite.cls;
      image.src = sprite.src;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      wrapper.appendChild(image);
    });

    document.body.appendChild(wrapper);
  }

  function init() {
    injectThemeSprites();
    enableSmoothScrolling();
    styleExerciseParagraphs();
    collapsibleLongSections();
    improveAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
