const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const crypto =require('crypto')

const userModel = require('../models/userModel')
const tokenModel =require('../models/tokenModel')
const generateToken = require('../utils/generateToken')
const sendEmail =require('../utils/email/sendEmail')

const clientURL = process.env.CLIENT_URL;

const authHome = asyncHandler(async (req, res) => {
    res.status(200).json({message:"auth routes: home page"})
})


const registerUser = asyncHandler(async (req, res) => {

    const { email, password } = req.body;


    // check whether the user already exists in database

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
        res.status(409);
        throw new Error('user already exists');
    }

    const user = await userModel.create({ email, password });

    if (user) {
        res.status(200).json({
            _id: user._id,
            email:user.email
        });

    }
    else {
        res.status(400);
        throw new Error("invalid user");
    }

})

const loginUser = asyncHandler(async (req, res) => {
    
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (user && await user.matchPassword(password)) {
        res.status(200).json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(400);
        throw new Error("Invalid email or password")
    }

})

const requestResetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('email does not exist');

    }

    let token = await tokenModel.findOne({ userId: user._id });
    
    if (token) {
        await token.deleteOne();
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, 10);
    
    const newToken = {
        userId: user._id,
        token: hash,
        createdAt:Date.now()
    }

    await tokenModel.create(newToken);

    const link = `${clientURL}/reset-password?token=${resetToken}&id=${user._id}`;
    
    sendEmail(
        user.email,
        "Password Reset Request",
        {   
            email:user.email,
            link:link
        },
        "./template/requestResetPassword.handlebars"
    )
    

    if (link) {
        res.status(200).json({ message: "success" });
    }
    

})

const resetPassword = asyncHandler(async (req, res) => {
    
    const { userId, token, password } = req.body;

    let passwordResetToken = await tokenModel.findOne({ userId });

    if (!passwordResetToken) {
        res.status(404);
        throw new Error('Invalid or Expired Token');
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);

    if (!isValid) {
        res.status(400);
        throw new Error('Invalid or Expired Token');
    }

    const hash = await bcrypt.hash(password, 10);

    await userModel.findByIdAndUpdate(userId, { password: hash });
    

    const updatedUser = await userModel.findById(userId);

    if (updatedUser) {
        res.status(200).json({
            _id: updatedUser._id,
            email:updatedUser.email
        });
        sendEmail(
            updatedUser.email,
            "Password Reset Successfully",
            {
                email:updatedUser.email
            },
            "./template/resetPassword.handlebars"
        )
        await tokenModel.deleteOne(passwordResetToken);
        
    }
    else {
         res.status(404);
        throw new Error('Invalid User');
    }

    

})


module.exports = {
    authHome,
    registerUser,
    loginUser,
    requestResetPassword,
    resetPassword
}
