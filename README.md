# Express-jwt-Auth-Flow
Express-jwt-auth-flow is a package for authentication flow based on jwt. It was
created to be used with Express.js and Mongodb. The functionality that this package offers is: signup, login, logout, update password, forgot passwrod and logout. 

## Install

```bash
# with npm
npm install express-auth-flow
```

## Usage

First you must create a model for your users with any name you want, and must have at least the below fields (the names must be exactly the same)
- email
- username
- password

A very basic example is demonstrated below using mongoose (It is highly recommended to validate every field)

```
//Model file
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    email: String,
    username: String,
    password: String
})

module.exports = mongoose.model("User", userSchema);
````


Now in you router file you must require your user's model and the express-auth-flow, and make routes as below. The paths must be the same in order the package to recognize them.
The emails are sent via [sendgrid](https://sendgrid.com/) and you must login for a free account and create an api key(Settings -> API Keys). The options argument are:
- apiKey: The key that you have created from [sendgrid](https://sendgrid.com/)
- from: Your company's/app's email(It must be the one that you have verified on sendgrid)
- subject: The email's subject
- text: The raw message
- html: The message formated with html

An example is demonstrated below

```
//Router file
const express = require("express");

const User = require("../model/userModel");
const auth = require("express-auth-flow");

const router = express.Router();

options = {
    apiKey: process.env.SENDGRID_API_KEY,
    from: "christosglx@hotmail.com",
    subject: "Reset token",
    text: "This is a test",
    html: "<h1>This is a test</h1>"
}

router.post("/signup", auth(User).signup);
router.post("/login", auth(User).login);
router.post("/update-password", auth(User).updatePassword);
router.post("/forgot-password", auth(User, options).forgotPassword);
router.post("/reset-password/:token", auth(User).resetPassword);

module.exports = router;
```