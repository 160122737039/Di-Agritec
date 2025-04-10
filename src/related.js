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
const relatedSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    category : String,
  });
  
const Related = mongoose.model('Related', relatedSchema);
module.exports = Related;