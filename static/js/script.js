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

/***********************
 * SETUP THE SLIDER TRACK
 ***********************/
const sliderTrack = document.getElementById("sliderTrack");
const openBtn = document.getElementById("openCrate");
const crateContainer = document.querySelector("#crate-container");
const wonImage = document.querySelector("#wonImage");

const scrollSound = new Audio("/static/sfx/scroll.mp3");
scrollSound.volume = 0.25;

// Populate the slider track with 3 copies of the items.
// The middle copy is used to allow precise alignment.
function populateTrack() {
  sliderTrack.innerHTML = "";
  for (let copy = 0; copy < 3; copy++) {
    items.forEach((src, i) => {
      const img = document.createElement("img");
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

/***********************
 * ANIMATION: TWO-PHASE SPIN
 ***********************/
// This function starts the full animation when the button is clicked.
function startCrateAnimation() {
  crateContainer.style.display = "block";
  wonImage.style.display = "none";
  openBtn.disabled = true;

  scrollSound.play();

  // Reset to initial position immediately.
  sliderTrack.style.transition = "none";
  sliderTrack.style.transform = `translateX(${initialTranslateX}px)`;
  // Force reflow to ensure the reset is applied.
  sliderTrack.offsetWidth;

  // Calculate key positions:
  const containerWidth = crateContainer.offsetWidth;
  const containerCenter = containerWidth / 2;
  const imageCenterOffset = itemTotalWidth / 2;

  // finalTranslateX: the position that centers the target image (from the middle copy)
  // after spinning extra full cycles.
  const finalTranslateX =
    containerCenter -
    ((originalCount + fixedIndex) * itemTotalWidth + imageCenterOffset) -
    extraCycles * originalCount * itemTotalWidth;

  // For phase 1, we want to quickly cover most of the distance.
  // We set an intermediate position a bit short of the final position.
  // (Because the track moves to the left, "short of" means less negative.)
  const intermediateTranslateX = finalTranslateX + overshoot;

  // Start Phase 1: fast spin.
  sliderTrack.style.transition = `transform ${durationPhase1}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
  sliderTrack.addEventListener("transitionend", phase1EndHandler);
  sliderTrack.style.transform = `translateX(${intermediateTranslateX}px)`;

  // When phase 1 ends, move to phase 2.
  function phase1EndHandler(e) {
    if (e.propertyName !== "transform") return;
    sliderTrack.removeEventListener("transitionend", phase1EndHandler);
    startPhase2(finalTranslateX);
  }
}

// Phase 2: deceleration that lands exactly on the target.
function startPhase2(finalTranslateX) {
  // Use an ease-out for a smooth slowdown.
  sliderTrack.style.transition = `transform ${durationPhase2}ms ease-out`;
  sliderTrack.addEventListener("transitionend", phase2EndHandler);
  sliderTrack.style.transform = `translateX(${finalTranslateX}px)`;

  function phase2EndHandler(e) {
    if (e.propertyName !== "transform") return;
    sliderTrack.removeEventListener("transitionend", phase2EndHandler);

    // Play the sound here
    const finishSound = new Audio("/static/sfx/open.mp3");
    finishSound.volume = 0.25;
    finishSound.play();

    crateContainer.style.display = "none";
    wonImage.style.display = "block";

    // Re-enable the button after the animation finishes
    openBtn.disabled = false;
  }
}

openBtn.addEventListener("click", startCrateAnimation);
