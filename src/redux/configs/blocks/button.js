import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faCog, faTrash } from "@fortawesome/free-solid-svg-icons"

import $ from 'jquery'

export default (props) => {
    const { cache, gridState, preview } = useSelector(state => state)
    const {
        id, zIndex, insertComponent, removeComponent, title, parent,
        renderFrontLiner,
        renderBackLiner,
        PropsSwitching,

        style

    } = props

    const [drop, setDrop] = useState(false)

    const dispatch = useDispatch()

    const isActive = () => {
        const { activeComponent, hoverComponent } = cache;
        if (activeComponent.indexOf(id) !== -1 || hoverComponent == id) {
            return true
        }
        return false
    }

    const SwitchingState = () => {        
        const { activeComponent } = cache;
        if (activeComponent != id) {
            dispatch({
                branch: "design-ui",
                type: "setActiveComponent",
                payload: {
                    id
                }
            })
            $('#property-trigger').click()
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

    const isAChildOfAFlex = () => {
        if (parent) {
            const { name } = parent
            if (name == "flex") {
                return true
            }
        }
        return false
    }

    const isAChildOfForm = () => {
        if (parent) {
            const { name } = parent
            if (name == "table") {
                return true
            }
        }
        return false
    }

    const isAChildOfAny = () => {
        if (parent) {            
            return true
        }
        return false
    }

    if (preview) {
        return (
            <div className="text-design" style={{ zIndex }}>
                <div className="text-entry">
                    <button className="entry-button" style={style}>{title}</button>
                </div>
            </div>
        )
    } else {

        return (
            <div className="design-zone-container" style={{ zIndex }} >
                {renderFrontLiner(id, parent)}
                <div
                    className={`design-zone text-design entry-design ${isActive() ? "design-zone-active flex2-design-active" : ""}`}
                    onClick={SwitchingState} onMouseEnter={ComponentHover}
                    style={{ zIndex }}
                >
                    <div className="entry-header-design">
                        <div className="text-entry">
                            <button className="entry-button" style={style}>{title}</button>
                        </div>
                        
                    </div>                   

                </div>


                {renderBackLiner(id, parent)}
            </div>
        )
    }

}