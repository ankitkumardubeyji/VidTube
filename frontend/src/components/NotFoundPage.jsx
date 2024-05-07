

function NotFound(){
  
  
    return (
      <>
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white">
            <div className="flex flex-col items-center">
              <h1 className="font-bold text-3xl text-blue-600 lg:text-6xl">
                404
              </h1>
  
              <h6 className="mb-2 text-2xl font-bold text-center text-gray-800 md:text-3xl">
                <span className="text-red-500">Oops!</span> Requested Video or Creator doesnt Exist 
            
              </h6>
  
              <p className="mb-4 text-center text-gray-500 md:text-lg">
                Try Searching again!
              </p>
  
              
            </div>
          </div>
        </div>
      </>
    )
}

export  default NotFound