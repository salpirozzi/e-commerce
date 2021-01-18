const express = require('express');
const formidable = require('formidable');

const ChartRouter = express.Router();
const ChartModel = require('../models/Chart.model');

ChartRouter.post("/add", function(req, res) {
    const form = formidable({ multiples: false });
 
    form.parse(req, (err, fields, files) => {
        if(err !== null)return res.status(422).json(err);
        let createdProduct = new ChartModel({
            owner_id: fields.owner_id,
            product: fields.product,
            amount: fields.amount
        });
        createdProduct.save();
        res.json(createdProduct);
    });
});

ChartRouter.post("/get", function(req, res) {
    const form = formidable({ multiples: false });
 
    form.parse(req, async(err, fields, files) => {
        if(err !== null)return res.status(422).json(err);
        const products = await ChartModel.find({ owner_id: fields.id }).populate('product').populate('owner_id');
        res.json(products);
    });
});

module.exports = ChartRouter;