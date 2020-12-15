const mongoose = require('mongoose');

const ImagesSchema = mongoose.Schema({
    type: String,
    data: Buffer,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' }
});

const Image = mongoose.model('product_images', ImagesSchema);

module.exports = Image;