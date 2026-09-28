const sectionMenuButton = document.querySelector("#sectionMenuButton");
const sectionDrawer = document.querySelector("#sectionDrawer");
const sectionDrawerClose = document.querySelector("#sectionDrawerClose");
const sectionDrawerOverlay = document.querySelector("#sectionDrawerOverlay");

function setSectionMenu(open) {
  if (!sectionDrawer || !sectionDrawerOverlay) return;
  sectionDrawer.classList.toggle("is-open", open);
  sectionDrawerOverlay.classList.toggle("is-open", open);
  sectionDrawer.setAttribute("aria-hidden", String(!open));
  sectionMenuButton?.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
}

sectionMenuButton?.addEventListener("click", () => setSectionMenu(!sectionDrawer.classList.contains("is-open")));
sectionDrawerClose?.addEventListener("click", () => setSectionMenu(false));
sectionDrawerOverlay?.addEventListener("click", () => setSectionMenu(false));
sectionDrawer?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setSectionMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setSectionMenu(false);
});
