const { request } = require("express");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
// Welcome Page
router.get('/',(req,res)=>res.render('welcome'));


module.exports = router;
//User Model
const User = require('../models/User');
const Object = require('../models/object');
//Login Page
router.get('/login',(req,res)=>res.render('Login'));


//Register Page
router.get('/register',(req,res)=>res.render('Register'));

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
    const deletedEmp=await Employee.findByIdAndDelete(id);
    res.redirect('storage');
})

//Register Handle
router.post('/register',(req,res)=>{
    const {name,EId,password,password2}=req.body;
    let errors = [];

    //Check all fields filled
    if(!name||!password||!password2||!EId)
        {
            errors.push({msg: 'Please fill all fields'});
        }
    //Check if passwords match
    if(password!=password2)
    {  
    errors.push({msg: 'Passwords do not match'});
    }
    //Check password length
    if(password.length<8)
    {
        errors.push({msg:'Password should of minimum 8 characters'});
    }
    if(errors.length>0)
    {
        res.render('register',{
            errors,
            name,
            EId,
            password,
            password2
        });
    }
    else
    {
        //Validation
        User.findOne({EId:EId})
        .then(user =>{
            if(user){
                //if User exists
                errors.push({msg:'Account for the given Employee ID already exists'})
                res.render('register',{
                    errors,
                    name,
                    EId,
                    password,
                    password2
                });
            }
            else
            {
                const newUser =new User({
                    EId,
                    name,
                    password
                });
                //Adding salt to password
                bcrypt.genSalt(10,(err,salt)=>
                bcrypt.hash(newUser.password,salt,(err, hash)=>{
                    if(err) throw err; 
                    //Set pass to hash
                    newUser.password=hash;
                    newUser.save()
                    .then(user=>{
                        req.flash('success_msg','You are now registered!');
                        res.redirect('/users/login');
                        
                    })
                    .catch(err=> console.log(err));
                }))
            }
        });
    }
    });
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