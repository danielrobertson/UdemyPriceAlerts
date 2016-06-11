var nodemailer = require('nodemailer');

// default SMTP transport
var transporter = nodemailer.createTransport(process.env.UDEMY_PRICE_ALERTS_SMPT_TRANSPORT);

/** 
 * Pushes an email notification out to all subscribed users about the price drop 
 *
 * title - course title 
 * oldPrice - previous price 
 * newPrice - current price
 */
exports.notifySubscribers = function(title, oldPrice, newPrice) {
    // get all users from database 
    var users = "<" + "danielrobertson733@gmail.com" + ">";

    var mailOptions = {
        from: process.env.UDEMY_PRICE_ALERTS_EMAIL,
        to: users,
        subject: "Udemy's " + title + " $" + oldPrice + " → $" + newPrice,
        html: "Udemy's " + title + " has decreased from $" + oldPrice + " to $" + newPrice // html body
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};