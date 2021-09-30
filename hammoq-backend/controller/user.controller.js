const Users = require('../module/user.module');
const commonService = require('../common/common');
const jwt = require('jsonwebtoken');
const CONSTANT = require('../common/constant');

/*
TYPE: POST
DETAILS: To create new user
*/
exports.create = (req, res) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.phone) {
        res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.REQUIRED_FIELDS_MISSING });
    } else if (!commonService.isValidateEmail(req.body.email)) {
        res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.INVALID_EMAIL });
    } else {
        Users.findOne({ email: req.body.email, isDeleted: false })
            .then(user => {
                if (user) {
                    res.json({ status: CONSTANT.FAIL, message: "User already exists with same email!" });
                } else {
                    commonService.encryptPassword(req.body.password, (newPassword) => {
                        const User = {
                            firstName: req.body.firstName ? req.body.firstName : '',
                            lastName: req.body.lastName ? req.body.lastName : '',
                            email: req.body.email ? req.body.email : '',
                            phone: req.body.phone,
                            isDeleted: false,
                            city: req.body.city ? req.body.city : '',
                            state: req.body.state ? req.body.state : '',
                            country: req.body.country ? req.body.country : '',
                            password: newPassword,
                            gender: req.body.gender ? req.body.gender : ''
                        };
                        Users.create(User, function (err, result) {
                            if (err)
                                res.json({ status: "fail", message: "Fail to added Data!", err: err });
                            else
                                res.json({ status: "success", message: "Registration successfully!!!", data: result });
                        });
                    });
                }
            });
    }
}


/*
TYPE: POST
DETAILS: To Login user using email
*/
exports.login = (req, res) => {
    var email = req.body.email;
    if (commonService.isUndefinedOrNull(req.body.email)) {
        return res.json({ status: CONSTANT.FAIL, message: "Email address is required!" });
    } else if (commonService.isUndefinedOrNull(req.body.password)) {
        return res.json({ status: CONSTANT.FAIL, message: "Password is required!" });
    } else {
        Users.findOne({ email, isDeleted: false })
            .then(user => {
                if (user) {
                    commonService.decryptPassword(user.password, (decryptedPassword) => {
                        if (req.body.password == decryptedPassword) {
                            var userDetails = {
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                _id: user._id,
                                photo: user.photo ? user.photo : ''
                            }
                            const token = jwt.sign(userDetails, process.env.superSecret, {
                                expiresIn: 2592000
                            });
                            return res.send({ status: CONSTANT.SUCCESS, message: CONSTANT.MESSAGE.LOGIN_SUCCESS, data: userDetails, token: 'Basic ' + token });
                        } else {
                            res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.PASSOWRD_INVALID });
                        }
                    });
                } else {
                    res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.EMAIL_INVALID });
                }
            }).catch(err => {
                return res.send({
                    status: CONSTANT.FAIL,
                    message: err.message || "Some error occurred while retrieving user."
                });
            });
    }
}

/*
TYPE: POST
DETAILS: To Login user using google
*/
exports.loginUsingGoogle = (req, res) => {
    const UserObj = {
        firstName: req.body.firstName ? req.body.firstName : '',
        lastName: req.body.lastName ? req.body.lastName : '',
        email: req.body.email ? req.body.email : '',
        phone: req.body.phone,
        isDeleted: false,
        city: req.body.city ? req.body.city : '',
        state: req.body.state ? req.body.state : '',
        country: req.body.country ? req.body.country : '',
        gender: req.body.gender ? req.body.gender : ''
    };
    Users.findOne({ email: req.body.email, isDeleted: false })
        .then(user => {
            if (user) {
                var userDetails = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    photp: user.photo ? user.photo : '',
                }
                const token = jwt.sign(userDetails, process.env.superSecret, {
                    expiresIn: 2592000
                });
                return res.send({ status: CONSTANT.SUCCESS, message: CONSTANT.MESSAGE.LOGIN_SUCCESS, data: userDetails, token: 'Basic ' + token, isRegistered: true });
            } else {
                Users.create(UserObj, function (err, result) {
                    if (err)
                        res.send({ status: "fail", message: "Fail to login!", err: err });
                    else {
                        var userDetails = {
                            _id: result._id,
                            firstName: result.firstName,
                            lastName: result.lastName,
                            email: result.email,
                            photp: result.photo ? result.photo : '',
                        }
                        const token = jwt.sign(userDetails, process.env.superSecret, {
                            expiresIn: 2592000
                        });
                        return res.send({ status: CONSTANT.SUCCESS, message: CONSTANT.MESSAGE.LOGIN_SUCCESS, data: userDetails, token: 'Basic ' + token, isRegistered: true });
                    }
                });
            }
        });
}

/*
TYPE: POAT
DETAILS: To update user by Id
*/
exports.update = (req, res) => {
    if (!req.params.Id) {
        return res.send({
            status: "fail",
            message: "User not found with id "
        });
    }
    Users.findOne({ email: req.body.email,_id: { $ne: req.params.Id }, isDeleted: false })
        .then(user => {
            if (user) {
                res.json({ status: CONSTANT.FAIL, message: "User already exists with same email!" });
            }
            else {
                if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.phone) {
                    res.json({ status: CONSTANT.FAIL, message: CONSTANT.MESSAGE.REQUIRED_FIELDS_MISSING });
                } else {
                    if (!commonService.isUndefinedOrNull(req.body.password)) {
                        commonService.encryptPassword(req.body.password, (newPassword) => {
                            req.body.password = newPassword;
                        });
                    } else {
                        delete req.body["password"];
                    }
                    Users.findByIdAndUpdate(req.params.Id, { $set: req.body }, { new: true }, function (err, result) {
                        if (err) {
                            res.send({ status: "error", message: err });
                        }
                        res.send({ status: "success", message: "User is Updated Successfully!!!" });
                    });
                }
            }
        });
}



/*
TYPE: GET
DETAILS: To get user by Id
*/
exports.getUserDataById = (req, res) => {
    if (!req.params.Id) {
        return res.send({ status: CONSTANT.FAIL, message: "Data not found with this ID" + req.params.Id });
    } else {
        Users.findById(req.params.Id)
            .then(user => {
                if (user) {
                    res.send({ status: CONSTANT.SUCCESS, message: "Data found", data: user });
                } else {
                    return res.send({ status: CONSTANT.FAIL, message: "Data not found" });
                }
            })
    }
}

/*
TYPE: GET
TODO: API to get all User
*/
exports.findAll = (req, res) => {
    var query = {};
    query['isDeleted'] = false;

    Users.find(query).sort({ createdAt: -1 })
        .lean().exec(function (err, users) {
            if (err) {
                res.send({ status: CONSTANT.ERROR, message: err });
            } else {
                res.json({ status: CONSTANT.SUCCESS, message: "User data found Successfully", data: users });
            }
        });
}

// Update a Users profile photo identified by the Id in the request
exports.updateUserProfilePhoto = (req, res) => {
    // Validate Request
    if (!req.params.Id) {
        return res.send({
            status: CONSTANT.FAIL,
            message: "User not found with id " + req.params.Id
        });
    }
    var folder = CONSTANT.FOLDER_USER_IMG;
    var fileName = req.params.Id;

    // Common callback function for file upload in project folder
    commonService.fileUpload(folder, fileName, req, res, (uploadError, uploadResult) => {
        if (uploadError) {
            return res.send({ status: CONSTANT.FAIL, message: "Failed to upload an image" + uploadError });
        } else {
            if (uploadResult && uploadResult[0].filename) {
                var body = {
                    "photo": "/" + uploadResult[0].filename
                };
                if (body) {
                    Users.findByIdAndUpdate(req.params.Id, { $set: body }, { new: true }, function (err, Result) {
                        if (err) {
                            return res.send("Some error occurred while updating the user profile photo." + err);
                        }
                        return res.send({ status: CONSTANT.SUCCESS, message: CONSTANT.MESSAGE.PROFILE_PHOTO_UPLODED });
                    });
                } else {
                    return res.send({ status: CONSTANT.FAIL, message: "Failed to upload an image" });
                }
            } else {
                return res.send({ status: CONSTANT.FAIL, message: "Failed to upload an image" });
            }
        }
    })
};
