const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    email: String,
    userName: String,
    password: String,
    confirmPassword: String
})

module.exports = mongoose.model("User", userSchema);
