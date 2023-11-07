const express = require("express")
const router = express.Router()

const { authHome,
    registerUser,
    loginUser,
    requestResetPassword,
    resetPassword } = require('../controllers/authController');


router.get('/', authHome);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/request-reset-password',requestResetPassword);
router.post('/reset-password', resetPassword);

module.exports =router