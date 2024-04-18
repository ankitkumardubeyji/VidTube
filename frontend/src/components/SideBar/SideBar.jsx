import { useDispatch ,useSelector} from "react-redux";
import { getUserVideos } from "../../Redux/videoSlice";
import { useNavigate } from "react-router-dom";


function SideBar(){  
    
    const navigate = useNavigate()

    function BringVideos(e){
        e.preventDefault()
        navigate("/usrV")
      
    }
return (
    <>
    
<div className="side-bar">
        <div className="shortcut-link">
            <a href=""><img src="assets/home.png"/><p>Home</p></a>
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
            <a href=""><img src="assets/Jack.png"/><p>Jack Nicholson</p></a>
            <a href=""><img src="assets/simon.png"/><p>Simon Baker</p></a>
            <a href=""><img src="assets/tom.png"/><p>Tom Hardy</p></a>
            <a href=""><img src="assets/megan.png"/><p>Megan Ryan</p></a>
            <a href=""><img src="assets/cameron.png"/><p>Cameron Diaz</p></a>
        </div>
    </div>
    </>
)

}

export default SideBar;
