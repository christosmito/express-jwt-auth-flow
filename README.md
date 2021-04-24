# Express-jwt-Auth-Flow
Express-jwt-auth-flow is a package for authentication flow based on jwt. It was
created to be used with Express.js and Mongodb. Most web apps are required at least
signup, login and logout functionality and in order to not the programmers spend time
writing the same code for every new project, this package was created for this purpose.
The functionality that this package offers is: signup, login, logout, update password,
forgot passwrod and logout. 

## Install

```bash
# with npm
npm install express-auth-flow
```

## Usage

First you must create a model for your users with any name you want, and must has at least the below fields (the names must be exactly the same)
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
    userName: String,
    password: String
})

module.exports = mongoose.model("User", userSchema);
````


Now in you router file you must require your user's model and the express-auth-flow, and make a routes as below. The paths must be the same. The emails are sent via [sendgrid](https://sendgrid.com/) and you must login for a free account and create an api key. The options argument are:
- apiKey: The key that you have created from [sendgrid](https://sendgrid.com/)
- from: Your company's/app's email(It must be the one tha you have verified in sendgrid)
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