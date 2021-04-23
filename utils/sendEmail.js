const nodemailer = require("nodemailer");

async function sendEmail(options) {
    console.log("I AM HERE")

    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io", //process.env.EMAIL_HOST,
        port: 25, //process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: "233c50b2e181a4",//process.env.EMAIL_USERNAME,
            pass: "5cc777b4816134"//process.env.EMAIL_PASSWORD
        }
    });

    console.log("I AM HERE")

    const mailOptions = {
        from: "Authentication package <authpackage@test.com>",
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    try{
        await transporter.sendMail(mailOptions);
    } catch(error) {
        console.log("ERROR sending email");
        console.log(error);
    }
}

module.exports = sendEmail;