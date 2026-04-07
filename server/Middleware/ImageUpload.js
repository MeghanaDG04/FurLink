const multer = require('multer');//handle file upload
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'Uploads/')
    },
    filename:function(req,file,cb){
  
        cb(null,file.fieldname + '-' + Date.now())
    }
})
const upload = multer({storage:storage})
module.exports = upload;