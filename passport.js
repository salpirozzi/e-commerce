const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const JWTExtract = require('passport-jwt').ExtractJwt;
const UserModel = require('./models/User.model');

const SECRET_KEY = 'secret';

const options = {
    jwtFromRequest: JWTExtract.fromHeader("authorization"),
    secretOrKey: SECRET_KEY
}

var userStrategy = new JWTStrategy(options, (payload, done) => {
    UserModel.findOne({ _id: payload.id }, (err, doc) => {
        return (err != null) ? done(err, null) : done(null, doc);
    });
});

var adminStrategy = new JWTStrategy(options, (payload, done) => {
    UserModel.findOne({ _id: payload.id }, (err, doc) => {
        return (err != null) ? done(err, null) : done(null, (doc.admin > 0) ? doc : null);
    });
});

module.exports = (passport) => {
    passport.use('user', userStrategy)
    passport.use('admin', adminStrategy)
}