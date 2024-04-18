import { useEffect,memo,useMemo } from "react"
import { useDispatch,useSelector } from "react-redux"
import { getAllVideos, updateCurrentVideo } from "../../Redux/videoSlice"
import Videos from "./Videos"
import SideBar from "../SideBar/SideBar";

function VideosContainer(){
   

    const { videosData } = useSelector((state) => state.video);
    //console.log(videosData)

    const dispatch = useDispatch()


    useMemo(() => {
        (async () => {
          await dispatch(getAllVideos());
        })();
      }, []);
      
    return(
        <>
            <SideBar/>
            <div className="container">
        <div className="banner">
            <img src="assets/banner.png"/>
        </div>


  <div className="list-container">
            {
                videosData.map((item,index)=> (<Videos key = {index} idName = { item._id} thumbnail = {item.thumbnail} title = {item.title} videoFile={item.videoFile} owner={item.owner} views = {item.views}  
                
                    timeStamp ={item.createdAt}   description = {item.description}  />))
            }

        </div>

      
      

        </div>
        
        </>
    )
    
}


export default memo(VideosContainer)