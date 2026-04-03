// ---------------- EmailJS ----------------
// Initialize with your Public Key
emailjs.init('bYgbLoAsAVE7FIOFi');

document.getElementById('support-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Hardcoded Service ID and Template ID
    const serviceID = 'service_fv8mvdo';
    const templateID = 'template_fiyemse';

    const templateParams = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        issue: document.getElementById('issue').value,
        message: document.getElementById('message').value
    };

    emailjs.send(serviceID, templateID, templateParams)
        .then(() => {
            const statusEl = document.getElementById('form-status');
            statusEl.innerHTML = "✅ Message sent successfully!";
            document.getElementById('support-form').reset();

            // Remove message after 5 seconds
            setTimeout(() => {
                statusEl.innerHTML = "";
            }, 10000);
        })
        .catch(() => {
            const statusEl = document.getElementById('form-status');
            statusEl.innerHTML = "❌ Failed to send message. Try again.";

            // Remove message after 5 seconds
            setTimeout(() => {
                statusEl.innerHTML = "";
            }, 5000);
        });
});


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
