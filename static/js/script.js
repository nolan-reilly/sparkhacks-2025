const items = [
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
  "https://picsum.photos/200/200",
];

// Extra full cycles (rotations through the entire set) before deceleration.
const extraCycles = 5;

// Fixed target index (0-based) that the spin will always land on.
const fixedIndex = 2; // Always land on the 3rd image

// Animation durations (in milliseconds) for the two phases.
const durationPhase1 = 6350; // Fast spin phase
const durationPhase2 = 1000; // Deceleration phase

// We'll calculate the overshoot (in pixels) later based on an image’s total width.
let overshoot;

const sliderTrack = document.getElementById("sliderTrack");
const crateContainer = document.querySelector("#crate-container");

const openBtn = document.getElementById("openCrate");
const spinContainer = document.querySelector("#spinContainer");
const wonImage = document.querySelector("#wonImage");
const closedCrate = document.querySelector("#closedCrate");
const wonContainer = document.querySelector("#wonContainer");

const scrollSound = new Audio("/static/sfx/scroll.mp3");
scrollSound.volume = 0.25;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Populate the slider track with 3 copies of the items.
// The middle copy is used to allow precise alignment.
function populateTrack() {
  sliderTrack.innerHTML = "";
  for (let copy = 0; copy < 3; copy++) {
    items.forEach((src, i) => {
      const img = document.createElement("img");

      const integer = randomInt(0, 100);

      switch (true) {
        case integer >= 0 && integer <= 50:
          img.classList.add("common-border-bottom");
          break;
        case integer >= 51 && integer <= 70:
          img.classList.add("uncommon-border-bottom");
          break;
        case integer >= 71 && integer <= 85:
          img.classList.add("rare-border-bottom");
          break;
        case integer >= 86 && integer <= 95:
          img.classList.add("epic-border-bottom");
          break;
        case integer >= 96 && integer <= 100:
          img.classList.add("legendary-border-bottom");
          break;
      }

      img.src = src;
      img.alt = `Item ${i + 1}`;

      sliderTrack.appendChild(img);
    });
  }
}
populateTrack();

// Calculate each image's total width (image width + left/right margins).
const firstImg = sliderTrack.querySelector("img");
const computedStyle = window.getComputedStyle(firstImg);
const imgWidth = parseFloat(computedStyle.width);
const marginLeft = parseFloat(computedStyle.marginLeft);
const marginRight = parseFloat(computedStyle.marginRight);
const itemTotalWidth = imgWidth + marginLeft + marginRight;
// Set overshoot to one full item width (adjust as needed)
overshoot = itemTotalWidth;

// Number of items in one copy
const originalCount = items.length;

// The initial transform so that the entire middle copy is in view.
const initialTranslateX = -originalCount * itemTotalWidth;
sliderTrack.style.transform = `translateX(${initialTranslateX}px)`;

// This function starts the full animation when the button is clicked.
function startCrateAnimation() {
  // Display and hide certain containers on start animation
  spinContainer.style.display = "block";
  openBtn.disabled = true;

  scrollSound.play();

  // Reset to the initial position immediately
  sliderTrack.style.transition = "none";
  sliderTrack.style.transform = `translateX(${initialTranslateX}px)`;
  sliderTrack.offsetWidth; // Force reflow to make the reset is applied

  // Calculate some key positions
  const containerWidth = crateContainer.offsetWidth;
  const containerCenter = containerWidth / 2;
  const imageCenterOffset = itemTotalWidth / 2;

  // Centers the target image after spinning extra full cycles
  const finalTranslateX =
    containerCenter -
    ((originalCount + fixedIndex) * itemTotalWidth + imageCenterOffset) -
    extraCycles * originalCount * itemTotalWidth;

  // For phase 1, we want to quickly cover most of the distance.
  // We set an intermediate position a bit short of the final position.
  const intermediateTranslateX = finalTranslateX + overshoot;

  // Start Phase 1 of animation
  sliderTrack.style.transition = `transform ${durationPhase1}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
  sliderTrack.addEventListener("transitionend", phase1EndHandler);
  sliderTrack.style.transform = `translateX(${intermediateTranslateX}px)`;

  // When phase 1 ends, move to phase 2 of the animation
  function phase1EndHandler(e) {
    if (e.propertyName !== "transform") return;
    sliderTrack.removeEventListener("transitionend", phase1EndHandler);
    startPhase2(finalTranslateX);
  }
}

function startPhase2(finalTranslateX) {
  // Ease-out for a smooth slowdown
  sliderTrack.style.transition = `transform ${durationPhase2}ms ease-out`;
  sliderTrack.addEventListener("transitionend", phase2EndHandler);
  sliderTrack.style.transform = `translateX(${finalTranslateX}px)`;

  function phase2EndHandler(e) {
    if (e.propertyName !== "transform") return;
    sliderTrack.removeEventListener("transitionend", phase2EndHandler);

    // Play Fortnite loot box sound after animation finishes
    const finishSound = new Audio("/static/sfx/open.mp3");
    finishSound.volume = 0.25;
    finishSound.play();

    // Display and Redisplay certain containers after animation finish
    spinContainer.style.display = "none";
    wonContainer.style.display = "block";

    openBtn.disabled = false; // Enable button after the animation finishes
  }
}

function returnHomepage() {
  spinContainer.style.display = "block";
  wonContainer.style.display = "none";
}

openBtn.addEventListener("click", startCrateAnimation);
wonContainer.addEventListener("click", returnHomepage);
