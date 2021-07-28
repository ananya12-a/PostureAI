const app = require('express').Router()

app.get('/login', (req,res) =>{
    console.log('get');
    res.sendFile(__dirname + '/login.html')
})

app.post('/login', (req, res) => {
    if (req.body.username === 'ananya' && req.body.password === 'password') {
        res.send('Verified')
    } 
    else {
        res.send("<h3>Error: Invalid login credentials.</h3>").status(401)
    }
});

module.exports = app