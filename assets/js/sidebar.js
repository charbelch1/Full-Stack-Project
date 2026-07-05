class SidebarMenu {
  constructor(toggleButton, sidebar, overlay) {
    this.toggleButton = toggleButton;
    this.sidebar = sidebar;
    this.overlay = overlay;
    this.links = this.sidebar.querySelectorAll(".sidebar-link");
    this.isOpen = false;

    this.handleToggle = this.handleToggle.bind(this);
    this.close = this.close.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    this.init();
  }

  init() {
    this.toggleButton.addEventListener("click", this.handleToggle);
    this.overlay.addEventListener("click", this.close);
    this.links.forEach((link) => {
      link.addEventListener("click", this.handleLinkClick);
    });
    document.addEventListener("keydown", this.handleKeydown);
  }

  handleToggle() {
    if (this.isOpen) {
      this.close();
      return;
    }

    this.open();
  }

  open() {
    this.isOpen = true;
    this.sidebar.classList.add("is-open");
    this.overlay.classList.add("is-visible");
    this.toggleButton.setAttribute("aria-expanded", "true");
  }

  close() {
    this.isOpen = false;
    this.sidebar.classList.remove("is-open");
    this.overlay.classList.remove("is-visible");
    this.toggleButton.setAttribute("aria-expanded", "false");
  }

  handleLinkClick() {
    if (window.matchMedia("(max-width: 991.98px)").matches) {
      this.close();
    }
  }

  handleKeydown(event) {
    if (event.key === "Escape" && this.isOpen) {
      this.close();
      this.toggleButton.focus();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.querySelector("[data-sidebar-toggle]");
  const sidebar = document.querySelector("[data-sidebar]");
  const overlay = document.querySelector("[data-sidebar-overlay]");

  if (toggleButton && sidebar && overlay) {
    // Charbel Chehade's custom requirement: a responsive sidebar menu that collapses on smaller screens.
    new SidebarMenu(toggleButton, sidebar, overlay);
  }
});
