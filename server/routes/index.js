const express = require("express");
const registerUser = require("../controller/registerUser");
const loginUser = require("../controller/loginUser");
const logoutUser = require("../controller/logoutUser");
const userDetails = require('../controller/getUserDetails')
const updateUserDetails = require('../controller/updateUserDetails')
const searchUser = require('../controller/searchUser')

const router = express.Router();

// router.post('/',)

//Register the user
router.post("/register", registerUser);
//Register the user
router.post("/login", loginUser);
//Register the user
router.get("/logout", logoutUser);
//login user details
router.get('/user-details',userDetails)
//update user details
router.post('/update-user',updateUserDetails)
//search user
router.post("/search-user",searchUser)

module.exports = router;
