(function () {
  "use strict";

  document.documentElement.classList.add("can-reveal");

  var nav = document.getElementById("siteNav");
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("primaryNav");
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".js-scroll-trigger[href^='#']")
  );
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var sectionLinks = links.filter(function (link) {
    return link.classList.contains("nav-link");
  });
  var navSections = sectionLinks
    .map(function (link) {
      var section = document.querySelector(link.getAttribute("href"));

      return section
        ? {
            id: section.id,
            section: section,
          }
        : null;
    })
    .filter(Boolean);

  function updateNavShadow() {
    if (!nav) {
      return;
    }

    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  function setActiveSection(sectionId) {
    sectionLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + sectionId);
    });
  }

  function updateActiveSection() {
    if (!navSections.length) {
      return;
    }

    var navOffset = nav ? nav.offsetHeight : 0;
    var activationLine = navOffset + window.innerHeight * 0.52;
    var activeSection = navSections[0];

    navSections.forEach(function (item) {
      var rect = item.section.getBoundingClientRect();

      if (rect.top <= activationLine && rect.bottom > navOffset) {
        activeSection = item;
      }
    });

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      activeSection = navSections[navSections.length - 1];
    }

    setActiveSection(activeSection.id);
  }

  function closeMenu() {
    if (!menu || !toggle) {
      return;
    }

    menu.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("show");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  window.addEventListener(
    "scroll",
    function () {
      updateNavShadow();
      updateActiveSection();
    },
    { passive: true }
  );
  window.addEventListener("resize", updateActiveSection);
  updateNavShadow();
  updateActiveSection();

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var target = document.querySelector(link.getAttribute("href"));

      if (!target) {
        return;
      }

      event.preventDefault();
      closeMenu();
      setActiveSection(target.id);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", link.getAttribute("href"));
    });
  });

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }
})();
