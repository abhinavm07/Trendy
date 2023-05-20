const nodemailer = require("nodemailer");

const {SYSTEM_EMAIL = 'support@trendy.com', SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD} = process.env;

const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
    }
});

function sendEmail(to, subject = 'An email from Trendy', content = '', from = SYSTEM_EMAIL, isHtml = true) {
    const html = isHtml ? content : `<p>${content}</p>`;

    const mailOptions = {
        from: from || SYSTEM_EMAIL,
        to,
        subject,
        html
    }

    return transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {sendEmail};