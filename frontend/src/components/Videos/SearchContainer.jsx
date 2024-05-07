import { useEffect,memo,useMemo, useState } from "react"
import { useDispatch,useSelector } from "react-redux"
import { getAllVideos, updateCurrentVideo } from "../../Redux/videoSlice"
import Videos from "./Videos"
import SideBar from "../SideBar/SideBar";


function SearchContainer(){
    const searchData = useSelector((state) => state.video.searchData)
    const [loading,setloading] = useState(true)
   
useEffect(()=>{

    if(searchData){
        console.log(searchData)
        setloading(false)
    }
},[searchData])
   
    //console.log(videosData)
  
    return(
        <>
            <SideBar/>
            <div className="container">
        <div className="banner">
            <img src="assets/banner.png"/>
        </div>


  <div className="list-container search">
            {
              !loading && searchData.map((item,index)=> (<Videos  key = {index} idName = { item._id} thumbnail = {item.thumbnail} title = {item.title} videoFile={item.videoFile} owner={item.owner} views = {item.views}  
                
                    timeStamp ={item.createdAt}   description = {item.description} cla="searchvid"  />))
            }

        </div>

      
      

        </div>
        
        </>
    )
    
}


export default memo(SearchContainer)
