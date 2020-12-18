const express = require('express');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs'); 
const jwt = require('jsonwebtoken');

const ProductsRouter = express.Router();
const ImagesModel = require('../models/Images.model');
const ProductModel = require('../models/Products.model');

const passport = require('passport');
require('../passport')(passport);

const applyDiscount = (x) => {
    let start = new Date(x.discount_start).valueOf();
    let end = new Date(x.discount_end).valueOf();
    let today = new Date().valueOf();
    if(today >= start && today <= end) {
        x["discounted"] = true;
        x["discounted_price"] = x.price - (x.price * x.discount / 100);                 
    }
    return x;
}

ProductsRouter.post('/retrieve', async function(req, res) {
    var data = await ProductModel.find().populate('images').populate('owner');
    data = data.map(x => x.toObject());
    data.filter(x => x.discount >= 5).map(x => applyDiscount(x));
    res.json(data);
})

ProductsRouter.post('/search', function(req, res) {
    const form = formidable({ multiples: false });

    form.parse(req, async(err, fields, files) => {
        if(err != null)return res.status(422).json(err);
        let data = await ProductModel.find({ title: {$regex: fields.name, $options: 'i'} }).limit(10).select('title');
        res.json(data);
    });
})

ProductsRouter.post('/get', function(req, res) {
    const form = formidable({ multiples: false });

    form.parse(req, async(err, fields, files) => {
        if(err != null)return res.status(422).json(err);
        let data = await ProductModel.findById(fields.id).populate('images').populate('owner');
        data = data.toObject();
        if(data.discount >= 5) applyDiscount(data);
        res.json(data);
    });
})

ProductsRouter.post('/add', passport.authenticate('user', { session: false }), function(req, res) {
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
        if(err != null)return res.status(422).json(err);

        let decoded = jwt.verify(req.headers.authorization, process.env.BCRYPT_SECRET);
        let owner = decoded.id;
        let images = [];

        Object.keys(files).map(x => {
            let old_path = files[x].path; 
            let raw_data = fs.readFileSync(old_path);
            let image = new ImagesModel({
                type: files[x].type,
                data: raw_data
            });
            image.save();
            images.push(image._id);
        });

        let product = new ProductModel({
            title: fields.title,
            price: fields.price,
            units: fields.units,
            owner: owner,
            images: images,
            discount: fields.discount,
            discount_start: (fields.discount >= 5) ? fields.discount_start : null,
            discount_end: (fields.discount >= 5) ? fields.discount_end : null
        });

        product.save();
        res.json(product);
    });
});

module.exports = ProductsRouter;