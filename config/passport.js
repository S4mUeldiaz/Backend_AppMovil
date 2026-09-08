/* const JwtStrategy =require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const keys = require('./keys');
const User = require('../models/user');

module.exports =(passport) => {
    const opts ={};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = keys.secretOrterkey;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id, (err, user) =>{
            if(err){
                return done(err, false);
            }
            if(user) {
                return done(null, user);
            }
            return done(null, false);            
        });
    }));
} */