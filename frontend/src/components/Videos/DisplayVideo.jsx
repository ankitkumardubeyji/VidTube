import {  useSelector,useDispatch } from "react-redux"
import { getVideoById } from "../../Redux/videoSlice"
import { useEffect, useState,memo, useMemo } from "react"
import {updateViewsOnVideo} from "../../Redux/videoSlice"
import { checkIfSubscribedChannel, getAllSubscribers, toggleSubscriptionStatus } from "../../Redux/subSlice"
import { useNavigate } from "react-router-dom"
import { getLikesOnVideos } from "../../Redux/likeSlice"
import { checkIfLikedVideo } from "../../Redux/likeSlice"
import {toggleLikeStatus } from "../../Redux/likeSlice"
import { getCommentsOnVideos } from "../../Redux/commentSlice"
import CommentOnVideo from "./CommentOnVideo"
import { updateWatchHistory } from "../../Redux/authSlice"


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

function toggleLike(){
    dispatch(toggleLikeStatus(currentVideoData.Id))
    console.log(liked)
  // navigate("/dv")
}


//setSubscribers(subscribersData.length)

        return(
        <> 
         <div className="container play-container">
        <div className="row">
            <div className="play-video">
             
                   
                     
                        <video controls autoPlay>
                      
                            <source src = {currentVideoData.VideoFile} type="video/mp4" />
                        
                       
                        </video>
                
            
               
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
                    <p>Subscribe the {currentVideoData.Username} to learn more on the web Developement</p>
                    <hr/>
                    <h4>{commentsOnVideoData.length} Comments</h4>
                    
                </div>

                <div className="add-comment">
                    <img src="assets/Jack.png"/>
                  
                </div>
                    {
                        commentsOnVideoData.map((item,index)=> (<CommentOnVideo key = {index} content = { item.content}/>)) 
                    }

               
            </div>
           </div> 
           </div> 
        </>)
   

}
 

export default memo(DisplayVideo)