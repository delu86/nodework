const nodemailer = require('nodemailer');
var smtpConfig = {
    host: '10.99.19.14',
    port: 25
};
var transporter=nodemailer.createTransport(smtpConfig);


exports.sendMail = function (mailOptions) {
  return new Promise(function(resolve,reject){
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
              error ? reject(error) : resolve(info);
        });
  });
};
