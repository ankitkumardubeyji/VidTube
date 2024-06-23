
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react"
import { toast } from "react-hot-toast";
import { validateUserAccount } from "../../Redux/authSlice";

function Login(){
  const dispatch =  useDispatch()
  const navigate = useNavigate()



  const [signInData,setSignInData] = useState({
  
    userName:"",
    email:"",
    password:"", 
  })

  function handleUserInput(e){
    
    const {name,value} = e.target 
    setSignInData({
      ...signInData,
      [name]:value
    })
  }

  async function validateAccount(e){
    e.preventDefault()
    if(!signInData.email || !signInData.password ||  !signInData.userName ){
      toast.error("please fill all the details")
    }

  
  

    if(!signInData.email.match( /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
      toast.error("Invalid email id ")
    }

    if (!signInData.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
      toast.error(
        "Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol"
      );
      return;
    }

    
    console.log(signInData)
    const response =  dispatch(validateUserAccount(signInData))
    console.log(response)
    setSignInData({
      fullName:"",
      email:"",
      password:"",
    })

    if(response){
      
      console.log("edhar bhai")
      setTimeout(()=>navigate("/"),1000)
    }

  }



    return(
    
    <>
    
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <img className="mx-auto h-10 w-auto" src="assets/logo.png" alt="Your Company"/>
    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form onSubmit = {validateAccount} className="space-y-6" action="#" method="POST">
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
        <div className="mt-2">
          <input id="email" name="email" type="email" autoComplete="email" required className="block w-full rounded-md border-0 py-1.5 text-gray
          -900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 
          sm:text-sm sm:leading-6" onChange={handleUserInput} value={signInData.email}/>
        </div>
      </div>

      <div>
        <label htmlFor="userName" className="block text-sm font-medium leading-6 text-gray-900">UserName</label>
        <div className="mt-2">
          <input id="userName" name="userName" type="text" autoComplete="userName" required className="block w-full rounded-md border-0 py-1.5 text-gray
          -900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 
          sm:text-sm sm:leading-6" onChange={handleUserInput} value={signInData.userName}/>
        </div>
      </div>

      

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
          <div className="text-sm">
            <a href="#" className="font-semibold text-red-600 hover:text-indigo-500">Forgot password?</a>
          </div>
        </div>
        <div className="mt-2">
          <input id="password" name="password" type="password" autoComplete="current-password" required className="block w-full rounded
          -md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring
          -inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={handleUserInput} value={signInData.password} />
        </div>

      </div>

      <div>
        <button type="submit" className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
      </div>
    </form>

    <p className="mt-10 text-center text-sm text-gray-500">
      Not a member?
      <a href="#" className="font-semibold leading-6 text-red-600 hover:text-indigo-500">Start a 14 day free trial</a>
    </p>
  </div>
</div>
</>
)
}


export default Login;
