const express = require('express')
const bp = require("body-parser");
const cors = require('cors');

const app = express()
const port = 3000 //|| args['port']


app.use((req, res, next=undefined) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Credentials', false)
  if (next) next();
})

// Body Parser allows us to process json/url-encoded requests properly
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// Allows us to use our API on websites not on the same origin
app.use(cors());

// Add in routers
app.use('/config', require('./config.js'))
//app.use('/accounts', )
//app.use('/mff', )
//app.use('/fetch', )

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})