const userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require('../models/blacklist.model');
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000 // 1 day
};
/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the requ
 * @access Public
 */

async function registerUserController(req,res){
    const {username,email,password} = req.body;

    if(!username||!email||!password){
        return res.status(400).json({
            message:"Username,email & password are required to register"
        })
    }
    
    const isUserAlreadyExists= await userModel.findOne({
        $or:[{username},{email}]
    })

    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"User already exists"
        })
    }
    const hash = await bcrypt.hash(password,10);

    const user = await userModel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign(
        {
        id:user._id,
        username:user.username
    },
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
   );

   res.cookie("token",token, cookieOptions);

   res.status(201).json({
    message:"User registered Successfully",
   user: {
    id: user._id,
    username: user.username,
    email: user.email,
    hasApiKey: !!user.geminiApiKey
}
   })
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */

async function loginUserController(req,res){
    const{email,password}=req.body;

    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const isPasswordValid= await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Passowrd is incorrect"
        })
    }

     const token = jwt.sign(
        {
        id:user._id,
        username:user.username
    },
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
   );

   res.cookie("token",token, cookieOptions);

   res.status(201).json({
    message:"User LoggedIn Successfully",
    user: {
    id: user._id,
    username: user.username,
    email: user.email,
    hasApiKey: !!user.geminiApiKey
}
   })
}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */

async function logoutUserController(req,res){
    const token = req.cookies.token;
    if(token){
        await tokenBlacklistModel.create({token});
    }

    res.clearCookie("token", cookieOptions);
    res.status(200).json({
        message:"User Logged Out successfully",
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details.
 * @access private
 */


async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)
 res.status(200).json({
    message:"User details fetched sucessfully",
  user: {
    id: user._id,
    username: user.username,
    email: user.email,
    hasApiKey: !!user.geminiApiKey
}
})

}

async function saveApiKeyController(req, res) {

    const { apiKey } = req.body;

    if (!apiKey) {
        return res.status(400).json({
            message: "API Key is required"
        });
    }

    await userModel.findByIdAndUpdate(
        req.user.id,
        {
            geminiApiKey: apiKey
        }
    );

    return res.status(200).json({
        message: "API Key saved successfully"
    });
}
module.exports={registerUserController,loginUserController,logoutUserController, getMeController, saveApiKeyController}