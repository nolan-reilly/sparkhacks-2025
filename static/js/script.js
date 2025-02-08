document.addEventListener("DOMContentLoaded", function () {
  const spinBtn = document.querySelector("#spin-btn");
  const slider = document.getElementById("slider");
  const images = slider.querySelectorAll("img");
  const totalImages = images.length;

  const stepSize = 200 + 16;

  let currentIndex = 20; // What image we start on image

  // Keep the slider in the correct initial position
  slider.style.transform = `translateX(-${currentIndex * stepSize}px)`;

  const totalSpinTime = 1000; // ms
  const fullRotations = 2;
  const totalSteps = fullRotations * totalImages; // e.g. 3 * 10 = 30 steps

  const minDelay = 50; // ms - spin quickly at the start
  const maxDelay = (2 * totalSpinTime) / totalSteps - minDelay;

  // Precompute the exact delay for each step i:
  // i goes from 0 .. (totalSteps-1)
  // stepDelay(i) = minDelay + (maxDelay - minDelay)*(i / (totalSteps-1))
  // i.e. we linearly interpolate from minDelay to maxDelay across all steps.
  let accumulatedTime = 0; // helps schedule each step

  // Pre-calculate all step times (relative to the spin start)
  const stepTimes = [];
  for (let i = 0; i < totalSteps; i++) {
    const fraction = i / (totalSteps - 1);
    const currentDelay = minDelay + fraction * (maxDelay - minDelay);

    accumulatedTime += currentDelay;
    stepTimes.push(accumulatedTime);
  }
  // Because of rounding, stepTimes[stepTimes.length - 1]
  // should be ~10000. (Some small floating difference is normal.)

  // SPIN HANDLER
  spinBtn.addEventListener("click", function () {
    currentIndex = 0;
    slider.style.transform = `translateX(0px)`;

    stepTimes.forEach((t, i) => {
      setTimeout(() => {
        // Move to the next index
        currentIndex = (currentIndex + 1) % totalImages;
        slider.style.transform = `translateX(-${currentIndex * stepSize}px)`;

        // If it's the very last step, highlight the final item
        if (i === totalSteps - 1) {
          images[currentIndex].style.borderColor = "gold";
          console.log("Ended on the same item we started (index 0).");
        }
      }, t);
    });
  });
});
