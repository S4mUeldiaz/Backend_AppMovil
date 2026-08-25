const JwtStrategy =require('passport-jwt').Strategy
const EXtractJwt = require('passport-jwt').ExtractJwt
const keys = require('./keys');
const User = require('../models/user');
const passport = require('passport');

module.exports =(passport) => {
    const opts ={};
    opts.jwtFromRequest = EXtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = keys.secretOrterkey;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.finById(jwt_payload.id, (err, user) =>{
            if(err){
                return done(err, false);
            }
            if(user) {
                return done(null, user);
            }
            return done(null, false);            
        });
    }));
}