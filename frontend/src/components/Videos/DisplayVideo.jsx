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
const navigate = useNavigate()
//const select = useSelector()

useMemo(()=>{
    // passing the id of the videos to the reducers
    dispatch(updateViewsOnVideo(currentVideoData.Id))
    dispatch(getAllSubscribers(currentVideoData.Id))
    dispatch(checkIfSubscribedChannel(currentVideoData.Id))
    dispatch(getLikesOnVideos(currentVideoData.Id))
   dispatch(checkIfLikedVideo(currentVideoData.Id))
   dispatch(getCommentsOnVideos(currentVideoData.Id))
   dispatch(updateWatchHistory(currentVideoData.Id))
},[])


let {subscribed} = useSelector((state)=>state.sub)
let {liked} = useSelector((state)=>state.like)
console.log(liked)
let watchHistory = useSelector((state)=>state.auth.watchHistory)
console.log(watchHistory)

console.log(useSelector((state)=>state.auth.addedVideoId))


const [subscribers,setSubscribers] = useState(0)
const {subscribersData} = useSelector((state)=>state.sub)
const { LikesOnVideoData} = useSelector((state)=>state.like)
const {commentsOnVideoData} = useSelector((state)=>state.comment)

console.log(LikesOnVideoData)
console.log(commentsOnVideoData)



 function toggleSubscribe(){
    console.log("edhar")
     dispatch(toggleSubscriptionStatus(currentVideoData.Id))
     console.log(subscribed)
    navigate("/dv")
    navigate("/dv")
}

function toggleLike(e){
    e.preventDefault()
    console.log("came here for toggling ");
  //  dispatch(toggleLikeStatus(currentVideoData.Id))
   // console.log(liked)
  // navigate("/dv")
}


const videoRef = useRef(null);
const videoSources = {
    '360p': `${currentVideoData.VideoFile.replace('/upload/', '/upload/q_auto:low/')}`,
    '480p': `${currentVideoData.VideoFile.replace('/upload/', '/upload/q_auto:good/')}`,
    '720p': `${currentVideoData.VideoFile.replace('/upload/', '/upload/q_auto:best/')}`,
    '1080p': `${currentVideoData.VideoFile.replace('/upload/', '/upload/q_auto:advanced/')}`
};


  const [quality, setQuality] = useState('720p');


  const handleQualityChange = (e) => {
    const newQuality = e.target.value;
    const currentTime = videoRef.current.currentTime;
    setQuality(newQuality);
    videoRef.current.src = videoSources[quality]; // Reload the video with the new quality
    videoRef.current.currentTime = currentTime
    videoRef.current.load()
  };
//setSubscribers(subscribersData.length)

const [comment,setComment] = useState("");


function submitComment(e){
    console.log(currentVideoData.Id)
    e.preventDefault();
    if(!comment.length==0){
        dispatch(addCommentOnVideos({id:currentVideoData.Id,comment:comment})).then(()=>navigate("/dv"))
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
                        liked?( <a href=""><img src="assets/like-blue.png" onClick={toggleLike}/>{LikesOnVideoData.length}</a>): 
                        <a href=""><img src="assets/like.png" onClick={toggleLike}/>{LikesOnVideoData.length}</a>
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
                        <p>{currentVideoData.Username}</p>
                        <span>{subscribersData.length} subscribers</span>
                    </div>
                    {
                       subscribed?(<button type="button" style={{backgroundColor:"blue"}} onClick = {toggleSubscribe}>Subscribed</button>):
                       (<button type="button" style={{backgroundColor:"red"}} onClick = {toggleSubscribe}>Subscribe</button>)
                    }
                    


                </div>

                <div className="vid-description">
                    <p>{currentVideoData.Description} </p>
                    <p>Subscribe the {currentVideoData.Username}</p>
                    <hr/>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <h1>{commentsOnVideoData.length} Comments</h1>
                            <button type="button" style={{backgroundColor:"grey", color:"white", padding:"10px 10px"}} onClick={submitComment}>Add Comment</button>
                            
                    </div>
                    
                </div>

                <div className="add-comment" style={{padding:"15px 15px"}}>
                <h1> Add Your Comment</h1>
                <input type="text" style={{flex:"none", backgroundColor:"white", color:"black"}} value={comment} onChange={(e)=>setComment(e.target.value)}/>
                  
                </div>

              

               <div style={{display:"flex",flexDirection:"column",padding:"15px 15px", gap:"30px"}}>
                <h1>Comments:</h1>
               
                {
                        commentsOnVideoData.map((item,index)=> (<CommentOnVideo key = {index} content = { item.content} avatar={item.owner.avatar} fullName = {item.owner.fullName}/>)) 
                    }

                </div> 
                
            </div>
                   

               
            </div>
           </div> 
         
        </>)
   

}
 

export default memo(DisplayVideo)