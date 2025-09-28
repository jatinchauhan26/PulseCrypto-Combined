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

    // ---------------- Data ----------------
    let alerts = {};
    let coinSockets = {};

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

    // ---------------- Overlay Login ----------------
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
        window.userEmail = savedEmail;
        overlay.style.display = "none";
    } else {
        overlay.style.display = "block";
    }

    loginBtn.addEventListener("click", () => {
        const email = loginEmailInput.value.trim();
        if (!email) return alert("Please enter a valid email");

        localStorage.setItem("userEmail", email);
        window.userEmail = email;
        overlay.style.display = "none";
        alert(`Notifications will be sent to ${email}`);
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

    // ---------------- Alerts & Remove ----------------
    function attachCoinFunctions(coinCard, coinId) {
        const btn = coinCard.querySelector(".alert-btn");
        const input = coinCard.querySelector(".alert-input");

        btn.addEventListener("click", () => {
            const target = parseFloat(input.value);
            if (isNaN(target)) return alert("Enter a valid number");
            alerts[coinId] = target;
            alert(`Alert set for ${coinId} at $${target}`);
        });

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove-btn");
        removeBtn.style.cssText = "margin-top:8px;background:#f44336;color:#fff;border:none;padding:4px 10px;border-radius:8px;cursor:pointer;font-size:12px;";
        coinCard.querySelector("div").appendChild(removeBtn);

        removeBtn.addEventListener("click", () => {
            if (coinSockets[coinId]) coinSockets[coinId].close();
            delete coinSockets[coinId];
            coinCard.remove();
            delete coins[coinId];
            delete alerts[coinId];
        });
    }

    Object.keys(coins).forEach(key => attachCoinFunctions(coins[key].el, key));

    // ---------------- WebSocket ----------------
    function connectCoinWS(coinId) {
        const coin = coins[coinId];
        if (!coin) return;
        if (coinSockets[coinId]) coinSockets[coinId].close();

        const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${coin.symbol}@ticker`);
        coinSockets[coinId] = ws;

        ws.onmessage = event => {
            const data = JSON.parse(event.data);
            const price = parseFloat(data.c).toFixed(coin.decimals);
            const change = parseFloat(data.P).toFixed(2);

            const priceEl = coin.el.querySelector(`#${coinId}`);
            const changeEl = coin.el.querySelector(".change");

            priceEl.textContent = `$${price}`;
            changeEl.textContent = `(${change}%)`;
            changeEl.style.color = change >= 0 ? "#4caf50" : "#f44336";

            if (alerts[coinId] !== undefined && parseFloat(price) >= alerts[coinId]) {
                if (!window.userEmail) return alert("Set your email in the overlay to receive alerts!");
                fetch("http://localhost:3000/send-alert", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        coin: coinId,
                        currentPrice: price,
                        targetPrice: alerts[coinId],
                        userEmail: window.userEmail
                    })
                }).then(res => res.json()).catch(err => console.error(err));
                alert(`${coinId} reached $${price}! Email sent to ${window.userEmail}`);
                delete alerts[coinId];
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
            option.innerHTML = `<img src="/images/${newCoins[coinKey].img}" alt="${coinKey}" style="width:25px;height:25px;margin-right:8px;"><span>${coinKey.charAt(0).toUpperCase()+coinKey.slice(1)}</span>`;
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

                coins[coinKey] = { el: coinCard, symbol: newCoins[coinKey].symbol, decimals: newCoins[coinKey].decimals };
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
