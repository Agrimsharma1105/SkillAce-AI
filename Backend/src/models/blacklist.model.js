const mongoose = require("mongoose");

const tokenBlacklistScehma = mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required to get blacklisted"]
    }
},{ timestamps:true
})

const tokenBlacklistModel = mongoose.model("blacklistedtokens",tokenBlacklistScehma);


module.exports=tokenBlacklistModel