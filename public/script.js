document.addEventListener("DOMContentLoaded", () => {
  let progress = 50;
  let startX = 0;
  let active = 0;
  let isDown = false;

  const speedWheel = 0.02;
  const speedDrag = -0.1;
  let $items = [];

  /*--------------------
  Get Z-Index & Blur
  --------------------*/
  const getZindex = (array, index) =>
    array.map((_, i) => (index === i ? array.length : array.length - Math.abs(index - i)));

  const getBlur = (index, active, total) => {
    let distance = Math.abs(index - active);
    return Math.min(distance * 3, 10); // Blur increases with distance, max 10px
  };

  /*--------------------
  Animate Function
  --------------------*/
  const animate = () => {
    if (!$items.length) return; // Prevent errors if items are empty

    progress = Math.max(0, Math.min(progress, 100));
    active = Math.floor((progress / 100) * ($items.length - 1));

    $items.forEach((item, index) => {
      const zIndex = getZindex([...$items], active)[index];
      const blurAmount = getBlur(index, active, $items.length);

      item.style.setProperty("--zIndex", zIndex);
      item.style.setProperty("--active", (index - active) / $items.length);
      item.style.setProperty("--blur", `${blurAmount}px`);
    });
  };

  /*--------------------
  Rebind Event Listeners
  --------------------*/
  const rebindEventListeners = () => {
    $items = document.querySelectorAll(".carousel-item");
    $items.forEach((item, i) => {
      item.addEventListener("click", () => {
        progress = (i / $items.length) * 100 + 10;
        animate();
      });
    });
    animate(); // Ensure animation runs
  };

  /*--------------------
  Fetch & Load Dynamic Images
  --------------------*/
  fetch("/api/images")
    .then((response) => response.json())
    .then((data) => {
      console.log("Received Data:", data);
      const carousel = document.querySelector(".carousel");
      carousel.innerHTML = ""; // Clear existing items

      data.forEach((item, index) => {
        console.log("Image URL:", item.image_url);
        const div = document.createElement("div");
        div.classList.add("carousel-item");

        div.innerHTML = `
          <div class="carousel-box">
            <div class="title">${item.title}</div>
            <div class="num">${String(index + 1).padStart(2, "0")}</div>
            <img src="${item.image_url}" alt="${item.title}" onerror="this.src='fallback.jpg'">
          </div>
        `;

        carousel.appendChild(div);
      });

      rebindEventListeners(); // Rebind click & animation after images are loaded
    })
    .catch((error) => console.error("Error loading images:", error));

  /*--------------------
  Interaction Handlers
  --------------------*/
  const handleWheel = (e) => {
    progress += e.deltaY * speedWheel;
    animate();
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    const x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    progress += (x - startX) * speedDrag;
    startX = x;
    animate();
  };

  const handleMouseDown = (e) => {
    isDown = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  };

  const handleMouseUp = () => {
    isDown = false;
  };

  /*--------------------
  Event Listeners
  --------------------*/
  document.addEventListener("wheel", handleWheel);
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("touchstart", handleMouseDown);
  document.addEventListener("touchmove", handleMouseMove);
  document.addEventListener("touchend", handleMouseUp);
});
