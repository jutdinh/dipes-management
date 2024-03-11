import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faHome, faIcons, faRocket, faStar} from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'



export default () => {


    useEffect( () => {
        console.log("SHOW")
    }, [] )


    return(
        <div className="floating-box change-icon" >
            <div className="title">
                <span>PATTERN</span>                
            </div>

            <div className="icons-container">
                Cumming soon
            </div>
        </div>
    )
}