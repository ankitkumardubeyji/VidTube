import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './components/Layout/Layout'
import Navigation from './components/Navigation/Navigation'
import { Route,createBrowserRouter,createRoutesFromElements,RouterProvider } from 'react-router-dom'
import Login from './components/Login/Login'
import Register from './components/Register/Register'
import DisplayVideo from './components/Videos/DisplayVideo'
import VideosContainer from './components/Videos/VideosContainer'
import UploadVideo from './components/UploadVideo/UploadVideo'
import UserChannelProfile from './components/UserChannelProfile'
import UserVideos from './components/Videos/UserVideos'
import UserWatchHistory from './components/Videos/UserWatchHistory'
import SearchContainer from './components/Videos/SearchContainer'


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<Layout />}> {/* at the top level of nesting giving the layout hence the below oulets are able to come automatically */}
        <Route path='' element={<VideosContainer />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} /> {/* when comes the /about Abou component passed as outlet */} 
        <Route path='dv' element={<DisplayVideo />} /> {/* when comes the /about Abou component passed as outlet */} 
        <Route path='uv' element={<UploadVideo />} /> {/* when comes the /about Abou component passed as outlet */} 
        <Route path='ucp' element={<UserChannelProfile />} /> {/* when comes the /about Abou component passed as outlet */} 
        <Route path='usrV' element={<UserVideos/>} /> {/* when comes the /about Abou component passed as outlet */} 
        <Route path='uwh' element={<UserWatchHistory/>} /> {/* when comes the /about Abou component passed as outlet */} 
        <Route path='search' element={<SearchContainer/>} /> {/* when comes the /about Abou component passed as outlet */} 
        
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
