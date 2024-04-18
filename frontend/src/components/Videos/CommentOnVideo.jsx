function CommentOnVideo({content="ankit"}){
    console.log("aawa pahuna")
    return(
        <>
        <div className="old-comment">
        <img src="assets/Jack.png"/>
        <div>
            <h3>John <span>2 days ago</span></h3>
            <p>{content}</p>
        </div>
    </div>
        
        </>
    )
}

export default CommentOnVideo
