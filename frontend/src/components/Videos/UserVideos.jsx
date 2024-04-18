import { useDispatch,useSelector } from "react-redux"
import { getUserVideos } from "../../Redux/videoSlice"
import {  useEffect, useMemo } from "react"
import { useState } from "react"
import Videos from "./Videos"
import { getUserChannelProfile } from "../../Redux/authSlice"
function UserVideos(){

    const userId = useSelector((state)=>state.auth.data._id)
    let userVideosData = useSelector((state)=>state.video.userVideosData)

    const [video,setVideo] = useState([])

  


  

  

    let total = 0;
    let maxi = 0;
    for(let i=0; i<userVideosData.length;i++){
        total = total + userVideosData[i].views;
        maxi = Math.max(maxi,userVideosData[i].views)
    }
    const dispatch = useDispatch()

    console.log(userId)
    const data = useSelector(state => state.auth.data)
    const [user,setUser] = useState({})
    useEffect(()=>{
            dispatch(getUserVideos(userId))
            const res = dispatch(getUserChannelProfile(data.username))
            res.then((response)=>{
                console.log(response.payload?.data)
                setUser(response.payload?.data)
                console.log(user)
        })
        userVideosData =   userVideosData.slice().sort((a, b) => b.createdAt - a.createdAt);
        setTimeout(()=>{
            setVideo(userVideosData)
        },1000)
},[])


function sortonViews(e){
      // sorting the videos based on their views
    e.preventDefault()
   userVideosData =   userVideosData.slice().sort((a, b) => b.views - a.views);
   document.getElementById("view").style.color="red";
   document.getElementById("time").style.color="grey";
   setVideo(userVideosData)

}


function sortonTime(e){
      // sorting the videos based on their time
      e.preventDefault()
   userVideosData =   userVideosData.slice().sort((a, b) => b.createdAt - a.createdAt);
   document.getElementById("view").style.color="grey";
   document.getElementById("time").style.color="red";
   setVideo(userVideosData)
}


    return(
        <>
            <div className="side-bar">
        <div className="shortcut-link">
        <a href="" onClick={sortonTime} id="time"><img src="assets/explore.png"/><p>SortonTime</p></a>
        <a href=""onClick={sortonViews} id="view"><img src="assets/home.png"/><p>SortOnViews</p></a>
           
            </div>
            </div>


           <div className="container bg-gray-200  dark:bg-gray-800 ">
           <div className="h-25vh bg-gray-200  dark:bg-gray-800   flex flex-wrap items-center  justify-center  ">
            <div className="lg:w-2/6 xl:w-2/7 sm:w-full md:w-2/3    bg-aliceblue  shadow-lg    transform   duration-200 easy-in-out px-0 ">
                <div className=" h-32 overflow-hidden" >
                    <img className="w-full" src={user.avatar} alt="" />
                </div>
                <div className="flex justify-center px-5  -mt-12">
                    <img className="h-32 w-32 bg-white p-2 rounded-full " src={user.avatar} alt="" />

                </div>
                <div className=" ">
                    <div className="text-center px-14">
                        <h2 className="text-gray-800 text-3xl font-bold">{user.fullName}</h2>
                        <a className="text-gray-400 mt-2 hover:text-blue-500" href="https://www.instagram.com/immohitdhiman/" target="BLANK()">@{user.username}</a>
                        <p className="mt-2 text-gray-500 text-sm">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, </p>
                    </div>
                    <hr className="mt-6" />
                    <div className="flex  bg-gray-50 ">
                        <div className="text-center w-1/2 p-4 hover:bg-gray-100 cursor-pointer">
                            <p><span className="font-semibold">{user.subscribersCount} </span> Subscribers</p>
                        </div>
                        <div className="border"></div>
                        <div className="text-center w-1/2 p-4 hover:bg-gray-100 cursor-pointer">
                            <p> <span className="font-semibold">{user.channelsSubscribedToCount} </span> Subscribed</p>
                        </div>
                        
                       

                    </div>
                    <hr/>
                    <div className="flex  bg-gray-50 ">
                    <div className="text-center w-1/2 p-4 hover:bg-gray-100 cursor-pointer">
                            <p> <span className="font-semibold">{userVideosData.length} </span> Videos</p>
                        </div>

                        <div className="text-center w-1/2 p-4 hover:bg-gray-100 cursor-pointer">
                            <p> <span className="font-semibold">{total} </span> Views</p>
                        </div>


                        </div>
                </div>
            </div>
        </div>


        <div className="list-container " style={{backgroundColor:"rgb((229 ,231 ,235)"}}>
            {
                video.map((item,index)=> (<Videos key = {index} idName = { item._id} thumbnail = {item.thumbnail} title = {item.title} videoFile={item.videoFile} userId={item.owner} views = {item.views}  
                
                    timeStamp ={item.createdAt}   description = {item.description}  />))
            }

        </div>

        </div>

        </>

    )


}

export default UserVideos