document.addEventListener("DOMContentLoaded", function () {
    // Highlight the selected product in the sidebar
    const sidebarLinks = document.querySelectorAll(".sidebar ul li a");
    const currentURL = window.location.href;

    sidebarLinks.forEach(link => {
        if (currentURL.includes(link.getAttribute("href"))) {
            link.classList.add("active");
        }
    });

    // Add hover effect for product cards (scaling effect)
    const products = document.querySelectorAll(".product");

    products.forEach(product => {
        product.addEventListener("mouseenter", () => {
            product.style.transform = "scale(1.1)";
            product.style.transition = "transform 0.3s ease-in-out";
        });

        product.addEventListener("mouseleave", () => {
            product.style.transform = "scale(1)";
        });
    });

    
});
document.querySelector(".cart-btn1").addEventListener("click", () => {
    const phoneNumber = localStorage.getItem("userPhone"); // Retrieve phone number from localStorage
    

    if (phoneNumber) {
        window.location.href = `/cart?phone=${phoneNumber}`; // Redirect to cart page with phone number
    } else {
        alert("Please enter your phone number to access your cart.");
    }
});
document.querySelector(".home-icon").addEventListener("click", () => {
    
    window.location.href = '/'; // Redirect to cart page with phone number
    
});


document.addEventListener("DOMContentLoaded", function () {
    const cartCountElement = document.getElementById("cart-count");
    const phoneNumber = localStorage.getItem("userPhone"); // Fetch phone number from localStorage

    async function updateCartCount() {
        if (!phoneNumber) {
            console.warn("No phone number found in localStorage.");
            cartCountElement.style.display = "none";
            return;
        }

        try {
            const response = await fetch(`/cart/count?phoneNumber=${phoneNumber}`);
            const data = await response.json();
            cartCountElement.textContent = data.count;
            cartCountElement.style.display = data.count > 0 ? "inline-block" : "none"; // Hide if 0
        } catch (error) {
            console.error("Error fetching cart count:", error);
        }
    }

    // Fetch cart count every 5 seconds (polling)
    setInterval(updateCartCount, 3000);

    // Initial fetch on page load
    updateCartCount();
});

//responsive
document.querySelector(".menu-toggle").addEventListener("click", () => {
    const navOptions = document.querySelector(".nav-options");
    navOptions.classList.toggle("active");
});

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}