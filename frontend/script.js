document.addEventListener("DOMContentLoaded", () => {
    // ---------------- Elements ----------------
    const overlay = document.getElementById("login-overlay");
    const loginBtn = document.getElementById("login-btn");
    const loginEmailInput = document.getElementById("login-email");
    const coinsFloat = document.querySelectorAll(".coin-float");
    const addCoinBtn = document.getElementById("add-coin-btn");
    const addCoinDropdown = document.getElementById("add-coin-dropdown");
    const coinList = document.querySelector(".coin-list");
    const particlesWrapper = document.getElementById("particles-wrapper");
    const changeEmailBtn = document.getElementById("change-email-btn");
    const logoutBtn = document.getElementById("logout-btn");

    // Automatically switch between local backend and deployed backend
const BACKEND_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000"  // local backend
    : "https://your-backend-on-render.onrender.com"; // replace with your Render URL


    // ---------------- Toast popup ----------------
    function showToast(message, duration = 5000) {
        const container = document.getElementById("toast-container") || (() => {
            const c = document.createElement("div");
            c.id = "toast-container";
            document.body.appendChild(c);
            return c;
        })();

        const toast = document.createElement("div");
        toast.classList.add("toast");
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => toast.classList.add("show"), 10);
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => container.removeChild(toast), 500);
        }, duration);
    }

    // ---------------- Overlay ----------------
    function showOverlay() { overlay.style.display = "flex"; }
    function hideOverlay() { overlay.style.display = "none"; }

    // ---------------- Data ----------------
    let alerts = {};
    let coinSockets = {};
    let emailAlertShown = false;
    let firedAlerts = {}; // Track alerts already fired to prevent duplicates

    let coins = {
        bitcoin: { el: document.getElementById("bitcoin-card"), symbol: "btcusdt", decimals: 2 },
        ethereum: { el: document.getElementById("ethereum-card"), symbol: "ethusdt", decimals: 2 },
        dogecoin: { el: document.getElementById("dogecoin-card"), symbol: "dogeusdt", decimals: 6 },
        ripple: { el: document.getElementById("ripple-card"), symbol: "xrpusdt", decimals: 4 },
        litecoin: { el: document.getElementById("litecoin-card"), symbol: "ltcusdt", decimals: 2 }
    };

    const newCoins = {
        algorand:  { symbol: "algousdt",  decimals: 6, img: "algorand.png" },
        avalanche: { symbol: "avaxusdt",  decimals: 3, img: "avalanche.png" },
        bnb:       { symbol: "bnbusdt",   decimals: 2, img: "bnb.png" },
        cardano:   { symbol: "adausdt",   decimals: 4, img: "cardano.png" },
        chainlink: { symbol: "linkusdt",  decimals: 4, img: "chainlink.png" },
        cosmos:    { symbol: "atomusdt",  decimals: 4, img: "cosmos.png" },
        filecoin:  { symbol: "filusdt",   decimals: 4, img: "filecoin.png" },
        polkadot:  { symbol: "dotusdt",   decimals: 4, img: "polkadot.png" },
        solana:    { symbol: "solusdt",   decimals: 4, img: "solana.png" },
        tron:      { symbol: "trxusdt",   decimals: 6, img: "tron.png" },
        uniswap:   { symbol: "uniusdt",   decimals: 4, img: "uniswap.png" },
        vechain:   { symbol: "vetusdt",   decimals: 4, img: "vechain.png" }
    };

    // ---------------- Email Validation ----------------
    function isValidEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }

    // ---------------- Overlay & Login ----------------
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail && isValidEmail(savedEmail)) {
        window.userEmail = savedEmail;
        hideOverlay();
    } else {
        showOverlay();
    }

    loginBtn.addEventListener("click", () => {
        const email = loginEmailInput.value.trim();
        if (!email || !isValidEmail(email)) return showToast("Please enter a valid email address");

        localStorage.setItem("userEmail", email);
        window.userEmail = email;
        hideOverlay();
        emailAlertShown = false;
        showToast(`Notifications will be sent to ${email}`);
    });

    if (changeEmailBtn) {
        changeEmailBtn.addEventListener("click", () => {
            localStorage.removeItem("userEmail");
            window.userEmail = null;
            showOverlay();
            showToast("Your email has been cleared. Please login again.");
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("userEmail");
            window.userEmail = null;
            showToast("You have been logged out.");
        });
    }

    // ---------------- Settings Dropdown ----------------
    const settingsIcon = document.querySelector('.settings img');
    const settingsDropdown = document.getElementById('settings-dropdown');

    settingsIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsDropdown.style.display =
            (settingsDropdown.style.display === 'block') ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
        if (!settingsIcon.contains(e.target) && !settingsDropdown.contains(e.target)) {
            settingsDropdown.style.display = 'none';
        }
    });

    // ---------------- Floating Coins ----------------
    function animateFloatingCoins() {
        coinsFloat.forEach(coin => {
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight;
            coin.style.left = `${startX}px`;
            coin.style.top = `${startY}px`;

            const moveX = (Math.random() - 0.5) * 400;
            const moveY = (Math.random() - 0.5) * 400;
            const duration = 8 + Math.random() * 12;

            coin.animate([
                { transform: `translate(0px,0px) rotate(0deg)`, opacity: 0 },
                { transform: `translate(${moveX}px, ${moveY}px) rotate(${Math.random() * 360}deg)`, opacity: 1 },
                { transform: `translate(${moveX * 2}px, ${moveY * 2}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], { duration: duration * 1000, iterations: Infinity, easing: 'linear' });
        });
    }
    animateFloatingCoins();

    // ---------------- Floating Particles ----------------
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        const duration = Math.random() * 10 + 5;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particlesWrapper.appendChild(particle);
    }

    // ---------------- Alerts ----------------
    function attachCoinFunctions(coinCard, coinId) {
        let btn = coinCard.querySelector(".alert-btn");
        const input = coinCard.querySelector(".alert-input");

        // Replace button to clear old listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        btn = newBtn;

        // --- Alert setting ---
        btn.addEventListener("click", () => {
            const target = parseFloat(input.value);
            if (isNaN(target)) return showToast("Enter a valid number");

            alerts[coinId] = target;
            firedAlerts[coinId] = false; // reset fired flag
            showToast(`Alert set for ${coinId} at $${target}`);

            // Immediate check if price already above target
            const priceEl = coinCard.querySelector(`#${coinId}`);
            if (priceEl) {
                const currentPrice = parseFloat(priceEl.textContent.replace('$',''));
                if (!isNaN(currentPrice) && currentPrice >= target) {
                    triggerCoinAlert(coinId, currentPrice, target);
                }
            }
        });

        // --- Remove button logic ---
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove-btn");
        removeBtn.style.cssText =
            "margin-top:8px;background:#f44336;color:#fff;border:none;padding:4px 10px;border-radius:8px;cursor:pointer;font-size:12px;";
        coinCard.querySelector("div").appendChild(removeBtn);

        removeBtn.addEventListener("click", () => {
            if (coinSockets[coinId]) coinSockets[coinId].close();
            delete coinSockets[coinId];
            coinCard.remove();
            delete coins[coinId];
            delete alerts[coinId];
            delete firedAlerts[coinId];
        });
    }

    Object.keys(coins).forEach(key => attachCoinFunctions(coins[key].el, key));

    // ---------------- WebSocket ----------------
    function triggerCoinAlert(coinId, priceNum, target) {
        if (firedAlerts[coinId]) return; // prevent double firing
        firedAlerts[coinId] = true;
        delete alerts[coinId]; // remove immediately

        if (window.userEmail) {
   fetch(`${BACKEND_URL}/send-alert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        coin: coinId,
        currentPrice: priceNum,
        targetPrice: target,
        userEmail: window.userEmail
    })
})
.catch(err => console.error(err));


            showToast(`${coinId} reached $${priceNum}! Email sent to ${window.userEmail}`);
        } else {
            showToast(`${coinId} reached $${priceNum}! \n Set your email in the overlay to receive alerts.`);
            emailAlertShown = true;
        }
    }

    function connectCoinWS(coinId) {
        const coin = coins[coinId];
        if (!coin) return;

        if (coinSockets[coinId] && coinSockets[coinId].readyState === WebSocket.OPEN) return;

        const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${coin.symbol}@ticker`);
        coinSockets[coinId] = ws;

        ws.onmessage = event => {
            const data = JSON.parse(event.data);
            const priceNum = parseFloat(data.c).toFixed(coin.decimals);
            const priceEl = coin.el.querySelector(`#${coinId}`);
            priceEl.textContent = `$${priceNum}`;

            if (alerts[coinId] !== undefined && priceNum >= alerts[coinId]) {
                triggerCoinAlert(coinId, priceNum, alerts[coinId]);
            }
        };
    }

    Object.keys(coins).forEach(key => connectCoinWS(key));

    // ---------------- Add Coin Dropdown ----------------
    function updateAddCoinDropdown() {
        addCoinDropdown.innerHTML = "";
        const availableCoins = Object.keys(newCoins).filter(c => !coins[c]);

        if (!availableCoins.length) {
            addCoinDropdown.innerHTML = `<p style="padding:10px; color:#ff960b;">No more coins!</p>`;
            return;
        }

        availableCoins.forEach(coinKey => {
            const option = document.createElement("div");
            option.classList.add("dropdown-item");
            option.innerHTML =
                `<img src="/images/${newCoins[coinKey].img}" alt="${coinKey}" style="width:25px;height:25px;margin-right:8px;"><span>${coinKey.charAt(0).toUpperCase()+coinKey.slice(1)}</span>`;
            addCoinDropdown.appendChild(option);

            option.addEventListener("click", () => {
                addCoinDropdown.parentElement.classList.remove("show");

                const coinCard = document.createElement("div");
                coinCard.classList.add("coin");
                coinCard.id = coinKey + "-card";
                coinCard.innerHTML = `
                    <img src="/images/${newCoins[coinKey].img}">
                    <div>
                        <h3 id="${coinKey}">$0</h3>
                        <p>${coinKey.charAt(0).toUpperCase() + coinKey.slice(1)}</p>
                        <input type="number" class="alert-input" placeholder="Target Price" />
                        <button class="alert-btn">Set Alert</button>
                        <p class="change"></p>
                    </div>
                `;
                coinList.appendChild(coinCard);

                coins[coinKey] = {
                    el: coinCard,
                    symbol: newCoins[coinKey].symbol,
                    decimals: newCoins[coinKey].decimals
                };
                attachCoinFunctions(coinCard, coinKey);
                connectCoinWS(coinKey);
                updateAddCoinDropdown();
            });
        });
    }

    addCoinBtn.addEventListener("click", e => {
        e.stopPropagation();
        addCoinDropdown.parentElement.classList.toggle("show");
        updateAddCoinDropdown();
    });

    window.addEventListener("click", e => {
        if (!addCoinDropdown.parentElement.contains(e.target)) {
            addCoinDropdown.parentElement.classList.remove("show");
        }
    });
});