import {  useSelector,useDispatch } from "react-redux"
import { getVideoById } from "../../Redux/videoSlice"
import { useEffect, useState,memo, useMemo,useRef } from "react"
import {updateViewsOnVideo} from "../../Redux/videoSlice"
import { checkIfSubscribedChannel, getAllSubscribers, toggleSubscriptionStatus } from "../../Redux/subSlice"
import { useNavigate } from "react-router-dom"
import { getLikesOnVideos } from "../../Redux/likeSlice"
import { checkIfLikedVideo } from "../../Redux/likeSlice"
import {toggleLikeStatus } from "../../Redux/likeSlice"
import { getCommentsOnVideos } from "../../Redux/commentSlice"
import CommentOnVideo from "./CommentOnVideo"
import { updateWatchHistory } from "../../Redux/authSlice"
import SettingsIcon from '@mui/icons-material/Settings';
import { addCommentOnVideos } from "../../Redux/commentSlice"

 function DisplayVideo(){
const {currentVideoData} = useSelector((state)=>state.video)
console.log(currentVideoData)
const dispatch = useDispatch()

//const select = useSelector()
const [quality, setQuality] = useState('720p');
const[noOfSubscribers,setNoOfSubscribers] = useState(0)
const [liked,setLiked] = useState(false)
const[commentsOnVideo,setCommentsOnVideo] = useState([])
const [comment,setComment] = useState("");
const [noOfLikes,setNoOfLikes] = useState(0)
const [subscribed,setSubscribed] = useState(false)

useEffect(()=>{
  
    // passing the id of the videos to the reducers
    dispatch(getAllSubscribers(currentVideoData.ownerId)).then((res)=>setNoOfSubscribers(res.payload.data.length))
    dispatch(checkIfSubscribedChannel(currentVideoData.ownerId)).then((res)=>res.payload.data.length>0?setSubscribed(true):setSubscribed(false))
    dispatch(getLikesOnVideos(currentVideoData.Id)).then((res)=>setNoOfLikes(res.payload.data.length))
    dispatch(checkIfLikedVideo(currentVideoData.Id)).then((res)=>res.payload.data.length>0?setLiked(true):setLiked(false))
   dispatch(getCommentsOnVideos(currentVideoData.Id)).then((res)=>setCommentsOnVideo(res.payload.data))
   dispatch(updateWatchHistory(currentVideoData.Id))
},[])


 function toggleSubscribe(){
    console.log("edhar")
     dispatch(toggleSubscriptionStatus(currentVideoData.ownerId)).then(()=> dispatch(getAllSubscribers(currentVideoData.ownerId)).then((res)=>setNoOfSubscribers(res.payload.data.length)));
     dispatch(checkIfSubscribedChannel(currentVideoData.ownerId)).then((res)=> res.payload.length>0 ?setSubscribed(true):setSubscribed(false))
    
}

function toggleLike(e){
    e.preventDefault()
    console.log("came here for toggling ");
   dispatch(toggleLikeStatus(currentVideoData.Id))
   .then(()=>dispatch(getLikesOnVideos(currentVideoData.Id)).then((res)=>setNoOfLikes(res.payload.data.length)))
   .then(()=>dispatch(checkIfLikedVideo(currentVideoData.Id)).then((res)=>res.payload.data.length>0?setLiked(true):setLiked(false)))
   console.log(liked)
 //  navigate("/dv")
}


const videoRef = useRef(null);
const videoSources = {
    '360p': `${currentVideoData.VideoFile.replace('/upload/', '/upload/q_auto:low/')}`,
    '480p': `${currentVideoData.VideoFile.replace('/upload/', '/upload/q_auto:good/')}`,
    '720p': `${currentVideoData.VideoFile.replace('/upload/', '/upload/q_auto:best/')}`,
    '1080p': `${currentVideoData.VideoFile.replace('/upload/', '/upload/q_auto:advanced/')}`
};


 


  const handleQualityChange = (e) => {
    const newQuality = e.target.value;
    const currentTime = videoRef.current.currentTime;
    setQuality(newQuality);
    videoRef.current.src = videoSources[quality]; // Reload the video with the new quality
    videoRef.current.currentTime = currentTime
    videoRef.current.load()
  };
//setSubscribers(subscribersData.length)





function submitComment(e){
    console.log(currentVideoData.Id)
    e.preventDefault();
    if(!comment.length==0){
        dispatch(addCommentOnVideos({id:currentVideoData.Id,comment:comment})).then((res)=>console.log(res))
        .then(()=>dispatch(getCommentsOnVideos(currentVideoData.Id)).then((res)=>setCommentsOnVideo(res.payload.data)))
        setComment("")
    }

}


        return(
        <> 
         <div className="container play-container">
        <div className="row">
            <div className="play-video">
             
                   <div>
                    
                   </div>
                     
                     <div style={{display:"flex"}}>
                     <video ref={videoRef} controls autoPlay >
                      
                      <source src={currentVideoData.VideoFile} type="video/mp4" />
                      
                     
                      </video>

                      <label htmlFor="quality" style={{position:"relative" , right:"240px", top:"510px"}}><SettingsIcon style={{color:"white"}}/></label>
                    <select id="quality" value={quality} onChange={handleQualityChange} style={{position:"relative" , right:"240px", top:"510px", height:"fit-content"}}>
                        {Object.keys(videoSources).map(q => (
                        <option key={q} value={q}>{q}</option>
                        ))}
                    </select>
              
                     </div>
                 
            
               
                <div className="tags">
                    <a href="">#coding</a> <a href="">#html</a> <a href="">#css</a> <a href="">#javascript</a> 
                </div>
                <h3>{currentVideoData.Title} </h3>
                <div className="play-vid-info">
                 <p>{currentVideoData.Views} views &bull; {currentVideoData.Time} days ago</p>
                 <div>
                    {
                        liked?( <a href="" style={{cursor:"pointer"}}onClick={(e)=>toggleLike(e)}><img src="assets/like-blue.png" />{noOfLikes}</a>): 
                        <a href="" onClick={(e)=>toggleLike(e)}  style={{cursor:"pointer"}}><img src="assets/like.png" />{noOfLikes}</a>
                    }
                  
                    <a href=""><img src="assets/dislike.png"/>2</a>
                    <a href=""><img src="assets/share.png"/>Share</a>
                    <a href=""><img src="assets/save.png"/>Save</a>
                 </div>
                </div>
                <hr/>

                <div className="publisher">
                    <img src={currentVideoData.Image}/>
                    <div>
                        <p>{currentVideoData.ownerName}</p>
                        <span>{noOfSubscribers} subscribers</span>
                    </div>
                    {
                       subscribed?(<button type="button" style={{backgroundColor:"blue"}} onClick = {toggleSubscribe}>Subscribed</button>):
                       (<button type="button" style={{backgroundColor:"red"}} onClick = {toggleSubscribe}>Subscribe</button>)
                    }
                    


                </div>

                <div className="vid-description">
                    <p>{currentVideoData.Description} </p>
                    <p>Subscribe the {currentVideoData.ownerName} Channel</p>
                    <hr/>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <h1>{commentsOnVideo.length} Comments:</h1>
                           
                            
                    </div>
                    
                </div>

                <div className="add-comment" style={{padding:"10px 45px" ,display:"flex", gap:"20px",alignItems:"center"}}>
               
                <input type="text" style={{flex:"none", backgroundColor:"white", color:"black"}} value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Add Your Comment"/>
                <button type="button" style={{backgroundColor:"grey", color:"white", padding:"10px 10px", width:"100%"}} onClick={submitComment}>Comment</button>
                </div>

              

               <div style={{display:"flex",flexDirection:"column",padding:"15px 45px", gap:"30px"}}>
               
               
                {
                        commentsOnVideo.map((item,index)=> (<CommentOnVideo key = {index} content = { item.content} avatar={item.owner.avatar} fullName = {item.owner.fullName} timeStamp ={item.createdAt}/>)) 
                    }

                </div> 
                
            </div>
                   

               
            </div>
           </div> 
         
        </>)
   

}
 

export default memo(DisplayVideo)