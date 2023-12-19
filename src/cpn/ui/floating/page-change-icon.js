import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faHome, faIcons, faRocket, faStar} from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'



export default () => {
    const [ icons, setIcons ] = useState([])
    const iconsObject = useSelector(state => state.icons)
    const cache = useSelector(state => state.cache)
    const dispatch = useDispatch()


    useEffect( () => {
        setIcons( Object.values( iconsObject ) )
    }, [] )


    const setIcon = (icon) => {
        dispatch({
            branch: "design-ui",
            type: "pageChangeIcon",
            payload: {
                icon
            }
        })
    }

    return(
        <div className="floating-box change-icon" >
            <div className="title">
                <span>Chọn icon mới</span>                
            </div>

            <div className="icons-container">
                <div className="icons">
                    {
                        icons.map( icon => 
                            <div className="icon" key={icon.id} onClick={ () => { setIcon(icon) } }>
                                <FontAwesomeIcon icon={ icon.icon }/>
                                <span className="icon-name">{ icon.lang.vi }</span>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}