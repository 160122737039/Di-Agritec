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


document.addEventListener("DOMContentLoaded", function () {
    const cartButtons = document.querySelectorAll(".cart-btn");
    const buyButtons = document.querySelectorAll(".buy-btn");
    const phonePopup = document.getElementById("phonePopup");
    const phoneInput = document.getElementById("phoneInput");
    const phoneSubmit = document.getElementById("phoneSubmit");
    const cartPopup = document.getElementById("cartPopup");
    const cancelButton = document.getElementById("cancelButton");
    const form = document.getElementById("cartDetailsForm");

    let currentProduct = null;
    let userPhone = localStorage.getItem("userPhone");

    async function checkPhoneNumber(phone) {
        try {
            const response = await fetch("/check-phone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            });

            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error("Error checking phone:", error);
            return false;
        }
    }

    async function fetchProductPrice(productId) {
        try {
            const response = await fetch(`/get-product-price/${productId}`);
            const data = await response.json();
            console.log(data);
            return Number(data.price); // Ensure backend sends { price: value }
        } catch (error) {
            console.error("Error fetching product price:", error);
            return null;
        }
    }

    async function addToCart(productId, price, phone, details = null) {
        try {
            const response = await fetch("/cart-add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, price, phone, ...details }),
            });

            const data = await response.json();
            if (data.success) {
                alert("Product added to cart successfully!");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add product to cart");
        }
    }

    cartButtons.forEach((button) => {
        button.addEventListener("click", async function () {
            const productElement = this.closest(".product");
            currentProduct = productElement.dataset.id;

            if (!userPhone) {
                phonePopup.style.display = "flex";
            } else {
                const phoneExists = await checkPhoneNumber(userPhone);
                if (phoneExists) {
                    const productPrice = await fetchProductPrice(currentProduct);
                    if (productPrice !== null) {
                        addToCart(currentProduct, productPrice, userPhone);
                    } else {
                        alert("Failed to retrieve product price.");
                    }
                } else {
                    cartPopup.style.display = "flex";
                }
            }
        });
    });



    buyButtons.forEach((button) => {
        button.addEventListener("click", async function () {
            const productElement = this.closest(".product");
            currentProduct = productElement.dataset.id;

            if (!userPhone) {
                phonePopup.style.display = "flex";
            } else {
                const phoneExists = await checkPhoneNumber(userPhone);
                if (phoneExists) {
                    const productPrice = await fetchProductPrice(currentProduct);
                    if (productPrice !== null) {
                        addToCart(currentProduct, productPrice, userPhone);
                        window.location.href = `/cart?phone=${userPhone}`;
                    } else {
                        alert("Failed to retrieve product price.");
                    }
                } else {
                    cartPopup.style.display = "flex";
                }
            }
        });
    });



    phoneSubmit.addEventListener("click", async function () {
        userPhone = phoneInput.value.trim();
        localStorage.setItem("userPhone", userPhone);
        phonePopup.style.display = "none";

        if (await checkPhoneNumber(userPhone)) {
            const productPrice = await fetchProductPrice(currentProduct);
            if (productPrice !== null) {
                addToCart(currentProduct, productPrice, userPhone);
            } else {
                alert("Failed to retrieve product price.");
            }
        } else {
            cartPopup.style.display = "flex";
        }
    });

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const productPrice = await fetchProductPrice(currentProduct);
        if (productPrice !== null) {
            await addToCart(currentProduct, productPrice, userPhone, Object.fromEntries(new FormData(this)));
            cartPopup.style.display = "none";
        } else {
            alert("Failed to retrieve product price.");
        }
    });

    cancelButton.addEventListener("click", function () {
        cartPopup.style.display = "none";
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

document.querySelector(".menu-toggle").addEventListener("click", () => {
    const navOptions = document.querySelector(".nav-options");
    navOptions.classList.toggle("active");
});

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}

