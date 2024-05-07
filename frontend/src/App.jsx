import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './components/Layout/Layout'
import Navigation from './components/Navigation/Navigation'
import { Route,createBrowserRouter,createRoutesFromElements,RouterProvider,Navigate } from 'react-router-dom'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import DisplayVideo from './components/Videos/DisplayVideo'
import VideosContainer from './components/Videos/VideosContainer'
import UploadVideo from './components/UploadVideo/UploadVideo'
import UserChannelProfile from './components/UserChannelProfile'
import UserVideos from './components/Videos/UserVideos'
import UserWatchHistory from './components/Videos/UserWatchHistory'
import SearchContainer from './components/Videos/SearchContainer'
import NotFound from './components/NotFoundPage'

const RequireAuth = ({ children }) => {
  const data = JSON.parse(localStorage.getItem("data"))
  console.log(data)
  if(data===null || data === undefined || Object.keys(data).length === 0){
    console.log("came here for gand marana");
    return  <Navigate to="/login" />;
  }
  
  return children
};
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}> {/* at the top level of nesting giving the layout hence the below oulets are able to come automatically */}
        <Route path='' element={<RequireAuth><VideosContainer /></RequireAuth>} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} /> {/* when comes the /about Abou component passed as outlet */} 
        <Route path='dv' element={<RequireAuth><DisplayVideo /></RequireAuth>} /> {/* when comes the /about Abou component passed as outlet */} 
        <Route path='uv' element={<RequireAuth><UploadVideo /></RequireAuth>} /> {/* when comes the /about Abou component passed as outlet */} 
        <Route path='ucp' element={<RequireAuth><UserChannelProfile /></RequireAuth>} /> {/* when comes the /about Abou component passed as outlet */} 
        <Route path='usrV' element={<RequireAuth><UserVideos /></RequireAuth>} /> {/* when comes the /about Abou component passed as outlet */} 
        <Route path='uwh' element={<RequireAuth><UserWatchHistory /></RequireAuth>} /> {/* when comes the /about Abou component passed as outlet */} 
        <Route path='search' element={<RequireAuth><SearchContainer /></RequireAuth>} /> {/* when comes the /about Abou component passed as outlet */} 
        <Route path='nf' element={<RequireAuth><NotFound /></RequireAuth>} /> {/* when comes the /about Abou component passed as outlet */} 
        
      </Route>
    )
  )
 
  return (
    <>
    
      <RouterProvider router = {router}/>
  
    </>
  )
}

export default App
