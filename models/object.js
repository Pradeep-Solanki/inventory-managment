const mongoose = require('mongoose');

const objectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price:{
        type:Number,
        required:true
    }
},{collection:'Objects'})

const Object = mongoose.model('Object', objectSchema);

module.exports = Object;