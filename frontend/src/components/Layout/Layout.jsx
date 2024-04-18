import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import {useDispatch, useSelector} from 'react-redux'

import { Outlet } from 'react-router-dom'  // outlet will only change other than that everything will stay same in the layout.
import Navigation from '../Navigation/Navigation'
import SideBar from '../SideBar/SideBar'
import VideosContainer from '../Videos/VideosContainer'
import { getCurrentUser } from '../../Redux/authSlice'

// beause of the outlet automatic by react-router-dom there will be nesting
function Layout(){
 
    console.log("edhar")
    const [response,setResponse] = useState({})
    const dispatch = useDispatch()
    const authStatus = useSelector(state => state.auth.isLoggedIn)
    const data = useSelector(state => state.auth.data)
    console.log(data)
    return(
        <>
            <Navigation response={data.avatar}/>
            <Outlet/>     
           
        </>
    )
}

export default Layout;