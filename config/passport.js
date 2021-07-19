const LocalStrat = require("passport-local").Strategy;
const mongoose = require("mongoose");

//Load User MOdel
const User = require("../models/User");

module.exports = async function (passport) {
  passport.use(
    new LocalStrat({ usernameField: "UserId" }, async (UserId, password, done) => {
      //Match User
      console.log(UserId, password);
    //   const find = await User.find({ UserId: UserId }).then((user) => {
    //     console.log(user);
    //   });
      await User.findOne({ UserId: UserId }).then((user) => {
        // console.log(user);
        if (!user) {
          return done(null, false, {
            message: "Employee ID is not registered",
          });
        }
        //Match Password
        console.log('Here',user);
        if (password === user.password) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Password is Incorrect" });
        }
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
