$(document).ready(function () {
    // Fetch additional crypto data
    function fetchCryptoData() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,dogecoin,ripple,litecoin&order=market_cap_desc&per_page=5&page=1&sparkline=false",
            "method": "GET",
            "headers": {}
        };

        $.ajax(settings).done(function (response) {
            // Update table with fetched data
            response.forEach(coin => {
                if (coin.id === "bitcoin") {
                    $("#btc-price").text(`$${coin.current_price}`);
                    $("#btc-market-cap").text(`$${coin.market_cap.toLocaleString()}`);
                    $("#btc-volume").text(`$${coin.total_volume.toLocaleString()}`);
                    $("#btc-change").text(`${coin.price_change_percentage_24h.toFixed(2)}%`);
                } else if (coin.id === "ethereum") {
                    $("#eth-price").text(`$${coin.current_price}`);
                    $("#eth-market-cap").text(`$${coin.market_cap.toLocaleString()}`);
                    $("#eth-volume").text(`$${coin.total_volume.toLocaleString()}`);
                    $("#eth-change").text(`${coin.price_change_percentage_24h.toFixed(2)}%`);
                } else if (coin.id === "dogecoin") {
                    $("#doge-price").text(`$${coin.current_price}`);
                    $("#doge-market-cap").text(`$${coin.market_cap.toLocaleString()}`);
                    $("#doge-volume").text(`$${coin.total_volume.toLocaleString()}`);
                    $("#doge-change").text(`${coin.price_change_percentage_24h.toFixed(2)}%`);
                } else if (coin.id === "ripple") {
                    $("#xrp-price").text(`$${coin.current_price}`);
                    $("#xrp-market-cap").text(`$${coin.market_cap.toLocaleString()}`);
                    $("#xrp-volume").text(`$${coin.total_volume.toLocaleString()}`);
                    $("#xrp-change").text(`${coin.price_change_percentage_24h.toFixed(2)}%`);
                } else if (coin.id === "litecoin") {
                    $("#ltc-price").text(`$${coin.current_price}`);
                    $("#ltc-market-cap").text(`$${coin.market_cap.toLocaleString()}`);
                    $("#ltc-volume").text(`$${coin.total_volume.toLocaleString()}`);
                    $("#ltc-change").text(`${coin.price_change_percentage_24h.toFixed(2)}%`);
                }
            });
        });
    }

    // Fetch data immediately and refresh every 30 seconds
    fetchCryptoData();
    setInterval(fetchCryptoData, 30000);

    // Mock data for Bitcoin price trend (last 7 days)
    const priceData = {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        datasets: [{
            label: 'Bitcoin Price (USD)',
            data: [45000, 46000, 45500, 47000, 46500, 48000, 47500],
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0, 212, 255, 0.2)',
            fill: true,
            tension: 0.4
        }]
    };

    // Initialize Chart.js
    const ctx = document.getElementById('priceChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: priceData,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Price (USD)',
                        color: '#fff'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time',
                        color: '#fff'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });
});