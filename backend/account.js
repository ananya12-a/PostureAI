const app = require('express').Router();
const { get_submissionTable_entry, usernameExists, verifyLogin, getUserId, create_userTable_entry, verifyToken, get_userTable_entry, createOneTimeToken, update_userTable_entry, createToken } = require('./database/redis-db.js');

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

app.get('/forgot-password/:username/:email', async (req,res) => {
    if (req.params.username && req.params.email){
        const username = req.params.username
        const email = req.params.email
        const userId = getUserId(username)
        console.log(username, email)
        const token = await createOneTimeToken(userId)
        //sendEmail(email, token)
        res.json({
            status: token ? true : false,
            reset_token:  token ? token: "",
        });
    }
    else res.status(404).send("Sorry can't find user data!") 
})

app.post('/reset-password/:token', async (req,res) =>{
    if (req.params.token && req.body.new_password){
        const password = req.body.new_password
        console.log(await getUserId(req.body.username))
        //verify one-time token
        await update_userTable_entry(await getUserId(req.body.username), {'password': password})
        //res.redirect(307, '/login') //doesn't work
    }
    else res.status(404)
})

module.exports = app;