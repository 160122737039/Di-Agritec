const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://manohargodugu123:rl3TYkFdQGDFe0Qb@irrigation.dcfoluk.mongodb.net/")
.then(()=>{
    console.log("DB Mongo connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const productSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    Description : String
  });
  
  const Product = mongoose.model('Product', productSchema);
module.exports = Product;