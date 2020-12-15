const express = require('express');
const formidable = require('formidable');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/*const passport = require('passport');
require('../passport')(passport);*/

const UserRouter = express.Router();
const UserModel = require('../models/User.model');

UserRouter.post('/register', function(req, res) {
    const form = formidable({ multiples: false });
 
    form.parse(req, (err, fields, files) => {
        if(err !== null)return res.status(422).json(err);
        
        let name = (fields.name).split(/[ ]+/);
        let password = fields.password;
        let email = fields.email;
        let first_name = name[0];
        let last_name = name[1];
        
        UserModel.exists({ email: email }, (err, doc) => {
            if(doc == true)return res.status(422).json("Email già registrata.");
            if(err != null)return res.status(422).json(err);
        })

        bcrypt.hash(password, process.env.BCRYPT_SALT, function(err, hash) {
            if(err != null)return res.status(422).json(err);

            let createdUser = new UserModel({
                email: email,
                firstname: first_name,
                lastname: last_name,
                password: hash
            });
            createdUser.save();
            res.json(createdUser);
        });
    });
});

UserRouter.post('/login', function(req, res) {
    const form = formidable({ multiples: false });

    form.parse(req, (err, fields, files) => {
        if(err != null)return res.status(422).json(err);

        let email = fields.email;
        let password = fields.password;

        UserModel.findOne({ email: email }, (err, doc) => {
            if(err != null)return res.status(422).json(err);
            if(doc == null)return res.status(422).json("Utente inesistente.");
            if(!bcrypt.compareSync(password, doc.password))return res.status(422).json("Password errata.");
            
            const userValues = {
                id: doc._id,
                firstname: doc.firstname,
                lastname: doc.lastname,
                email: email,
                created_at: doc.created_at,
                last_login: doc.last_login,
                admin: doc.admin
            };
            const token = jwt.sign(userValues, process.env.BCRYPT_SECRET, { expiresIn: '31d' });
            res.json({ token: token, user: userValues });
        });
    });
});

UserRouter.post('/update', function(req, res) {
    const form = formidable({ multiples: false });

    form.parse(req, (err, fields, files) => {
        if(err != null)return res.status(422).json(err);

        let id = fields.id;

        UserModel.findById(id, (err, doc) => {
            if(err != null)return res.status(422).json(err);
            if(doc == null)return res.status(422).json("Utente inesistente.");
            
            const userValues = {
                id: doc._id,
                firstname: doc.firstname,
                lastname: doc.lastname,
                email: doc.email,
                created_at: doc.created_at,
                last_login: doc.last_login,
                admin: doc.admin
            };
            const token = jwt.sign(userValues, process.env.BCRYPT_SECRET, { expiresIn: '31d' });
            res.json({ token: token, user: userValues });
        });
    });
});

module.exports = UserRouter;