import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faCog, faTrash, faArrowUpRightFromSquare, faList, faLink, faHand } from "@fortawesome/free-solid-svg-icons"

import $ from 'jquery'

export default (props) => {
    const { cache, gridState, preview, icons } = useSelector(state => state)
    const {
        id, zIndex, insertComponent, removeComponent, title, parent,
        renderFrontLiner,
        renderBackLiner,
        PropsSwitching,

        style,
        icon,

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

    if (preview) {
        return (
            <div className="table-icon" style={{ ...style }}>
                <FontAwesomeIcon icon={ icons[icon].icon } />
            </div>
        )
    } else {

        return (
            <div
                className={`design-zone text-design entry-design ${isActive() ? "design-zone-active flex2-design-active" : ""}`}
                onClick={SwitchingState} onMouseEnter={ComponentHover}
                style={{ 
                    zIndex,
                    margin: 0,
                    padding: "0",
                    border: "none",
                    width: "unset",
                }}
            >              
                <div className="table-icon" style={{ ...style }}>
                    <FontAwesomeIcon icon={ icons[icon]?.icon } />
                </div>

                
            </div>

        )
    }

}