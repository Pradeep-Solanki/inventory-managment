const LocalStrat = require('passport-local').Strategy;
const mongoose = require('mongoose');

//Load User MOdel
const User = require('../models/User');

module.exports = function(passport){
    passport.use(
        new LocalStrat({ usernameField: 'EId'},(EId, password,done)=>{
            //Match User
            User.findOne({EId:EId})
            .then(user=>{
                if(!user){
                    return done(null,false,{message: 'Employee ID is not registered'});
                }
                //Match Password
                if(password===user.password)
                        {return done(null,user);}
                else{
                    return done(null,false,{message : 'Password is Incorrect'});
                }

                });

        })
    );

        passport.serializeUser(function(user,done){
            done(null,user.id);
        });
        passport.deserializeUser((id,done)=>{
            User.findById(id,(err,user)=>{
                done(err,user);
            })
        })
}