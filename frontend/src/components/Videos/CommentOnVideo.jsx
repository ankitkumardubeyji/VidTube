function CommentOnVideo({content,avatar,fullName}){
    console.log("aawa pahuna")
    console.log("aawa pahuna")
    return(
        <>
        <div className="old-comment">
        <img src={avatar}/>
        <div>
            <h3>{fullName} <span>2 days ago</span></h3>
            <p>{content}</p>
        </div>
    </div>
        
        </>
    )
}

export default CommentOnVideo
