const mongoose = require('mongoose');

const ImagesSchema = mongoose.Schema({
    type: String,
    data: Buffer
});

const Image = mongoose.model('product_images', ImagesSchema);

module.exports = Image;