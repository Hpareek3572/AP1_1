const mongoose = require('mongoose')

/* The code snippet is defining a Mongoose schema for a product. It specifies the structure of the data
that will be stored in the MongoDB database for the "Product" collection. */
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema);
