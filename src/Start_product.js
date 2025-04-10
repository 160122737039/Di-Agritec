const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://manohargodugu123:rl3TYkFdQGDFe0Qb@irrigation.dcfoluk.mongodb.net/")
.then(()=>{
    console.log("DB Start Product connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const StartSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    Description : String,
  });
  
const Start_Product = mongoose.model('Start_Product', StartSchema);
module.exports = Start_Product;