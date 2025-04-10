const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://manohargodugu123:rl3TYkFdQGDFe0Qb@irrigation.dcfoluk.mongodb.net/start_products?retryWrites=true&w=majority";

// Recommended options for stable MongoDB Atlas connection
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(MONGO_URI, options)
    .then(() => {
        console.log("✅ DB Start Product connected");
    })
    .catch((err) => {
        console.error("❌ Failed to connect to DB", err.message);
    });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));


const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    phoneNumber: String,
    address1: String,
    address2: String,
    pincode: String,
    cartItems: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        price : {type : Number}
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
