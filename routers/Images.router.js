const express = require('express');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs'); 

const ImagesRouter = express.Router();
const ImagesModel = require('../models/Images.model');

ImagesRouter.post('/retrieve', function(req, res) {

    ImagesModel.find({}, (err, doc) => {
        res.json(doc);
    })
})

ImagesRouter.post('/add', function(req, res) {
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
        if(err != null)return res.status(422).json(err);
        Object.keys(files).map(x => {
            let old_path = files[x].path; 
            let raw_data = fs.readFileSync(old_path);
            let image = new ImagesModel({
                type: files[x].type,
                data: raw_data
            });
            image.save();
        })
    });
});

module.exports = ImagesRouter;