document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    // Function to update total price
    function updateTotalPrice() {
        let total = 0;
        document.querySelectorAll(".cart-item").forEach(item => {
            const price = parseFloat(item.querySelector(".item-price").textContent);
            const quantity = parseInt(item.querySelector(".quantity").textContent);
            total += price * quantity;
        });
        totalPriceElement.textContent = total.toFixed(2);
    }

    // Handle Increase (+) Button
    cartContainer.addEventListener("click", async (event) => {
        if (event.target.classList.contains("increase")) {
            const itemElement = event.target.closest(".cart-item");
            const quantityElement = itemElement.querySelector(".quantity");
            let quantity = parseInt(quantityElement.textContent);
            const productId = itemElement.getAttribute("data-id");

            quantity++;
            quantityElement.textContent = quantity;

            // Update quantity in database
            await updateCart(productId, quantity);
            console.log("hello");

            updateTotalPrice();
        }
    });

    // Handle Decrease (-) Button
    cartContainer.addEventListener("click", async (event) => {
        if (event.target.classList.contains("decrease")) {
            const itemElement = event.target.closest(".cart-item");
            const quantityElement = itemElement.querySelector(".quantity");
            let quantity = parseInt(quantityElement.textContent);
            const productId = itemElement.getAttribute("data-id");

            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;

                // Update quantity in database
                await updateCart(productId, quantity);
            } else {
                // Remove the item if quantity reaches 0
                itemElement.remove();
                await removeFromCart(productId);
            }

            updateTotalPrice();
        }
    });

    // Handle Remove (🗑️) Button
    cartContainer.addEventListener("click", async (event) => {
        if (event.target.classList.contains("remove-btn")) {
            const itemElement = event.target.closest(".cart-item");
            const productId = itemElement.getAttribute("data-id");

            // Remove item from UI
            itemElement.remove();

            // Remove item from database
            await removeFromCart(productId);

            updateTotalPrice();
        }
    });

    // Function to update cart quantity in database
    async function updateCart(productId, quantity) {
        try {
            await fetch(`/cart/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ productId, quantity })
            });
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    }

    // Function to remove item from cart in database
    async function removeFromCart(productId) {
        try {
            await fetch(`/cart/remove`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ productId })
            });
        } catch (error) {
            console.error("Error removing item:", error);
        }
    }

    // Initial total price calculation
    updateTotalPrice();
});


//phone buttons
document.addEventListener("DOMContentLoaded", () => {
    const updateDetailsBtn = document.querySelector(".update-details");
    const removeDetailsBtn = document.querySelector(".clear-details");

    updateDetailsBtn.addEventListener("click", () => {
        showUpdateForm();
    });

    removeDetailsBtn.addEventListener("click", async () => {
        const phoneToRemove = localStorage.getItem("userPhone");
        if (!phoneToRemove) {
            alert("No phone number stored.");
            return;
        }

        if (!confirm("Are you sure you want to remove your phone number?")) return;

        try {
            const response = await fetch("/remove-details", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: phoneToRemove })
            });

            const result = await response.json();
            if (result.success) {
                alert(result.message);
                localStorage.removeItem("userPhone"); // Only remove phone number
            } else {
                alert("Failed to remove phone number. " + result.message);
            }
        } catch (error) {
            console.error("Error removing phone number:", error);
        }
    });
});

function showUpdateForm() {
    const previousPhone = localStorage.getItem("userPhone") || "";

    const formHtml = `
        <div class="popup-overlay active">
            <div class="popup-form">
                <h3>Update Details</h3>
                <div class="input-group">
                    <input type="text" id="previousPhone" value="${previousPhone}">
                    <label>Previous Phone:</label>
                </div>
                <div class="input-group">
                    <input type="text" id="newPhone" >
                    <label>New Phone:</label>
                </div>
                <div class="input-group">
                    <input type="text" id="address1">
                    <label>Address Line 1:</label>
                </div>
                <div class="input-group">
                    <input type="text" id="address2">
                    <label>Address Line 2:</label>
                </div>
                <div class="input-group">
                    <input type="text" id="pincode" >
                    <label>Pincode:</label>
                </div>
                <button id="submitUpdate">Update</button>
                <button id="closePopup">Cancel</button>
            </div>
        </div>`;

    document.body.insertAdjacentHTML("beforeend", formHtml);

    document.getElementById("submitUpdate").addEventListener("click", async () => {
        const newPhone = document.getElementById("newPhone").value || previousPhone;
        const address1 = document.getElementById("address1").value;
        const address2 = document.getElementById("address2").value;
        const pincode = document.getElementById("pincode").value;

        try {
            const response = await fetch("/update-details", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ previousPhone, newPhone, address1, address2, pincode })
            });

            const result = await response.json();
            if (result.success) {
                alert("Details updated successfully!");
                localStorage.setItem("userPhone", newPhone);
            } else {
                alert("Failed to update details. " + result.message);
            }
        } catch (error) {
            console.error("Error updating details:", error);
        }
        document.querySelector(".popup-overlay").remove();
    });

    document.getElementById("closePopup").addEventListener("click", () => {
        document.querySelector(".popup-overlay").remove();
    });
}

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
//payment
function initiateUPIPayment() {
    document.getElementById("paymentModal").style.display = "block";
}

function closePaymentModal() {
    document.getElementById("paymentModal").style.display = "none";
}

// Optional: close modal if clicked outside
window.onclick = function(event) {
    const modal = document.getElementById("paymentModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
