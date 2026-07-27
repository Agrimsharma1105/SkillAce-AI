const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,"Account already exists with this username"],
        unique:true
    },
    email:{
        type:String,
        required:[true,"Account already exists with this email id"],
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
     geminiApiKey: {
        type: String,
        default: ""
    }
})


const userModel = mongoose.model("users",userSchema);

module.exports = userModel;