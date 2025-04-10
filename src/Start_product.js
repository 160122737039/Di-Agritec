const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://manohargodugu123:rl3TYkFdQGDFe0Qb@irrigation.dcfoluk.mongodb.net/start_products?retryWrites=true&w=majority";

// Recommended options for stable MongoDB Atlas connection
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(MONGO_URI, options)
    .then(() => {
        console.log("✅ DB Start Product connected k");
    })
    .catch((err) => {
        console.error("❌ Failed to connect to DB", err.message);
    });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define Schema
const StartSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    Description: { type: String, required: true }
}, { timestamps: true });

// Model
const Start_Product = mongoose.model("Start_Product", StartSchema);

module.exports = Start_Product;
