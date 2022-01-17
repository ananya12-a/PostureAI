const app = require('express').Router();
const { verifyEmail, expireOTP, create5minToken, storeFailedOTP, emailExists, usernameExists, verifyLogin, getUserId, create_userTable_entry, verifyToken, OTPExists, createOTP, update_userTable_entry, createToken , OTPget} = require('./database/redis-db.js');
const {send} = require('./emailer.js');

app.post("/login", async (req, res) => {
    
    if (req.body.username && req.body.password) {
        const username = req.body.username;
        const password = req.body.password;
        const token = await verifyLogin(username, password);
        console.log(token)
        res.json({
            status: token ? true : false,
            token:  token ? token: "",
            user_id: token ? await getUserId(username): "",
        });
    }
    else res.status(404).send("Sorry can't find username/password!")
});

app.post('/tokenVerify', async (req, res) => {
    //console.log(await getUserId(req.body.username), req.body.token, await verifyToken(await getUserId(req.body.username), req.body.token))
    if (req.body.username && req.body.token) {
        return res.json({
            tokenValid: await verifyToken(await getUserId(req.body.username), req.body.token) === 1
        });
    }
    res.sendStatus(404)
});

app.post("/signup", async (req, res) => {
    if (req.body.username && req.body.password && req.body.email){
        const username = req.body.username;
        if (await usernameExists(username)) return res.status(401).json({error: "Username Exists"})
        const password = req.body.password;
        const email = req.body.email
        await create_userTable_entry(username, undefined, password, email)
        const token = await createToken(await getUserId(username))

        res.json({
            status: token ? true : false,
            token:  token ? token: "",
            user_id: token ? await getUserId(username): "",
        });
    }
    else res.status(404).send("Sorry can't find user data!")
});

app.get("/signup-helper/username/:username", async (req, res) => {
    if (await usernameExists(req.params.username)) return res.json({exists: true});
    else res.json({exists: false});
}) 

app.get("/signup-helper/email/:email", async (req, res) => {
    if (await emailExists(req.params.email)) return res.json({exists: true});
    else res.json({exists: false});
}) 

app.get('/forgot-password/:username/:email', async (req,res) => {
    if (req.params.username && req.params.email){
        const username = req.params.username
        const email = req.params.email
        const userId = await getUserId(username)
        if (await verifyEmail(email, userId)){
            console.log(username, email)
            if (!await OTPExists(userId)) OTP = await createOTP(userId)
            else OTP = await OTPget(userId)
            console.log(OTP)
            send({ 
                subject: 'Reset your PostureAI password',         
                to: email,
                html: `
                <!doctype html>
                <html lang="en-US">
                
                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Reset Password Email Template</title>
                    <meta name="description" content="Reset Password Email Template.">
                    <style type="text/css">
                        a:hover {text-decoration: underline !important;}
                    </style>
                </head>
                
                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <!--100% body table-->
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                        style="font-family: 'Open Sans', sans-serif;">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                    align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center;">
                                          <a title="logo" target="_blank">
                                            <img width="60" src="../frontend/src/assets/logo.png" title="logo" alt="logo">
                                          </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                            requested to reset your password</h1>
                                                        <span
                                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                            Hi ${username}, seems like you forgot your password for PostureAI. Here the OTP you can use to log back in!
                                                        </p>
                                                        <a
                                                            style="text-decoration:none !important; font-weight:500; margin-top:35px; color:#000;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:10px;">${OTP}</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <!--/100% body table-->
                </body>
                
                </html>`//`<h1>Your OTP is ${OTP}</h1>`,
            }, function (err, res, full) {
                if (err) return console.log('send() callback returned: err:', err);
                console.log('send() callback returned: res:', res);
            });
            res.status(200).send()
            /*res.json({
                status: token ? true : false,
                reset_token:  token ? token: "",
            });*/
        }
        else res.status(403).send("Incorrect credentials")
    }
    else res.status(404).send("Sorry can't find user data!") 
})

app.get('/verifyOTP/:otp/:username', async (req,res) => {
    if (req.params.otp){
        const userId = await getUserId(req.params.username)
        
        if (await OTPget(userId) === req.params.otp){
            res.json({
                token: await create5minToken(userId),
                username: req.params.username,
            })
        }
        else{
            await storeFailedOTP(userId, req.params.otp)
        }
    }
})

app.post('/reset-password/:token', async (req,res) =>{
    if (req.params.token && req.body.new_password && verifyToken(await getUserId(req.body.username), req.params.token)){
        const password = req.body.new_password
        expireOTP(await getUserId(req.body.username))
        await update_userTable_entry(await getUserId(req.body.username), {'password': password})
        //res.redirect(307, '/login') //doesn't work
        res.status(200).send()
    }
    else res.status(404)
})

module.exports = app;