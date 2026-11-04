const slides = Array.from(document.querySelectorAll(".tree-event-slide"));
const controls = document.querySelectorAll("[data-slide-direction]");
const slideshow = document.querySelector(".event-slideshow");
const slideContainer = document.querySelector(".event-slides");
const dotsContainer = document.querySelector(".event-slide-dots");
const dots = slides.map((slide, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "event-slide-dot";
  dot.setAttribute("aria-label", `Show slide ${index + 1}: ${slide.querySelector("h3").textContent}`);
  dot.addEventListener("click", () => {
    showSlide(index, index >= currentSlide ? "next" : "previous");
    restartAutoplay();
  });
  dotsContainer.append(dot);
  return dot;
});
let currentSlide = 0;
let autoplayTimer;

function showSlide(index, direction, animate = true) {
  const nextSlide = (index + slides.length) % slides.length;
  if (nextSlide === currentSlide && animate) {
    return;
  }
  direction = direction || (nextSlide >= currentSlide ? "next" : "previous");
  currentSlide = nextSlide;
  slides.forEach((slide, slideIndex) => {
    slide.hidden = slideIndex !== currentSlide;
    slide.setAttribute("aria-label", `${slideIndex + 1} of ${slides.length}`);
    dots[slideIndex].setAttribute("aria-current", String(slideIndex === currentSlide));
  });
  if (animate) {
    const activeSlide = slides[currentSlide];
    activeSlide.classList.remove("slide-enter-next", "slide-enter-previous");
    void activeSlide.offsetWidth;
    activeSlide.classList.add(`slide-enter-${direction}`);
  }
}

function stopAutoplay() {
  window.clearInterval(autoplayTimer);
  slideContainer.setAttribute("aria-live", "polite");
}

function startAutoplay() {
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || slideshow.matches(":hover")
    || slideshow.contains(document.activeElement)
    || document.hidden
  ) {
    return;
  }
  window.clearInterval(autoplayTimer);
  slideContainer.setAttribute("aria-live", "off");
  autoplayTimer = window.setInterval(() => showSlide(currentSlide + 1, "next"), 5000);
}

function restartAutoplay() {
  stopAutoplay();
  startAutoplay();
}

controls.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = Number(button.dataset.slideDirection) > 0 ? "next" : "previous";
    showSlide(currentSlide + Number(button.dataset.slideDirection), direction);
    restartAutoplay();
  });
});

slideshow.addEventListener("mouseenter", stopAutoplay);
slideshow.addEventListener("mouseleave", startAutoplay);
slideshow.addEventListener("focusin", stopAutoplay);
slideshow.addEventListener("focusout", (event) => {
  if (!slideshow.contains(event.relatedTarget)) {
    startAutoplay();
  }
});
document.addEventListener("visibilitychange", startAutoplay);

showSlide(currentSlide, "next", false);
startAutoplay();
