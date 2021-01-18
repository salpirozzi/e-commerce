const mongoose = require('mongoose');

const ProductsSchema = mongoose.Schema({
    title: String,
    price: Number,
    units: Number,
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product_images' }],
    discount: Number,
    discount_start: {type: Date, default: null},
    discount_end: {type: Date, default: null},
    created_at: {type: Date, default: Date.now},
    category: Number,
    description: Object
});

const Product = mongoose.model('product', ProductsSchema);

module.exports = Product;