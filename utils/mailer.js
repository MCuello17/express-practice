const nodemailer = require('nodemailer');

// Mailer configuration
module.exports = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "8ac2f0c66dcdf0",
            pass: "0d55b3873715a6"
        }
    }
);