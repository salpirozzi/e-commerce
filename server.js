const express = require('express');
const cors = require('cors');

const app = express();
require('dotenv').config({path: __dirname + '/server.env'});

const mongoose = require('mongoose');
const UserRouter = require('./routers/User.router');
const ImagesRouter = require('./routers/Images.router');

mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', () => console.log('Connessione al database non riuscita.'));
db.once('open', () => console.log("Connesso al database."));

app.use(cors());
app.use('/user', UserRouter);
app.use('/images', ImagesRouter)

app.listen(process.env.SERVER_PORT, () => console.log("Server avviato sulla porta: " + process.env.SERVER_PORT));