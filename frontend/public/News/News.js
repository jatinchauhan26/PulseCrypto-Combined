document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("news-carousel");
  const leftBtn = document.querySelector(".carousel-btn.left");
  const rightBtn = document.querySelector(".carousel-btn.right");

  // ---------------- BACKEND URL ----------------
  const BACKEND_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000" // local backend
      : "https://pulsecrypto-backend.onrender.com/"; // deployed backend

  // ---------------- Floating Particles ----------------
  const particlesWrapper = document.getElementById("particles");
  for (let i = 0; i < 80; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    const duration = Math.random() * 15 + 5;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    particlesWrapper.appendChild(particle);
  }

  // ---------------- Coin Tag Map ----------------
  const coinMap = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    XRP: "Ripple",
    LTC: "Litecoin",
    DOGE: "Dogecoin",
    Bitcoin: "Bitcoin",
    Ethereum: "Ethereum",
    Ripple: "Ripple",
    Litecoin: "Litecoin",
    Dogecoin: "Dogecoin",
  };

  // ---------------- Fetch News ----------------
  async function fetchNews() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/news`);
      const data = await res.json();
      renderNews(data);
    } catch (err) {
      carousel.innerHTML =
        '<p class="news-loading">⚠️ Failed to load news. Try again later.</p>';
      console.error(err);
    }
  }

  // ---------------- Render News ----------------
  function renderNews(newsArray) {
    carousel.innerHTML = "";
    newsArray.forEach((news) => {
      const item = document.createElement("div");
      item.classList.add("news-item");

      // Detect coin from title
      const coinMatch = news.title.match(
        /Bitcoin|Ethereum|ETH|BTC|Ripple|XRP|Litecoin|LTC|Dogecoin|DOGE/i
      );
      const coinTag = coinMatch
        ? coinMap[coinMatch[0].toUpperCase()] || coinMatch[0]
        : "General";

      item.innerHTML = `
        <div class="news-tag">${coinTag} | ${news.source}</div>
        <h3>${news.title}</h3>
        <p>${news.contentSnippet ? news.contentSnippet.substring(0, 350) : ""}</p>
        <a href="${news.url}" target="_blank" class="read-more">Read More &#8594;</a>
      `;
      carousel.appendChild(item);
    });
  }

  // ---------------- Carousel Buttons ----------------
  leftBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: -carousel.offsetWidth, behavior: "smooth" });
  });
  rightBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: carousel.offsetWidth, behavior: "smooth" });
  });

  // ---------------- Auto Slide ----------------
  let autoSlide = setInterval(() => {
    carousel.scrollBy({ left: carousel.offsetWidth, behavior: "smooth" });
  }, 8000);

  carousel.addEventListener("mouseenter", () => clearInterval(autoSlide));
  carousel.addEventListener("mouseleave", () => {
    autoSlide = setInterval(() => {
      carousel.scrollBy({ left: carousel.offsetWidth, behavior: "smooth" });
    }, 8000);
  });

  // ---------------- Initial Fetch & Auto Refresh ----------------
  fetchNews(); // initial load
  setInterval(fetchNews, 5 * 60 * 1000); // refresh every 5 minutes
});
