const inventoryBtn = document.querySelector("#inventoryBtn");

inventoryBtn.addEventListener("click", () => {
  // Query buttons and containers
  const winContainer = document.getElementById("wonContainer");
  const spinContainer = document.getElementById("spinContainer");
  const companyContainer = document.getElementById("companyContainer");
  const returnHomeBtn = document.getElementById("returnHome");

  // Set initial display states:
  // Hide the win and spin containers; show the companies content.
  winContainer.style.display = "none";
  spinContainer.style.display = "none";
  companyContainer.style.display = "block";

  async function loadPrizes() {
    try {
      const response = await fetch("prizes.json");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const prizeData = await response.json();
      console.log("Loaded prize data:", prizeData); // Debugging step

      const rarityIcons = {
        common: "https://cdn-icons-png.flaticon.com/128/190/190411.png",
        uncommon: "https://cdn-icons-png.flaticon.com/128/3075/3075977.png",
        rare: "https://cdn-icons-png.flaticon.com/128/1600/1600946.png",
        epic: "https://cdn-icons-png.flaticon.com/128/1828/1828970.png",
        legendary: "https://cdn-icons-png.flaticon.com/128/951/951627.png",
      };

      document.querySelectorAll(".company-box").forEach((companyBox) => {
        const companyName = companyBox.querySelector("h2").textContent.trim();

        if (prizeData[companyName]) {
          let iconContainer = document.createElement("div");
          iconContainer.classList.add("icon-container");

          // Add an icon for each prize for that company
          prizeData[companyName].prizes.forEach((prize) => {
            let prizeIcon =
              rarityIcons[prize.rarity] ||
              "https://cdn-icons-png.flaticon.com/128/190/190411.png";
            let icon = document.createElement("img");
            icon.src = prizeIcon;
            icon.alt = prize.rarity;
            icon.classList.add("icon");
            iconContainer.appendChild(icon);
          });

          // Append the icons container to the company box
          companyBox.appendChild(iconContainer);
        } else {
          console.warn(`No prize found for: ${companyName}`);
        }
      });
    } catch (error) {
      console.error("Error loading prizes:", error);
    }
  }

  const companies = [
    {
      name: "The Restaurant",
      description:
        "Local family-owned business, serving for 7 generations. Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      rating: "4/5",
      employees: "6",
      image: "static/images/restaurant.png",
    },
    {
      name: "The Flower Company",
      description:
        "A new business just budding. Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      rating: "5/5",
      employees: "3",
      image: "static/images/flower.png",
    },
    {
      name: "Salon",
      description:
        "Come in and get a fresh cut with your friendly neighborhood barber. Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      rating: "4/5",
      employees: "7",
      image: "static/images/salon.png",
    },
    {
      name: "Coffee Cup",
      description:
        "A classic cup of joe! A cozy place with a rich history. Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      rating: "4.5/5",
      employees: "12",
      image: "static/images/coffee-cup.png",
    },
    {
      name: "Books Galore",
      description:
        "Come expand your mind with our vast collection. Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      rating: "3/5",
      employees: "6",
      image: "static/images/book.png",
    },
  ];

  companies.forEach((company) => {
    const companyBox = document.createElement("div");
    companyBox.classList.add("company-box");

    companyBox.innerHTML = `
      <img src="${company.image}" alt="${company.name}" class="company-image">
      <div class="company-info">
          <h2>${company.name}</h2>
          <p><strong>Description:</strong> ${company.description}</p>
          <p><strong>Rating:</strong> ${company.rating}</p>
          <p><strong>Employees:</strong> ${company.employees}</p>
      </div>
    `;
    companyContainer.appendChild(companyBox);
  });

  loadPrizes();

  if (returnHomeBtn) {
    returnHomeBtn.addEventListener("click", () => {
      companyContainer.innerHTML = "";
      companyContainer.style.display = "none";
      spinContainer.style.display = "block";
      winContainer.style.display = "none";
    });
  }
});
