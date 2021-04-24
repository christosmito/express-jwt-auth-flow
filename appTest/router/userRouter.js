const express = require("express");

const User = require("../model/userModel");
const auth = require("express-auth-flow");

const router = express.Router();

router.post("/signup", auth(User).signup);
router.post("/login", auth(User).login);
router.post("/update-password", auth(User).updatePassword);
router.post("/forgot-password", auth(User, {
    apiKey: "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",
    to: "gouc53@gmail.com",
    from: "christosglx@hotmail.com",
    subject: "Reset token",
    text: "This is a test",
    html: "<h1>This is a test</h1>"
}).forgotPassword);
router.post("/reset-password/:token", auth(User).resetPassword);

module.exports = router;