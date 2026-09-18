const sectionMenuButton = document.querySelector("#sectionMenuButton");
const sectionDrawer = document.querySelector("#sectionDrawer");
const sectionDrawerOverlay = document.querySelector("#sectionDrawerOverlay");

function setSectionMenu(open) {
  if (!sectionDrawer || !sectionDrawerOverlay) return;
  sectionDrawer.classList.toggle("is-open", open);
  sectionDrawerOverlay.classList.toggle("is-open", open);
  sectionMenuButton?.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
}

sectionMenuButton?.addEventListener("click", () => setSectionMenu(!sectionDrawer.classList.contains("is-open")));
sectionDrawerOverlay?.addEventListener("click", () => setSectionMenu(false));
sectionDrawer?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setSectionMenu(false)));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setSectionMenu(false);
});
