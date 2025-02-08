document.addEventListener("DOMContentLoaded", function () {
  const spinBtn = document.querySelector("#spin-btn");
  const slider = document.getElementById("slider");
  const images = slider.querySelectorAll("img");
  const totalImages = images.length;
  const imageWidth = 200;

  let currentIndex = 50; // Variable to select start
  slider.style.transform = `translateX(-${currentIndex * imageWidth}px)`;

  spinBtn.addEventListener("click", function () {
    // We want to spin through all 100 images twice => 200 steps
    const totalSpins = totalImages * 2;
    let spinCount = 0;

    let speed = 50;

    // Gradually increase this to slow down (e.g. +10ms each step)
    const speedIncrement = 10;

    function spin() {
      if (spinCount < totalSpins) {
        spinCount++;

        // Move to the next image (wrap around with modulo)
        currentIndex = (currentIndex + 1) % totalImages;

        // Apply transform to show the current image in the viewport
        slider.style.transform = `translateX(-${currentIndex * imageWidth}px)`;

        // Increase the delay slightly so the animation slows each step
        speed += speedIncrement;

        // Schedule the next frame of the spin
        setTimeout(spin, speed);
      }
    }

    // Start spinning
    spin();
  });
});
