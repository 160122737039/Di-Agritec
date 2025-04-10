const express = require("express")
const app = express()
const session = require('express-session');
require('dotenv').config();


const router = express.Router();
const path = require("path")
const hbs = require("hbs")

const Product = require("./mongo.js")
const Related=require("./related.js")
const Buy=require("./Buy.js")
const Cart = require("./products.js")

const templatepath = path.join(__dirname, '../templates')
const publicpath = path.join(__dirname, '../public')
console.log(publicpath)
const keypath = path.join(__dirname, '../keys')
console.log(keypath)
app.use(express.json())
app.set("view engine", "hbs")
app.set("views", templatepath)
app.use(express.urlencoded({ extended: false }))
app.use(express.static(publicpath))
app.use(express.static(keypath))


app.get('/', async (req, res) => {
    const products = await Product.find();
    res.render('home', { products });
  });
  
app.get('/product/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('product', { product });
  });

app.get('/related/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const selectedProduct = await Product.findById(productId);
        const relatedProducts = await Related.find({ category: selectedProduct.name });
        const allProducts = await Product.find();

        res.render('Related', {
            selectedProduct,
            relatedProducts,
            allProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving related products");
    }
});
app.get('/buyProducts/:id', async (req, res) => {
    try {
        const buyId = req.params.id;
        const selectedProduct = await Related.findById(buyId);
        const relatedProducts = await Buy.find({ category: selectedProduct.name });
        const allProducts = await Related.find();

        res.render('PageForBuy', {
            selectedProduct,
            relatedProducts,
            allProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving related products");
    }
});



app.post("/check-phone", async (req, res) => {
    try {
        const { phone } = req.body;
        const existingCart = await Cart.findOne({ phoneNumber: phone });

        if (existingCart) {
            return res.json({ exists: true, userId: existingCart.userId });
        } else {
            return res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


app.get("/get-product-price/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Buy.findById(productId); // Fetch product by ID
        

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({ price: product.Price }); // Send only price
    } catch (error) {
        res.status(500).json({ error: "Server error fetching product price" });
    }
});


// Add to cart
app.post("/cart-add", async (req, res) => {
    try {
        const { productId, phone, address1, address2, pincode ,price} = req.body;

        let cart = await Cart.findOne({ phoneNumber: phone });

        if (!cart) {
            // Create new cart with details
            cart = new Cart({
                phoneNumber: phone,
                address1,
                address2,
                pincode,
                cartItems: [{ productId ,price}],
            });
        } else {
            // Add to existing cart
            const existingItem = cart.cartItems.find(
                (item) => item.productId.toString() === productId.toString()
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.cartItems.push({ productId ,price});
            }
        }

        await cart.save();
        res.json({ success: true, message: "Product added to cart!" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
app.get('/cart', async (req, res) => {
    try {
        const phoneNumber = req.query.phone; // Get phone number from query params

        if (!phoneNumber) {
            return res.render("cart", { cartItems: [], totalPrice: 0, error: "Phone number is required" });
        }

        // Find cart based on phone number
        const cart = await Cart.findOne({ phoneNumber });

        if (!cart || cart.cartItems.length === 0) {
            return res.render("cart", { cartItems: [], totalPrice: 0, message: "Your cart is empty! 🛍️" });
        }

        // Fetch product details (name & image) for each cart item from Buy collection
        const cartItems = await Promise.all(cart.cartItems.map(async (item) => {
            const product = await Buy.findById(item.productId);
            return {
                _id: item._id,
                productId: item.productId,
                name: product ? product.name : "Unknown Product",
                imageUrl: product ? product.imageUrl : "/default-image.jpg",
                quantity: item.quantity,
                price: item.price
            };
        }));

        // Calculate total price
        const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Send data to the cart page
        res.render("cart", { cartItems, totalPrice });

    } catch (error) {
        console.error("Error fetching cart:", error);
        res.render("cart", { cartItems: [], totalPrice: 0, error: "Internal Server Error" });
    }
});


app.post('/cart/update', async (req, res) => {
    console.log('cart')
    try {
        const { productId, quantity } = req.body;

        if (quantity <= 0) {
            return res.status(400).json({ success: false, message: "Invalid quantity" });
        }

        const cart = await Cart.findOneAndUpdate(
            { "cartItems._id": productId },
            { $set: { "cartItems.$.quantity": quantity } },
            { new: true }
        );

        res.json({ success: true, cart });
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

app.post('/cart/remove', async (req, res) => {
    try {
        const { productId } = req.body;

        const cart = await Cart.findOneAndUpdate(
            {},
            { $pull: { cartItems: { _id:productId } } },
            { new: true }
        );

        res.json({ success: true, cart });
    } catch (error) {
        console.error("Error removing cart item:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//buy
app.put("/update-details", async (req, res) => {
    const { previousPhone, newPhone, address1, address2, pincode } = req.body;

    try {
        const cart = await Cart.findOne({ phoneNumber: previousPhone });
        if (!cart) {
            return res.json({ success: false, message: "Previous phone number not found." });
        }

        // Update only the fields provided
        if (newPhone) cart.phoneNumber = newPhone;
        if (address1) cart.address1 = address1;
        if (address2) cart.address2 = address2;
        if (pincode) cart.pincode = pincode;

        await cart.save();

        res.json({ success: true, message: "Details updated successfully!" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server error." });
    }
});

app.delete("/remove-details", async (req, res) => {
    const { phoneNumber } = req.body;

    try {
        const cart = await Cart.deleteOne({ phoneNumber });

        if (cart.deletedCount === 0) {
            return res.json({ success: false, message: "Phone number not found." });
        }

        res.json({ success: true, message: "Details removed successfully!" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server error." });
    }
});

app.get("/get-details", async (req, res) => {
    try {
        const phone = req.query.phone;
        if (!phone) {
            return res.status(400).json({ success: false, message: "Phone number is required" });
        }

        const user = await Cart.findOne({ phoneNumber: phone }); // Assuming you use MongoDB
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            address1: user.address1 || "",
            address2: user.address2 || "",
            pincode: user.pincode || ""
        });
    } catch (error) {
        console.error("Error fetching details:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


//payment
app.get("/cart/count", async (req, res) => {
    try {
        const phoneNumber = req.query.phoneNumber; // Get phone number from query params
        if (!phoneNumber) return res.json({ count: 0 });

        const cart = await Cart.findOne({ phoneNumber });

        const totalCount = cart ? cart.cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;

        res.json({ count: totalCount });
    } catch (error) {
        console.error("Error fetching cart count:", error);
        res.status(500).json({ count: 0 });
    }
});


app.listen(54580, () => {
    console.log("port now connected");
})