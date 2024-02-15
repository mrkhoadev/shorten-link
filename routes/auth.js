var express = require('express');
var router = express.Router();
const passport = require("passport");

const loginController = require("../controllers/auth/login.controller");
const registerController = require("../controllers/auth/register.controller");
const forgotPasswordController = require('../controllers/auth/forgotPassword.controller');
const resetPasswordController = require('../controllers/auth/resetPassword.controller');
/* GET home page. */
const setLayout = (layoutName) => {
    return (req, res, next) => {
        res.locals.layout = layoutName;
        next();
    };
};
router.get('/', setLayout("auth/layout"), (req, res, next) => {
    res.redirect("/auth/login")
});

router.get('/login', setLayout("auth/layout"), loginController.index);
router.post("/login", loginController.handleLogin);
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    res.redirect("/");
});
router.get("/google/callback", loginController.handleLoginGoogle);


router.get('/register', setLayout("auth/layout"), registerController.index);
router.post('/register', registerController.handleRegister);

router.get('/forgot-password', setLayout("auth/layout"), forgotPasswordController.index);
router.post('/forgot-password', forgotPasswordController.handleForgotPassword);

router.get('/reset-password/:token', setLayout("auth/layout"), resetPasswordController.index);
router.post('/reset-password/:token', resetPasswordController.handleResetPassword);


module.exports = router;
