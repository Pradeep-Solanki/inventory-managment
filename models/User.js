const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    EId:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
    
},{collection:'Users'});

const User = mongoose.model('User',UserSchema);

module.exports = User;