const express = require('express')

const UserCtrl = require('../controllers/user-ctrl')
const { check, validationResult } = require("express-validator/check");
const Auth = require('../controllers/authmiddleware-ctrl')
const router = express.Router()

router.post('/users/register',
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        }),
        check("username", "Please enter a valid username").not().isEmpty()
    ], 
    UserCtrl.createUser
)
router.post('/users/login', 
    [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Please enter a valid password").isLength({
            min: 6
        })
    ], 
    UserCtrl.signIn
)
router.get('/users/logout', Auth, UserCtrl.signOut )

module.exports = router