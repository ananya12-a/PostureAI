const app = require('express').Router(); 
var multer = require('multer');
var uuid = require('uuid').v4;
const { create_submissionTable_entry, get_userTable_entry } = require('./database/redis-db.js');
var fs = require('fs');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("req", req.params)
    
    var dir = `./submissions/${req.params.userID}/`
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir)
  },
  filename: async (req, file, cb) => {
    req.params.subID = uuid();
    cb(null, `${req.params.subID}.mp4`)
  }
})

var upload = multer({ storage: storage });


app.post('/uploadfile/:userID/:exName', (req, res, next) => {
  console.log(req.params)
  req.body = req.body.formDataObj
  next()
}, upload.single('video'), async (req,res)=> {  
    
    const ex_name = req.params.exName.split("(")[0].slice(0,-1).toLowerCase()
    const ori = req.params.exName.split("(")[1].split(")")[0]
    console.log("ex", ex_name, ori)
    const username = (await get_userTable_entry(req.params.userID,['username'])).username
    const subID = await create_submissionTable_entry(ex_name, username, req.params.subID, undefined, ori)
    
    //console.log("ID", req.body.userID)
    //console.log("username", username)
    //console.log(req.file)//.formDataObj.file)
    //const sub = await create_submissionTable_entry(ex_name, username, undefined, undefined, ori)
    //console.log("sub", sub)
    //req.file['subID'] = sub
    //console.log(req.formDataObj)
    res.sendStatus(200)
    //console.log(req.formDataObj.getAll('video'))
    /*for (var key of req.formDataObj.entries()) {
        console.log(key[0] + ', ' + key[1]);
    }  */
});  

module.exports = app;