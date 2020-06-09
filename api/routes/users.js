const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const checkAuth = require("../middleware/check-auth");


const userControllers = require("../controllers/c-user");

router.post("/signup",userControllers.user_signup);

router.post("/login",userControllers.user_login);

router.delete("/:userId",checkAuth,userControllers.user_delete);


module.exports = router