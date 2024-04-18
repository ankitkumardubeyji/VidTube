const asyncHandler = (requestHandler) => { // requestHandler is the fxn that is to be executed
    return (req,res,next) => {  // taking the fxn as the input and returning the function.
        Promise.resolve(requestHandler(req,res,next)).catch((err) =>next(err))
    }
}

export {asyncHandler}

// takes the fxn as the input and executes it.
/*
const asyncHandler = (fn) => {
    async(req,res,next)=>{ // callback function that will execute the passed fxn and handle it .
        try{
            fn(req,res,next)
        }
        catch(err){
            res.staus(err.staus || 400).json({
                sucess:false,
                message:"sorry some error occured "
            })
        }
    }
} 

*/