import { useDispatch ,useSelector} from "react-redux";
import { getUserVideos } from "../../Redux/videoSlice";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSubscribed } from "../../Redux/subSlice";


function SideBar(){  
    
    const navigate = useNavigate()
    const data = useSelector(state=>state.auth.data)

    const [subscribed,setSubscribed] = useState([])
    console.log(subscribed)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getSubscribed(data._id)).then((res)=>setSubscribed(res.payload.data))
    },[])
    function BringVideos(e){
        e.preventDefault()
        navigate("/usrV")
        
      
    }
return (
    <>
    
<div className="side-bar">
        <div className="shortcut-link">
            <a href="/"><img src="assets/home.png"/><p>Home</p></a>
            <a href="/uv"><img src="assets/explore.png"/><p>Upload Video</p></a>
            <a href=""><img src="assets/subscriprion.png"/><p onClick={BringVideos}>Your Videos</p></a>
            <a href=""><img src="assets/library.png"/><p>Library</p></a>
            <a href="/uwh"><img src="assets/history.png"/><p>History</p></a>
            <a href=""><img src="assets/playlist.png"/><p>Playlist</p></a>
            <a href=""><img src="assets/playlist.png"/><p>Messages</p></a>
            <a href=""><img src="assets/show-more.png"/><p>Show More </p></a>
            <hr/>
        </div>

        <div className="subscribed-list">
            <h3>SUBSCRIBED</h3>
            {
                subscribed.map((item,index)=><a href="" key={index}><img src={item.owner.avatar}/><p style={{marginLeft:"10px"}}> {item.owner.fullName} </p></a>)
            }
            
        </div>
    </div>
    </>
)

}

export default SideBar;
