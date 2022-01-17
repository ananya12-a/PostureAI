const send = require('gmail-send')({
    //const send = require('../index.js')({
    user: 'postureai.2022@gmail.com',
    // user: credentials.user,               // Your GMail account used to send emails
    pass: 'rkvuuzxqcehvtmme',
    // pass: credentials.pass,               // Application-specific password
    to:   'ananya.aggarwal@gmail.com',
    // to:   credentials.user,               // Send to yourself
    //                                       // you also may set array of recipients:
    //                                       // [ 'user1@gmail.com', 'user2@gmail.com' ]
    // from:    credentials.user,            // from: by default equals to user
    // replyTo: credentials.user,            // replyTo: by default `undefined`
    
    // bcc: 'some-user@mail.com',            // almost any option of `nodemailer` will be passed to it
    //                                       // (but no any processing will be done on them)
    
    subject: 'test subject',
    text:    'gmail-send example 1',         // Plain text
    //html:    '<b>html text</b>'            // HTML
    // files: [ filepath ],                  // Set filenames to attach (if you need to set attachment filename in email, see example below
});
    
module.exports = {
    send
}
