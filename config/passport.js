const LocalStrat = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err) throw err;

                if(isMatch) {
                    return done(null,user);

                }
                else{
                    return done(null,false,{message : 'Password is Incorrect'});
                }

                });

            })
            .catch(err=>console.log(err));
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