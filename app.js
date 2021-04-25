const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");

function auth(model, options) {
    async function signup(req, res, next) {
        let {email, username, password, confirmPassword} = req.body;

        if(!email) {
            return sendFailResponse(res, 400, "Email is required");
        }

        if(!username) {
            return sendFailResponse(res, 400, "username is required");
        }

        if(!password) {
            return sendFailResponse(res, 400, "Password is required");
        }

        if(!confirmPassword) {
            return sendFailResponse(res, 400, "Password confirmation is required");
        }

        if(!arePasswordsEqual(password, confirmPassword)) {
            return sendFailResponse(res, 400, "The passwords do not match");
        }

        password = await bcrypt.hash(password,  12);

        try{
            const newUser = await model.create({
                email: email,
                username: username,
                password: password,
                confirmPassword: undefined
            });

            const token = createToken(newUser._id); 

            sendTokenResponse(res, 201, token);
        } catch(error) {
            sendFailResponse(res, 400, "The user can not be created, please try again");
        }
    }

    async function login(req, res, next){
        const { email, password } = req.body;

        if( !email || !password ) {
            return sendFailResponse(res, 400, "Please provide email and password");
        }

        try{
            const user = await model.findOne({ email: email });

            if(!user) {
                return sendFailResponse(res, 401, "Incorrect email");
            }

            const isSame = await bcrypt.compare(password, user.password);

            if(!isSame) {
                return sendFailResponse(res, 401, "Incorrect password");
            }

            const token = createToken(user._id);

            sendTokenResponse(res, "200", token);
        } catch(error) {
            sendFailResponse(res, 400, "The user can not be logged in. please try again");
        }
    }

    async function forgotPassword(req, res, next) {
        const { email } = req.body;

        if(!email) {
            return sendFailResponse(res, 400, "Please provide an email");
        }
        options.to = email;

        const user = await  model.findOne({ email });
        if( !user ) {
            sendFailResponse(res, 404, "There is no user with that email");
        }

        const resetToken = crypto.randomBytes(32).toString("hex"); 
        crypto.createHash("sha256").update(resetToken).digest("hex");
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = Date.now() + 10 * 60 *1000;
        await user.save({ validateBeforeSave: false }); //deactivate all the validators

        try {
            await sendEmail(req, options, resetToken)
            sendSuccessResponse(res, 200, "Email was sent");
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires =  undefined;
            await user.save({ validateBeforeSave: false }); //deactivate all the validators
            sendFailResponse(res, 500, "The email could not be sent. Please try again.");
        }
    }

    async function resetPassword(req, res, next) {
        const { password, confirmPassword } = req.body;

        if( !password || !confirmPassword ) {
            return sendFailResponse(res, 400, "Please provide password and confirmation password");
        }

        const hashedToken = crypto.createHash("sha256")
        .update(req.params.token)
        .digest("hex");

        const user = await model.findOne({ 
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() } 
        }); 

        if( !user ) {
            return sendFailResponse(res, 400, "Token was expired. Please try again");
        }

        if(!arePasswordsEqual(password, confirmPassword)) {
            return sendFailResponse(res, 400, "The passwords do not match");
        }

        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires =  undefined;
        await user.save(); 

        sendSuccessResponse(res, 200, "You are now be able to login again");
    }

    async function updatePassword(req, res, next) {
        const { email, password, newPassword, confirmNewPassword } = req.body;

        if(!email) {
            return sendFailResponse(res, 400, "Email is required");
        }

        if(!password) {
            return sendFailResponse(res, 400, "Your current password is required");
        }

        if(!newPassword) {
            return sendFailResponse(res, 400, "New password is required");
        }

        if(!confirmNewPassword) {
            return sendFailResponse(res, 400, "Password confirmation is required");
        }

        if(!arePasswordsEqual(newPassword, confirmNewPassword)) {
            return sendFailResponse(res, 400, "The passwords do not match");
        }

        const user = await model.findOne({ email });
        if( !user || !(await bcrypt.compare(password, user.password)) ) {
            return sendFailResponse(res, 401, "Incorrect email or password");
        }

        if(!arePasswordsEqual(newPassword, confirmNewPassword)) {
            return sendFailResponse(res, 400, "The new passwords do not match");
        }

        user.password = await bcrypt.hash(newPassword,  12);
        await user.save(); 

        sendSuccessResponse(res, 200, "Your password was successfully changed");
    }

    async function logOut(req, res, next) {
        res.cookie("jwt", "loggedout", {
            expires: new Date(0), //Date.now() + 10000
            httpOnly: true 
        });
        
        sendSuccessResponse(res, 200, "You are successfully logged out");
    }

    return {
        signup,
        login,
        forgotPassword,
        resetPassword,
        updatePassword,
        logOut
    }
}

function arePasswordsEqual(password, confirmPassword) {
    if(password !== confirmPassword) {
        return false;
    } 
    return true;
}

function createToken(id) {
    try {
        return jwt.sign({ id }, "a-secure-and-l0ng-secret-f0r-expressjs-jwt-auth-npm-package");
    } catch (error) {
        console.log("TOKEN CREATION ERROR");
        console.log(error);
    } 
}

async function sendEmail(req, options, resetToken) {
    sgMail.setApiKey(options.apiKey);
    const resetURL = `${req.protocol}://${req.get("host")}/users/reset-password/${resetToken}`;
    const message = {
        to: options.to,
        from: options.from,
        subject: options.subject,
        text: options.text,
        html: options.html + `<p>${resetURL}</p>`
    }
    await sgMail.send(message);
}

function sendTokenResponse(res, statusCode, token) {
    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 1000),
        httpOnly: true 
    }
    if(process.env.NODE_ENV === "production") {
        cookieOptions.secure = true;
    } 
     
    res.cookie("jwt", token, cookieOptions);

    res.status(statusCode).json({
        status: "Success",
        token
    })
}

function sendSuccessResponse(res, statusCode, message) {
    res.status(statusCode).json({
        status: "Success",
        message
    })
}

function sendFailResponse(res, statusCode, message) {
    res.status(statusCode).json({
        status: "Fail",
        message
    })
}

module.exports = auth;