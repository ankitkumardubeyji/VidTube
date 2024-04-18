import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getWatchHistory } from "../../Redux/authSlice"
import Videos from "./Videos"

function UserWatchHistory(){
    const dispatch = useDispatch()
    const data = useSelector((state)=>state.auth.data)
    
    console.log(data)

    useEffect(()=>{
       dispatch(getWatchHistory())
    },[])

    const watchHistory = useSelector((state)=>state.auth.watchHistory)
    console.log(watchHistory)

    return(
        <>
             <div className="container">
        <div className="banner">
            <img src="assets/banner.png"/>
        </div>

        <div className="list-container">
            {
                watchHistory.map((item,index)=> (<Videos key = {index} idName = { item._id} thumbnail = {item.thumbnail} title = {item.title} videoFile={item.videoFile} owner={item.owner} views = {item.views}  
                
                    timeStamp ={item.createdAt}   description = {item.description}  />))
            }

        </div>

        </div>

        
        </>
    )
}

export default UserWatchHistory