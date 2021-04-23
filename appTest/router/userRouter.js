const express = require("express");

const User = require("../model/userModel");
const auth = require("express-auth-flow");

const router = express.Router();

router.post("/signup", auth(User).signup);
router.post("/login", auth(User).login);
router.post("/update-password", auth(User).updatePassword);
router.post("/forgot-password", auth(User).forgotPassword);
router.post("/reset-password/:token", auth(User).resetPassword);

module.exports = router;