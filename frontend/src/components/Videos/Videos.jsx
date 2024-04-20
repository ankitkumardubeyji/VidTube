import { updateCurrentVideo } from "../../Redux/videoSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState,memo, useMemo,useRef } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { getUserById } from "../../Redux/authSlice";
//import { updateViewsOnVideo } from "../../../../backend/src/controllers/video.controller";
import { updateViewsOnVideo } from "../../Redux/videoSlice";

function Videos({idName,thumbnail,title,videoFile,owner,views,timeStamp,description}){
    let time = ""
    const savedYear = Number(timeStamp.substring(0,5))
    const savedMonth = Number(timeStamp.substring(5,7));
    const savedDate = Number(timeStamp.substring(8,10));
    
   
    if(new Date().getFullYear() - savedYear >=1){
        time = (new Date().getFullYear() - savedYear+" year")
    }

    else if(new Date().getMonth()+1 - savedMonth >=1){
        time = (new Date().getMonth()+1 - savedMonth+" month")
    }

    else if(new Date().getDate() - savedDate>=1){
        time = (new Date().getDate() - savedDate) + " days"
        console.log(time)
    }

    else{
        let t = parseInt((new Date()- new Date(timeStamp))/60000);
        if(t/60>=1){
            time = parseInt(t/60) + " hours";
         }
         else{
            time = t+" minutes";
         }
    }


    
    
    const [user,setUser] = useState("")
    const [image,setImage] = useState("")

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { videosData } = useSelector((state) => state.video);
    const {currentVideo} = useSelector((state)=>state.video)
    
  
    
    async  function handleClick(e){
        console.log(owner)
        e.preventDefault()
        console.log("here")
        console.log(e.target)
        const signInData = {
            Thumbnail:thumbnail,
            Title:title,
            VideoFile:videoFile,
            Views:views+1,
            Id:idName,
          //  Username:user,
            Time:time,
            Description:  description,
            Image:owner.avatar ,
            ownerId:owner._id,
            ownerName:owner.fullName
        }

        console.log(signInData)

        console.log("edhar")
        console.log(signInData)
    
        
       await  dispatch(updateCurrentVideo(signInData))
       
        console.log("hine aabo")
        console.log("current video is :"+currentVideo)
        dispatch(updateViewsOnVideo(idName)).then(()=>navigate("/dv")) 
    }

    function addVideo(){
       
        console.log(idName)
        const ele = document.getElementsByClassName(idName)[0]
        if(ele){
            console.log("came for adding the video")
            ele.play()
            ele.style.width="100%"
        }
    }

    function removeVideo(){
       
        console.log(idName)
        const ele = document.getElementsByClassName(idName)[0]
        if(ele){
            console.log("came for removing the video");
            ele.pause()
            ele.style.width="0%"
        }
    }

    return(
        <>
        <div className="vid-list" onClick={handleClick} style={{position:"relative", cursor:"pointer"}} onMouseEnter={addVideo} onMouseLeave={removeVideo}>
            <a href="/dv"><img src={thumbnail} className="thumbnail" id={idName} /></a>
            <video controls autoPlay muted style={{position:"absolute", zIndex:"10", top:"0", width:"0"}} className={idName} onMouseLeave={() => document.querySelector(".video").style.width = "100%"}>
    <source src={videoFile} type="video/mp4" />
</video>




            <div className="flex-div">
                <img src = {owner.avatar}/>
                <div className="vid-info">
                    <a href="/dv">{title}</a>
                    <p>{owner.fullName}</p>
                    <p>{views} Views &bull; {time} ago </p>
                </div>

            </div>
        </div>
        
        </>
    )
}

export default memo(Videos)