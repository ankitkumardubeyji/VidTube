// here we are uploading the file from the localstorage server to the cloudinary and after that removing the file from the localstorage.


import {v2 as cloudinary} from "cloudinary"
import fs from "fs" // file system , read write 

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(localFilePath)=>{
    try{
        if(!localFilePath){
            return null
        }

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        // file has been uploaded successfully
        //console.log("file is uploaded on cloudinary",response.url)
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the uploaded successfully.
        return response
    }
    catch(error){
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload failed.
    }
}


// Todo : how to delete the file on the cloudinary
// File cannot be deleted on cloudinary based on url , it will be deleted based on public id that requires to be saved in database while uploading itself
// 	The identifier of the uploaded asset.
// Note: The public ID value for images and videos should not include a file extension. Include the file extension for raw files only.


export {uploadOnCloudinary}

