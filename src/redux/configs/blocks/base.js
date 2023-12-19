import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from "@fortawesome/free-solid-svg-icons"

export default (props) => {
    const { cache, gridState } = useSelector( state => state )
    const { id, zIndex, insertComponent,
        renderFrontLiner,
        renderBackLiner,
        parent
    } = props

    const dispatch = useDispatch()

    const isActive = () => {
        const { activeComponent, hoverComponent } = cache;        
        if( activeComponent.indexOf(id) !== -1 || hoverComponent == id ){
            return true
        }
        return false
    }

    const SwitchingState = () => {       
        const { activeComponent } = cache;        
        if( activeComponent != id ){
            dispatch({
                branch: "design-ui",
                type: "setActiveComponent",
                payload: {
                    id
                }
            })
        }        
    }

    const ComponentHover = () => {
        dispatch({
            branch: "design-ui",
            type: "setHoverComponent",
            payload: {
                id
            }
        })            
    }


    return (
        <div className="design-zone-container" style={{ zIndex }}>
            {renderFrontLiner( id, parent )}
            <div 
                className={`design-zone text-design ${ isActive() ? "design-zone-active" : "" }`} 
                onClick={ SwitchingState } onMouseEnter={ ComponentHover } 
                style={{ zIndex }}
                >
                
            </div>
            {renderBackLiner( id, parent )}
        </div>
    )
}