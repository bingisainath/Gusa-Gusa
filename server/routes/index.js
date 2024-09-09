const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const registerUser = require("../controller/registerUser");
const loginUser = require("../controller/loginUser");
const logoutUser = require("../controller/logoutUser");
const userDetails = require("../controller/getUserDetails");
const updateUserDetails = require("../controller/updateUserDetails");
const searchUser = require("../controller/searchUser");
const CreateGroup = require("../controller/CreateGroup");
const tokenVerification = require("../middleware/tokenVerification");

const router = express.Router();

// router.post('/',)

//Register the user
router.post("/register", registerUser);
//Login the user
router.post("/login", loginUser);
//validate token
router.post("/validate-token", tokenVerification);
//logout the user
router.get("/logout", logoutUser);
//get the user details
router.get("/user-details", userDetails);
//update user details
router.post("/update-user", updateUserDetails);
//search user
router.post("/search-user", searchUser);
//create group
router.post("/create-group", authMiddleware, CreateGroup);

module.exports = router;
