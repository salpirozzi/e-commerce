const mongoose = require('mongoose');

const ProductsSchema = mongoose.Schema({
    title: String,
    price: Number,
    units: Number,
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product_images' }]
});

const Product = mongoose.model('product', ProductsSchema);

module.exports = Product;