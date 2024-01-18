import nodemailer from 'nodemailer';
import handlebars from "handlebars";
import fs from "fs";
const path = require('path');

const appRoot = path.resolve(__dirname);

let readHTMLFile = function(path) {
    return new Promise((resolve,reject)=>{
  fs.readFile(path, {encoding: "utf-8"}, function (err, html) {
  if (err) {
  reject(err);
  }
  else {
  resolve(html);
  }
  });
    })
  };


function Mail(emailData,replacements,htmlFileName = null){

return new Promise((resolve,reject)=>{
   // create reusable transporter object using the default SMTP transport

   htmlFileName = (htmlFileName) ? htmlFileName : 'send-otp.html'
  
  let filePath = appRoot + '/mail-templates/' + htmlFileName
  let transporter = nodemailer.createTransport({
      service: process.env.MAILER_DRIVER,
      host : process.env.MAILER_HOST,
      port: process.env.MAILER_PORT, //port 587 
      secureConnection: false, // TLS requires secureConnection to be false
      auth: {
          // type:'custom',
          // method:'custom-m',
          user: process.env.MAILER_USER, // email
          pass: process.env.MAILER_PASS // password
      }
      // customAuth:{
      //   'custom-m':myCustomMethod
      // }
  });

  readHTMLFile(filePath)
    .then( async (html)=>{

    var template = handlebars.compile(html);

    var htmlsend= template(replacements);


    const msg = {
      from: emailData.from || process.env.MAILER_USER, // sender address
      to: emailData.to, // list of receivers
      subject: emailData.subject, // Subject line
      html:htmlsend
  }
  // send mail with defined transport object
  const info = await transporter.sendMail(msg);

  resolve('Email Sent!')
  })
  .catch((e)=>{
  reject(e)
  })
  })
  
}

export default Mail;