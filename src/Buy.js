const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://manohargodugu123:rl3TYkFdQGDFe0Qb@irrigation.dcfoluk.mongodb.net/")
.then(()=>{
    console.log("DB Related connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const BuySchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    Price : String,
    category : String
  });
  
const Buy = mongoose.model('Buy', BuySchema);
module.exports = Buy;