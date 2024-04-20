import { useEffect,memo,useMemo } from "react"
import { useDispatch,useSelector } from "react-redux"
import { getAllVideos, updateCurrentVideo } from "../../Redux/videoSlice"
import Videos from "./Videos"
import SideBar from "../SideBar/SideBar";
import { Cursor } from "mongoose";

function SearchContainer(){
   

    const { searchData } = useSelector((state) => state.video);
    //console.log(videosData)
  
    return(
        <>
            <SideBar/>
            <div className="container">
        <div className="banner">
            <img src="assets/banner.png"/>
        </div>


  <div className="list-container">
            {
                searchData.map((item,index)=> (<Videos  key = {index} idName = { item._id} thumbnail = {item.thumbnail} title = {item.title} videoFile={item.videoFile} owner={item.owner} views = {item.views}  
                
                    timeStamp ={item.createdAt}   description = {item.description}  />))
            }

        </div>

      
      

        </div>
        
        </>
    )
    
}


export default memo(SearchContainer)