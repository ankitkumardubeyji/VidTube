import { useDispatch ,useSelector} from "react-redux";
import { getUserVideos } from "../../Redux/videoSlice";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSubscribed } from "../../Redux/subSlice";
import { searchAllVideos } from "../../Redux/videoSlice";

function SideBar(){  
    
    const navigate = useNavigate()
    const data = useSelector(state=>state.auth.data)

    const [subscribed,setSubscribed] = useState([])
    console.log(subscribed)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getSubscribed(data._id)).then((res)=>setSubscribed(res.payload?.data))
    },[])
    function BringVideos(e){
        e.preventDefault()
        navigate("/usrV")
        
      
    }
return (
    <>
    
<div className="side-bar">
        <div className="shortcut-link">
            <Link to="/"><img src="assets/home.png"/><p>Home</p></Link>
            <Link to="/uv"><img src="assets/explore.png"/><p>Upload Video</p></Link>
            <Link to="/yv"><img src="assets/subscriprion.png"/><p onClick={BringVideos}>Your Videos</p></Link>
            <Link to=""><img src="assets/library.png"/><p>Library</p></Link>
            <Link to="/uwh"><img src="assets/history.png"/><p>History</p></Link>
            <Link to=""><img src="assets/playlist.png"/><p>Playlist</p></Link>
            <Link to=""><img src="assets/playlist.png"/><p>Messages</p></Link>
            <Link to=""><img src="assets/show-more.png"/><p>Show More </p></Link>
            <hr/>
        </div>

        <div className="subscribed-list">
            <h3>SUBSCRIBED</h3>
            {
                subscribed.map((item,index)=><div style={{display:"flex", alignItems:"center", marginBottom:"5px" , cursor:"pointer"}}onClick={()=>dispatch(searchAllVideos(`?fullName=${item.owner.fullName}`)).then(()=> navigate("/search"))} key={index}><img src={item.owner.avatar} style={{width:"40px", borderRadius:"100%" }}/><p style={{marginLeft:"10px"}}> {item.owner.fullName} </p></div>)
            }
            
        </div>
    </div>
    </>
)

}

export default SideBar;
