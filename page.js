const params = new URLSearchParams(window.location.search);
const title = params.get("title")?.trim() || "РодКод";
const heading = document.querySelector("#page-title");

heading.textContent = title;
document.title = `${title} — РодКод`;
