console.log("✅ Features.js loaded");

// ---------------- DOM Ready ----------------
document.addEventListener("DOMContentLoaded", () => {

    // ---------------- Elements ----------------
    const addBtn = document.getElementById("add-coin-btn");
    const dropdown = document.getElementById("add-coin-dropdown");
    const coinCards = document.getElementById("coin-cards");
    const portfolioList = document.getElementById("portfolio-list");
    const totalDisplay = document.getElementById("portfolio-total");
    const container = document.getElementById("particles");

    // ---------------- Floating Particles ----------------
    if (container) {
        for (let i = 0; i < 40; i++) {
            const p = document.createElement("div");
            p.classList.add("particle");
            p.style.top = Math.random() * 100 + "vh";
            p.style.left = Math.random() * 100 + "vw";
            p.style.animationDuration = (10 + Math.random() * 100) + "s";p.style.animationDuration = (4 + Math.random() * 8) + "s";
         p.style.animationDelay = (Math.random() * 20) + "s";
            container.appendChild(p);
        }
    }

    // ---------------- Coins & Portfolio ----------------
 
     const newCoins = {
         BTC: { symbol: "btcusdt", img: "bitcoin.png" },
        ETH: { symbol: "ethusdt", img: "ethereum.png" },
        DOGE: { symbol: "dogeusdt", img: "dogecoin.png" },
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
    const portfolio = [];

    // ---------------- Functions ----------------

    // Add Coin to Portfolio
    function addCoinToPortfolio(symbol) {
        if (portfolio.find(c => c.symbol === symbol)) {
            console.log(`⚠️ ${symbol} already added`);
            return alert(symbol + " already added!");
        }

        const coinData = newCoins[symbol];
        const coinObj = { symbol: symbol, amount: 0, price: 0 };
        portfolio.push(coinObj);

        const card = document.createElement("div");
        card.className = "coin";
        card.id = `coin-${symbol}`;
        card.innerHTML = `<img src="/images/${coinData.img}" alt="${symbol}" /><h3>${symbol}</h3><p class="coin-price">$0</p>`;
        coinCards.appendChild(card);

        console.log(`✅ Coin added: ${symbol}`);
        updatePortfolio();
    }

    // Update Portfolio
    function updatePortfolio() {
        portfolioList.innerHTML = "";
        let total = 0;
        portfolio.forEach(c => {
            const div = document.createElement("div");
            div.className = "portfolio-item";
            div.innerHTML = `<span>${c.symbol} x ${c.amount}</span><span>$${(c.amount * c.price).toFixed(2)}</span>`;
            div.addEventListener("click", () => {
                const amount = prompt(`Enter amount of ${c.symbol}:`, c.amount || 0);
                if (amount !== null) {
                    c.amount = parseFloat(amount);
                    updatePortfolio();
                }
            });
            portfolioList.appendChild(div);
            total += c.amount * c.price;

            const cardPrice = document.querySelector(`#coin-${c.symbol} .coin-price`);
            if (cardPrice) cardPrice.textContent = `$${c.price.toFixed(2)}`;
        });
        totalDisplay.textContent = `Total Value: $${total.toFixed(2)}`;
        updateCharts();
    }

    // ---------------- Charts ----------------
    const pieChart = new Chart(document.getElementById("pieChart").getContext("2d"), {
        type: "pie",
        data: { labels: [], datasets: [{ data: [], backgroundColor: ['#ff960b','#e67e00','#f39c12'] }] },
        options: { responsive: true, plugins: { legend: { position: "bottom" } } }
    });
    const lineChart = new Chart(document.getElementById("lineChart").getContext("2d"), {
        type: "line",
        data: { labels: [], datasets: [{ label: "Portfolio Growth", data: [], borderColor: "#ff960b", backgroundColor: "rgba(255,150,11,0.3)", fill: true }] },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });

    function updateCharts() {
        const labels = portfolio.map(c => c.symbol);
        const values = portfolio.map(c => c.amount * c.price);
        pieChart.data.labels = labels;
        pieChart.data.datasets[0].data = values;
        pieChart.update();
        lineChart.data.labels = labels;
        lineChart.data.datasets[0].data = values;
        lineChart.update();
    }

    // ---------------- Dropdown ----------------
    function updateAddCoinDropdown() {
        console.log("🔹 updateAddCoinDropdown called");
        dropdown.innerHTML = "";
        Object.keys(newCoins).forEach(symbol => {
            const alreadyAdded = portfolio.find(c => c.symbol === symbol);
            if (alreadyAdded) return;

            const btn = document.createElement("button");
            btn.className = "dropdown-item";
            btn.innerHTML = `<img src="/images/${newCoins[symbol].img}" alt="${symbol}" /> ${symbol}`;
            btn.addEventListener("click", () => {
                console.log(`➡ Coin clicked: ${symbol}`);
                addCoinToPortfolio(symbol);
                dropdown.classList.remove("show");
            });
            console.log(`✅ Dropdown item listener attached for ${symbol}`);
            dropdown.appendChild(btn);
        });
    }

    if (addBtn && dropdown) {
        addBtn.addEventListener("click", e => {
            e.stopPropagation();
            console.log("➡ Add Coin button clicked");
            dropdown.classList.toggle("show");
            updateAddCoinDropdown();
        });

        window.addEventListener("click", e => {
            if (!dropdown.contains(e.target) && !addBtn.contains(e.target)) {
                dropdown.classList.remove("show");
            }
        });

        console.log("✅ Dropdown event listeners attached");
    } else {
        console.error("❌ addBtn or dropdown not found");
    }

    // ---------------- WebSocket for live prices ----------------
    const streams = Object.values(newCoins).map(c => c.symbol + "@miniTicker").join("/");
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

    ws.onmessage = event => {
        const msg = JSON.parse(event.data);
        const symbol = msg.data.s.replace("USDT", "");
        const price = parseFloat(msg.data.c);
        const coin = portfolio.find(c => c.symbol === symbol);
        if (coin) {
            coin.price = price;
            updatePortfolio();
        }
    };

});
