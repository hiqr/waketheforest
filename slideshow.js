const slides = Array.from(document.querySelectorAll(".tree-event-slide"));
const counter = document.querySelector(".event-slide-count");
const controls = document.querySelectorAll("[data-slide-direction]");
let currentSlide = 0;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.hidden = slideIndex !== currentSlide;
    slide.setAttribute("aria-label", `${slideIndex + 1} of ${slides.length}`);
  });
  counter.textContent = `${currentSlide + 1} / ${slides.length}`;
}

controls.forEach((button) => {
  button.addEventListener("click", () => {
    showSlide(currentSlide + Number(button.dataset.slideDirection));
  });
});

showSlide(currentSlide);
