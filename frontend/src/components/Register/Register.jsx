import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import {useState} from "react"
import toast from "react-hot-toast";
import { createAccount } from "../../Redux/authSlice";


function Register(){
  const dispatch =  useDispatch()
  const navigate = useNavigate()

  const [previewImage,setPreviewImage] = useState("")

  const [signupData,setSignupData] = useState({
    fullName:"",
    userName:"",
    email:"",
    password:"",
    avatar:"",                
  })

  function handleUserInput(e){
    console.log(e.target)
    const {name,value} = e.target 
    setSignupData({
      ...signupData,
      [name]:value
    })
  }

  function getImage(event){
    event.preventDefault();
    // getting the image
    const uploadedImage = event.target.files[0];

    // if image exists then getting the url link of it
    if (uploadedImage) {
      setSignupData({
        ...signupData,
        avatar: uploadedImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
       // console.log(this.result) // file gets converted in base64
        setPreviewImage(this.result);
      });
    }

  }

 
  async function createNewAccount(e){
    console.log(signupData)
    e.preventDefault()
    if(!signupData.email || !signupData.password || !signupData.fullName || !signupData.userName || !signupData.avatar){
      toast.error("please fill all the details")
    }

    if(signupData.fullName.length < 5){
      toast.error("fullName should be atleast of length 5")
    }

    if(!signupData.email.match( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
      toast.error("Invalid email id ")
    }

    if (!signupData.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
      toast.error(
        "Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol"
      );
      return;
    }

    const formData = new FormData()
    formData.append("fullName",signupData.fullName)
    formData.append("email",signupData.email)
    formData.append("password",signupData.password)
    formData.append("avatar",signupData.avatar)
    formData.append("username",signupData.userName)

    setSignupData({
      fullName:"",
      email:"",
      password:"",
      avatar:""
    })

    setPreviewImage("");

    const response =  dispatch(createAccount(formData))
    console.log(response)
    if(response){
      
      console.log("edhar bhai")
      navigate("/")
    }

  }

  
  

    return(
    <>
    <div className="flex min-h-full flex-col justify-center px-6 py-2 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
 
    <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Register</h2>
    <label className="cursor-pointer" htmlFor="image_uploads">
            {previewImage ? (
              <img
                className="w-24 h-24 rounded-full m-auto"
                src={previewImage}
                alt="preview image"
              />
            ) : (
              <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
            )}
          </label>

  </div>

  <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
    <form noValidate onSubmit={createNewAccount} className="space-y-6" action="/api/users/register" method="POST"> 
        {/* no validate to stop the html validations */}

    <div>
        <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900">fullName </label>
        <div className="mt-2">
          <input id="fullName" name="fullName" type="text" autoComplete="fullName" required className="block w-full 
          rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 
          focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={handleUserInput} value={signupData.fullName}/>
        </div>
      </div>



      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
        <div className="mt-2">
          <input id="email" name="email" type="email" autoComplete="email" required className="block w-full 
          rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 
          focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={handleUserInput} value={signupData.email}/>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
        </div>
        
        <div className="mt-2">
          <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded
          -md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring
          -inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={handleUserInput} value={signupData.password}/>
        </div>
      </div>

     
    <div>
        <label htmlFor="userName" className="block text-sm font-medium leading-6 text-gray-900">userName </label>
        <div className="mt-2">
          <input id="userName" name="userName" type="text" autoComplete="userName" required className="block w-full 
          rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 
          focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={handleUserInput} value={signupData.userName}/>
        </div>
      </div>

      <div>
        <label htmlFor="avatar" className="block text-sm font-medium leading-6 text-gray-900">Profile Image</label>
        <div className="mt-2">
          <input id="avatar" name="avatar" type="file" autoComplete="" required className="block w-full rounded-md border-0 py-1.5
           text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 
           focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" accept=".jpg,.jpeg,.png,.svg" onChange={getImage}/>
        </div>
      </div>

    
      <div>
        <button className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
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


export default Register;