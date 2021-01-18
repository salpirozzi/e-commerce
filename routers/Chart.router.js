const express = require('express');
const formidable = require('formidable');

const ChartRouter = express.Router();
const ChartModel = require('../models/Chart.model');

ChartRouter.post("/add", function(req, res) {
    const form = formidable({ multiples: false });
 
    form.parse(req, async(err, fields, files) => {
        if(err !== null)return res.status(422).json(err);
        const createdChart = await ChartModel.findOneAndUpdate({ 
            owner_id: fields.owner_id,
            product: fields.product
        }, {
            $inc: { amount: fields.amount },
            created_at: new Date()
        }, {
            new: true,
            upsert: true  // Questa proprietà serve per inserire l'oggetto in questione (unendo filtro + aggiornamento) se non esiste
        });
        res.json(createdChart);
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