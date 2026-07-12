export function initHamburger() {
  const nav = document.querySelector("nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const links = nav.querySelector(".links");

  if (!nav || !menuToggle || !links) return;

  // Accessibility setup
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-controls", "main-menu");
  menuToggle.setAttribute("aria-haspopup", "true");
  menuToggle.setAttribute("aria-label", "Toggle navigation menu");

  // Toggle main menu open/close
  menuToggle.addEventListener("click", () => {
    const isActive = nav.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isActive);
  });

  // Close menu when a non-dropdown link is clicked
  const plainLinks = links.querySelectorAll("a:not(.dropdown > a)");
  plainLinks.forEach(link => {
    link.setAttribute("role", "menuitem");
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Handle dropdowns on mobile (click-to-toggle)
  const dropdownTriggers = links.querySelectorAll(".dropdown > a");
  dropdownTriggers.forEach(trigger => {
    trigger.setAttribute("aria-haspopup", "true");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("role", "menuitem");

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const parent = trigger.parentElement;
      const isOpen = parent.classList.toggle("open");
      trigger.setAttribute("aria-expanded", isOpen);
    });
  });
}

// Initialize immediately
initHamburger();