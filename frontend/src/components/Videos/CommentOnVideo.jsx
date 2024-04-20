function CommentOnVideo({content,avatar,fullName,timeStamp}){
    console.log(timeStamp)

    function timeForComment(timeStamp){
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
        return time
    }
    console.log("aawa pahuna")
    console.log("aawa pahuna")
    return(
        <>
        <div className="old-comment">
        <img src={avatar}/>
        <div>
            <h3>{fullName} <span>{timeForComment(timeStamp)} ago</span></h3>
            <p>{content}</p>
        </div>
    </div>
        
        </>
    )
}

export default CommentOnVideo
