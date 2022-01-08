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

app.get('/',function(req,res){  
    res.sendFile(__dirname + "/index.html");  
});

app.post('/uploadfile', upload.single('video'), (req,res)=> {  
    console.log(req.file)
    console.log(req.body.formDataObj)
    res.sendStatus(200)
    //console.log(req.body.formDataObj.getAll('video'))
    /*for (var key of req.body.formDataObj.entries()) {
        console.log(key[0] + ', ' + key[1]);
    }  */
});  

module.exports = app;