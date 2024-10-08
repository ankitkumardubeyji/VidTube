import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { BsPersonCircle } from "react-icons/bs"
import { toast } from "react-hot-toast"
import {  useSelector,useDispatch } from "react-redux"
import { getUserChannelProfile, logout } from "../../Redux/authSlice"
import { getAllVideos, searchAllVideos } from "../../Redux/videoSlice"


function Navigation({response}){

    const [searchValue,setSearchValue] = useState("")

    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
    const data = useSelector(state => state.auth.data)
    const avatar = data.avatar
    console.log(avatar)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    console.log(response==true)
    if(!response){
        console.log(response)
       
    }

    function logIn(){
        setActive()
        navigate("/login")
    }
 async function logOut(event){
    event.preventDefault();
    setActive()

    // calling logout action
    const res = await dispatch(logout());

    // redirect to home page if true
    if (res) navigate("/login");
       
    }

    function setActive(){
        console.log("here")
        const sideBar = document.querySelector(".sideBar")
        sideBar.classList.toggle("active");
    }

    function getProfile(){
        navigate("/ucp")
    }


    function handleSubmit(e){
        e.preventDefault()
        let searchQuery = `?query=${searchValue}`
        dispatch(searchAllVideos(`?query=${searchValue}`))
        .then(res => {
          if (!res.payload) {
            return dispatch(searchAllVideos(`?fullName=${searchValue}`))
              .then((res) =>{ if (!res.payload) {
                    console.log("sorry sorry kaha taru")
                    return navigate("/nf")
                }
                else{
                   return  navigate("/search")
                }
            })
               
              .catch(() => navigate("/"));
          } else {
            navigate("/search");
          }
        })
        .catch(() => navigate("/"));
      
       // searchQuery = `?fullName=${searchValue}`
       // dispatch(getAllVideos(searchQuery)).then((res)=>console.log(res))
        
       
    }

    return(
        <>
        <nav className="flex-div">
        <div className="nav-left flex-div">
            <img src="assets/menu.png" className="menu-icon"/>
            <img src="assets/logo.png" className="logo"/>
        </div>

        <div className="nav-middle flex-div">

            <div className="search-box flex-div">

                <form onSubmit={handleSubmit} style={{display:"flex", alignItems:"center"}}>
                <input type="search" placeholder="Search" value={searchValue} onChange={(e)=>setSearchValue(e.target.value)}/>
                    <img src="assets/search.png"/>
                </form>
           
            </div>
            <img src="assets/voice-search.png" className="mic-icon"/>
        </div>

        <div className="nav-right flex-div">
            <img src="assets/upload.png"/>
            <img src="assets/more.png"/>
            <img src="assets/notification.png"/>
            {avatar ? (
              <img
                src={avatar}
                onClick={setActive}
              />
            ) : ( <BsPersonCircle className="w-10 h-10 rounded-full m-auto cursor-pointer" onClick={setActive} />
            )}
            
        </div>
        </nav>

        <div  className="sideBar">
        {
            isLoggedIn?(<button onClick={logOut} className="" id="logout" style={{visibility:""} }>LogOut</button>):<button onClick={logIn} className="" id="logout" style={{visibility:""} }>Login</button>
        }
        

        <button onClick={getProfile} className="" id="myProfile" style={{visibility:""} }>MyProfile</button>
        <button onClick={logOut} className="" id="ud" style={{visibility:""} }>UpdateDetails</button>
        <button onClick={logOut} className="" id="up" style={{visibility:""} }>UpdateProfile</button>
        </div>
            
        </>
    )
}

export default Navigation