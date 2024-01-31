import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faHome, faIcons, faRocket, faStar} from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'



export default () => {
    const [ icons, setIcons ] = useState([])
    const iconsObject = useSelector(state => state.icons)
    const { selectedCpn, cache } = useSelector( state => state )


    const dispatch = useDispatch()


    useEffect( () => {
        setIcons( Object.values( iconsObject ) )
    }, [] )


    const setIcon = (icon) => {

        selectedCpn.props.icon = `${icon.id}`

        dispatch({
            branch: "design-ui",
            type: "overideSelectedComp",
            payload: {
                component: selectedCpn
            }
        })
    }

    const renderIcon = (icon) => {
        try {
            return <FontAwesomeIcon icon={ icon.icon }/>
        } catch (error) {
            return null
        }
    }

    return(
        <div className="floating-box change-icon" >
            <div className="title">
                <span>Thay đổi icon</span>                
            </div>

            <div className="icons-container">
                <div className="icons">
                    {
                        icons.map( icon => 
                            <div className="icon" key={icon.id} onClick={ () => { setIcon(icon) } }>
                                { renderIcon(icon) }                               
                                <span className="icon-name">{ icon.lang.vi }</span>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}