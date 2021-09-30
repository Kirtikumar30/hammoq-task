const express = require('express');
const router = express.Router();
const auth = require('../common/authentication');
const User = require('../controller/user.controller');

router.post('/create', User.create);
router.post('/login', User.login);
router.post('/loginWithGoogle',User.loginUsingGoogle);
router.get('/getUserDataById/:Id', auth, User.getUserDataById);
router.post('/updateUserById/:Id', auth, User.update);
router.get('/getAll', auth, User.findAll);
router.post('/updateUserProfilePhoto/:Id', auth, User.updateUserProfilePhoto);

module.exports = router;