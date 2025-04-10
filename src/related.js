const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://manohargodugu123:rl3TYkFdQGDFe0Qb@irrigation.dcfoluk.mongodb.net/")
.then(()=>{
    console.log("DB related connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const relatedSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    category : String,
  });
  
const Related = mongoose.model('Related', relatedSchema);
module.exports = Related;