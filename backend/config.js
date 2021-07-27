const app = require('express').Router()

app.get('/:type/:id', (req, res) => {
    if (req.params.type==="html")
    res.send(`Hello World!<br>${req.params.id}`)
    else if (req.params.type==="json")
    res.json({test: true, try: 1, id: req.params.id})
    else 
    res.send("<h3>Error: Could not parse the type of request.</h3> <p>Use html or json.</p>").status(404)
})

app.get('/test-list', (req, res) => {
    console.log("[GET] /test-list Requested Test List")
    res.json(['a', 'b', 'c'])
})

module.exports = app