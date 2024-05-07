import { useEffect,memo,useMemo, useState } from "react"
import { useDispatch,useSelector } from "react-redux"
import { getAllVideos, updateCurrentVideo } from "../../Redux/videoSlice"
import Videos from "./Videos"
import SideBar from "../SideBar/SideBar";


function VideosContainer(){
   

    const [videosData,setVideosData] = useState(useSelector((state) => state.video.videosData))
    const [loading,setloading] = useState(true)
    //console.log(videosData)

    const dispatch = useDispatch()


    useMemo(() => {
        ( () => {
           dispatch(getAllVideos()).then((res)=>setVideosData(res.payload)).then(()=>setloading(false));
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
    !loading && videosData.map((item, index) => (
        <Videos
            key={index}
            idName={item._id}
            thumbnail={item.thumbnail}
            title={item.title}
            videoFile={item.videoFile}
            owner={item.owner}
            views={item.views}
            timeStamp={item.createdAt}
            description={item.description}
            cla="vid-list"
        />
    ))
}
        
        </div>

      
      

        </div>
        
        </>
    )
    
}


export default memo(VideosContainer)
