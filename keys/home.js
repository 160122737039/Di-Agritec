// script.js (JavaScript for Dynamic Features)
document.querySelectorAll('.product img').forEach(img => {
    img.addEventListener('click', () => {
        window.location.href = img.parentElement.href;
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const cartBtn = document.querySelector(".cart-btn1");
    const cartCountElement = document.getElementById("cart-count");
    const phoneNumber = localStorage.getItem("userPhone");

    if (cartBtn) {
        cartBtn.addEventListener("click", () => {
            if (phoneNumber) {
                window.location.href = `/cart?phone=${phoneNumber}`;
            } else {
                alert("Please enter your phone number to access your cart.");
            }
        });
    }

    async function updateCartCount() {
        if (!phoneNumber) {
            cartCountElement.style.display = "none";
            return;
        }

        try {
            const response = await fetch(`/cart/count?phoneNumber=${phoneNumber}`);
            const data = await response.json();
            cartCountElement.textContent = data.count;
            cartCountElement.style.display = data.count > 0 ? "inline-block" : "none";
        } catch (error) {
            console.error("Error fetching cart count:", error);
        }
    }

    setInterval(updateCartCount, 3000);
    updateCartCount();
});


document.querySelector(".cart-btn1").addEventListener("click", () => {
    const phoneNumber = localStorage.getItem("userPhone"); // Retrieve phone number from localStorage
    

    if (phoneNumber) {
        window.location.href = `/cart?phone=${phoneNumber}`; // Redirect to cart page with phone number
    } else {
        alert("Please enter your phone number to access your cart.");
    }
});
// Toggle nav options on mobile
document.querySelector(".menu-toggle").addEventListener("click", () => {
    const navOptions = document.querySelector(".nav-options");
    navOptions.classList.toggle("active");
});

