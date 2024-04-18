import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { publishVideo } from "../../Redux/videoSlice"
import { useDispatch } from "react-redux"



function UploadVideo(){
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [uploadData,setUploadData] = useState({
        title:"",
        description:"",
        videoFile:"",
        thumbnail:"",
    })


async function uploadNewVideo(event){
    event.preventDefault()

    console.log("here came ")
    console.log(uploadData)
     const formData = new FormData()
    formData.append("title",uploadData.title)
    formData.append("description",uploadData.description)
    formData.append("thumbnail",uploadData.thumbnail)
    formData.append("videoFile",uploadData.videoFile)
   
    console.log("edhar tak bhi aa gaya tha ")
    console.log(formData)
    const response =  dispatch(publishVideo(formData))
    setUploadData({
        title:"",
        description:"",
        thumbnail:"",
        videoFile:""
      })
  
    
    if(response){
      console.log(response)
      console.log("video successfully upload ho gya bhai ")
      navigate("/")
    }
    

  }
    

    function handleUserInput(e){
        console.log(e.target)
        const {name,value} = e.target 
        setUploadData({
          ...uploadData,
          [name]:value
        })
      }

      function getFile(event){
        event.preventDefault();
        // getting the image
        const uploadedFile = event.target.files[0];
        const {name} = event.target
    
        // if image exists then getting the url link of it
        if (uploadedFile) {
          setUploadData({
            ...uploadData,
            [name]: uploadedFile,
          });
         
        }

 
    }
  
    return(
        <>
         <div className="flex min-h-full flex-col justify-center px-6 py-2 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
 
    <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Upload Video</h2>
   

  </div>

  <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
    <form noValidate onSubmit={uploadNewVideo} className="space-y-6" action="/api/users/register" method="POST"> 
        {/* no validate to stop the html validations */}

        <div>
        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">Title </label>
        <div className="mt-2">
          <input id="title" name="title" type="text" autoComplete="userName" required className="block w-full 
          rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 
          focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={handleUserInput} value={uploadData.title}/>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
        <div className="mt-2">
          <input id="description" name="description" type="text" autoComplete="description" required className="block w-full 
          rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 
          focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={handleUserInput} value={uploadData.description}/>
        </div>
      </div>

     

      <div>
        <label htmlFor="thumbnail" className="block text-sm font-medium leading-6 text-gray-900">ThumbNail</label>
        <div className="mt-2">
          <input id="thumbnail" name="thumbnail" type="file" autoComplete="" required className="block w-full rounded-md border-0 py-1.5
           text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 
           focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={getFile}/>
        </div>
      </div>

      <div>
        <label htmlFor="videoFile" className="block text-sm font-medium leading-6 text-gray-900">VideoFile</label>
        <div className="mt-2">
          <input id="videoFile" name="videoFile" type="file" autoComplete="" required className="block w-full rounded-md border-0 py-1.5
           text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 
           focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={getFile}/>
        </div>
      </div>

    
      <div>
        <button className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Upload Video</button>
      </div>
    </form>

    <p className="mt-5 text-center text-sm text-gray-500">
      Not a member?
      <a href="#" className="font-semibold leading-6 text-red-600 hover:text-indigo-500">Start a 14 day free trial</a>
    </p>
  </div>
</div>
        
        </>
    )

    
    
}

export default UploadVideo

