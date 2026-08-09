(() => {
  const crops = document.querySelectorAll(".visual-crop");

  for (const crop of crops) {
    const source = crop.querySelector(".visual-crop__source");
    const hotspots = [...crop.querySelectorAll(".hotspot")];

    for (const [index, hotspot] of hotspots.entries()) {
      const visual = new Image();
      visual.className = "hotspot__visual";
      visual.src = source.currentSrc || source.src;
      visual.alt = "";
      visual.draggable = false;
      visual.setAttribute("aria-hidden", "true");
      hotspot.append(visual);
      hotspot.style.setProperty("--piece-index", index);

      hotspot.addEventListener("pointermove", (event) => {
        const rect = hotspot.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        hotspot.style.setProperty("--shine-x", `${x * 100}%`);
        hotspot.style.setProperty("--shine-y", `${y * 100}%`);
        hotspot.style.setProperty("--tilt-x", `${(0.5 - y) * 2.2}deg`);
        hotspot.style.setProperty("--tilt-y", `${(x - 0.5) * 2.2}deg`);
      });

      hotspot.addEventListener("pointerleave", () => {
        hotspot.style.removeProperty("--shine-x");
        hotspot.style.removeProperty("--shine-y");
        hotspot.style.removeProperty("--tilt-x");
        hotspot.style.removeProperty("--tilt-y");
      });
    }

    let frame = 0;

    const syncPieces = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!source.complete || source.naturalWidth === 0) return;

        const sourceRect = source.getBoundingClientRect();

        for (const hotspot of hotspots) {
          const visual = hotspot.querySelector(".hotspot__visual");
          const hotspotRect = hotspot.getBoundingClientRect();

          visual.style.left = `${sourceRect.left - hotspotRect.left}px`;
          visual.style.top = `${sourceRect.top - hotspotRect.top}px`;
          visual.style.width = `${sourceRect.width}px`;
          visual.style.height = `${sourceRect.height}px`;
          hotspot.classList.add("is-ready");
        }
      });
    };

    source.addEventListener("load", syncPieces);
    window.addEventListener("resize", syncPieces, { passive: true });

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(syncPieces);
      observer.observe(crop);
    }

    syncPieces();
  }
})();
