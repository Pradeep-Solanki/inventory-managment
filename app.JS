const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const app = express();
const passport = require('passport');

// Passport Config
require('./config/passport')(passport);
// DB Config
const db  = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db,{useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log('Database Connected!'))
.catch(err=>console.log(err));

// ejs
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('view engine', 'ejs');

// BodyParser
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

// Express Session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));
// Passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());
//Connect flash
app.use(flash());

// Global Variablse
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
// Routers
app.use('/', require('./routes/users'));
app.use('/users', require('./routes/users'));
const PORT = process.env.PORT || 5000;

app.listen(PORT,console.log(`Server started on port: ${PORT}`));

    