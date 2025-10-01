Cryptocurrency Price Tracker

🚀 Overview

This is a real-time Cryptocurrency Price Tracker built using HTML, CSS, and JavaScript, powered by the CoinGecko API. It provides live price updates for Bitcoin (BTC), Ethereum (ETH), and Dogecoin (DOGE) with real-time data analysis.

📌 Features

🔄 Live price updates for Bitcoin, Ethereum, and Dogecoin etc.

📊 Real-time data fetching using the CoinGecko API.

🎨 Responsive design for desktop & mobile users.

📈 Dynamic price changes displayed with color indicators (green for increase, red for decrease).

🕒 Automatic refresh every few seconds.

🛠️ Technologies Used

HTML – Structure of the web page.

CSS – Styling and responsiveness.

JavaScript – Fetching and displaying real-time data.

jQuery – Simplified AJAX requests and DOM manipulation.

CoinGecko API – Live cryptocurrency price data
🎯 Usage

Open the project in a web browser.

The latest cryptocurrency prices will be displayed.

The tracker updates automatically.
## 📷 Dashboard Preview

![Cryptocurrency Price Tracker](FRONTPAGE.png)
![Cryptocurrency Price Tracker](GRAPHPAGE.png)

🔥 Future Enhancements

📉 Add historical price charts using Chart.js.

🌎 Support for multiple fiat currencies.

📡 Implement WebSockets for real-time updates.

🤝 Contributing

Contributions are welcome! Feel free to fork this repository and submit a pull request.
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PulseCrypto Alerts</title>
  <!-- Root style.css -->
  <link rel="stylesheet" href="/style.css">
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>
<body>
  <div id="login-overlay">
    <div class="floating-coins">
      <img src="/images/bitcoin.png" class="coin-float">
      <img src="/images/ethereum.png" class="coin-float">
      <img src="/images/dogecoin.png" class="coin-float">
      <img src="/images/ripple.jpeg" class="coin-float">
      <img src="/images/LITECOIN.png" class="coin-float">
    </div>
    <div class="login-box">
      <h2>Welcome to PulseCrypto</h2>
      <p>Enter your email to continue</p>
      <input type="email" id="login-email" placeholder="Your email..." />
      <button id="login-btn">Continue</button>
    </div>
  </div>

  <div class="container">
    <nav>
     <img src="/images/logo.png" class="logo">
      <ul>
        <li><a href="/Explore/Explore.html">Explore more</a></li>
        <li><a href="/Features/features.html">Features</a></li>
        <li><a href="/AboutUs/AboutUs.html">About Us</a></li>
        <li><a href="/Market/Market.html">Market</a></li>
        <li><a href="/News/News.html">Live News</a></li>
      </ul>
    </nav>


  <div id="particles-wrapper"></div>

    <div id="particles-wrapper"></div>

    <div class="coin-actions">
      <div class="dropdown">
        <button id="add-coin-btn" class="btn">+ Add Coin</button>
        <div class="dropdown-content" id="add-coin-dropdown"></div>
      </div>
    </div>

    <div class="content">
      <h1><span>PulseCrypto</span></h1>
      <p>Real-time cryptocurrency monitoring dashboard with alerts.</p>
    </div>

    <div class="coin-list">
      <div class="coin" id="bitcoin-card">
        <img src="/images/bitcoin.png">
        <div>
          <h3 id="bitcoin">$0</h3>
          <p>Bitcoin</p>
          <input type="number" class="alert-input" placeholder="Target Price" />
          <button class="alert-btn">Set Alert</button>
          <p class="change"></p>
        </div>
      </div>

      <div class="coin" id="ethereum-card">
        <img src="/images/ethereum.png">
        <div>
          <h3 id="ethereum">$0</h3>
          <p>Ethereum</p>
          <input type="number" class="alert-input" placeholder="Target Price" />
          <button class="alert-btn">Set Alert</button>
          <p class="change"></p>
        </div>
      </div>

      <div class="coin" id="dogecoin-card">
        <img src="/images/dogecoin.png">
        <div>
          <h3 id="dogecoin">$0</h3>
          <p>Dogecoin</p>
          <input type="number" class="alert-input" placeholder="Target Price" />
          <button class="alert-btn">Set Alert</button>
          <p class="change"></p>
        </div>
      </div>

      <div class="coin" id="ripple-card">
        <img src="/images/ripple.jpeg">
        <div>
          <h3 id="ripple">$0</h3>
          <p>Ripple</p>
          <input type="number" class="alert-input" placeholder="Target Price" />
          <button class="alert-btn">Set Alert</button>
          <p class="change"></p>
        </div>
      </div>

      <div class="coin" id="litecoin-card">
        <img src="/images/LITECOIN.png">
        <div>
          <h3 id="litecoin">$0</h3>
          <p>Litecoin</p>
          <input type="number" class="alert-input" placeholder="Target Price" />
          <button class="alert-btn">Set Alert</button>
          <p class="change"></p>
        </div>
      </div>
    </div>
  </div>

  <!-- Root script.js -->
  <script type="module" src="/script.js"></script>
  <script type="module" src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</body>
</html>
