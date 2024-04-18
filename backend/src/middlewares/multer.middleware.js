// uploading the file with the help of multer middleware to local disk storage

import multer from "multer"

// storing the location of the localstorage where the file is to be uploaded
const storage = multer.diskStorage({
    // deciding the location of the localstorage where the file has to be kept.
    destination:function(req,file,cb){
        cb(null,'./public/temp')
    },

    // deciding the name of the file here 
    fileName:function(req,file,cb){
        cb(null,file.originame)
    }
})

export const upload = multer({
    storage
})
