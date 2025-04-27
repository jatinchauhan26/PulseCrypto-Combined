// Fetch coin elements
var btc = document.getElementById("bitcoin");
var eth = document.getElementById("ethereum");
var doge = document.getElementById("dogecoin");
var xrp = document.getElementById("ripple");
var ltc = document.getElementById("litecoin");

// Function to fetch and update crypto prices
function fetchCryptoPrices() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,ripple,litecoin&vs_currencies=usd&include_24hr_change=true",
        "method": "GET",
        "headers": {}
    };

    $.ajax(settings).done(function (response) {
        btc.innerHTML = `$${response.bitcoin.usd} (${response.bitcoin.usd_24h_change.toFixed(2)}%)`;
        eth.innerHTML = `$${response.ethereum.usd} (${response.epsilon.usd_24h_change.toFixed(2)}%)`;
        doge.innerHTML = `$${response.dogecoin.usd} (${response.dogecoin.usd_24h_change.toFixed(2)}%)`;
        xrp.innerHTML = `$${response.ripple.usd} (${response.ripple.usd_24h_change.toFixed(2)}%)`;
        ltc.innerHTML = `$${response.litecoin.usd} (${response.litecoin.usd_24h_change.toFixed(2)}%)`;
    });
}

// Fetch prices immediately when page loads
fetchCryptoPrices();

// Refresh prices every 10 seconds
setInterval(fetchCryptoPrices, 10000);