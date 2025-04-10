const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://manohargodugu123:rl3TYkFdQGDFe0Qb@irrigation.dcfoluk.mongodb.net/")
.then(()=>{
    console.log("DB product connected");
})
.catch(()=>{
    console.log("failed to connected");
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


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
