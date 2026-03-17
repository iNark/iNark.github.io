const scenes = document.querySelectorAll(".scene");
const bgAudio = document.getElementById("bg-audio");

function startBackgroundAudio() {
  if (!bgAudio) return;

  bgAudio.volume = 0.10;

  const playPromise = bgAudio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      const resumeAudio = () => {
        bgAudio.play().catch(() => {});
        window.removeEventListener("click", resumeAudio);
        window.removeEventListener("keydown", resumeAudio);
        window.removeEventListener("touchstart", resumeAudio);
      };

      window.addEventListener("click", resumeAudio, { once: true });
      window.addEventListener("keydown", resumeAudio, { once: true });
      window.addEventListener("touchstart", resumeAudio, { once: true });
    });
  }
}

function onScroll() {
  const viewportHeight = window.innerHeight;

  scenes.forEach((scene) => {
    const image = scene.querySelector(".hero-image");
    const overlay = scene.querySelector(".overlay");
    if (!image || !overlay) return;

    const rect = scene.getBoundingClientRect();

    // 0 when scene starts entering viewport, 1 after one viewport scroll.
    const rawProgress = -rect.top / viewportHeight;
    const progress = Math.min(Math.max(rawProgress, 0), 1);

    const blur = progress * 12;
    const imageOpacity = 1 - progress * 0.65;

    image.style.filter = `blur(${blur}px)`;
    image.style.opacity = String(imageOpacity);

    overlay.style.opacity = String(progress);
    overlay.style.transform = `translateY(${20 - progress * 20}px)`;
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();
startBackgroundAudio();
