const { request } = require("express");
const express = require("express");
const router = express.Router();
const passport = require('passport');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
// Welcome Page
router.get('/',(req,res)=>res.render('login'));


module.exports = router;
//User Model
const User = require('../models/User');
const Object = require('../models/object');
//Login Page
router.get('/login',(req,res)=>res.render('Login'));



//Objects
router.get('/storage',async (req,res)=>{
    const objects=await Object.find({});
    res.render('storage',{objects})
});

router.get('/new',(req,res)=>{
    res.render('new');
});

router.post('/storage',async (req,res)=>{
    const newobject=new Object(req.body);
    await newobject.save();
    res.redirect('storage');
})

router.delete('/:id',async (req,res)=>{
    const {id}=req.params;
    const deletedobj=await Object.findByIdAndDelete(id);
    res.redirect('storage');
})

router.get('/:id/edit',async (req,res)=>{
    const {id}=req.params;
    const obj = await Object.findById(id);
    res.render('edit',{obj});
})
router.put('/:id',async(req,res)=>{
    const {id}=req.params;
    await Object.findByIdAndUpdate(id,req.body,{runValidators: true, new:true});
    res.redirect('storage');
})
// Login Handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/storage',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})


// Logout Handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
})
module.exports = router;