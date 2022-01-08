const app = require('express').Router(); 
const upload = require('multer')();
/*var storage =   multer.diskStorage({  
    destination: function (req, file, callback) {  
        callback(null, './uploads');  
    },  
    filename: function (req, file, callback) {  
        callback(null, file.originalname);  
    }  
});*/

//var upload = multer({ storage : storage}).single('video');  

var path = require('path')

/*var storage = upload.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})
*/

app.post('/uploadfile', upload.single('video'), (req,res)=> {  
    console.log(req.file)
    //req.file['userID'] = req.body.userID
    console.log(req.body.formDataObj)
    res.sendStatus(200)
    //console.log(req.body.formDataObj.getAll('video'))
    /*for (var key of req.body.formDataObj.entries()) {
        console.log(key[0] + ', ' + key[1]);
    }  */
});  

module.exports = app;