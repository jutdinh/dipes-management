import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faCog, faTrash } from "@fortawesome/free-solid-svg-icons"

export default (props) => {
    const { cache, gridState, preview } = useSelector(state => state)
    const { id,
        zIndex,
        title, value, placeholder, required,
        parent, flex,
        labelStyle,
        renderFrontLiner,
        renderBackLiner,
    } = props

    const dispatch = useDispatch()

    const isActive = () => {
        const { activeComponent, hoverComponent } = cache;
        if (activeComponent.indexOf(id) !== -1 || hoverComponent == id) {
            return true
        }
        return false
    }

    const SwitchingState = (e) => {
        e.stopPropagation()
        const { activeComponent } = cache;
        if (activeComponent != id) {
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



    if (preview) {
        return (
            <div className="text-design">
                <div className="text-entry">
                    <span className="entry-label" style={labelStyle}>{title.visible && title.content} <span className="required">{required ? " *" : ""}</span></span>
                    <input className="entry-input" value={value} placeholder={placeholder.visible && placeholder.content}  />
                </div>
            </div>
        )
    } else {

        return (
            <div className="design-zone-container" style={{ zIndex, ...flex }}>
                {renderFrontLiner(id, parent)}
                <div
                    className={`design-zone text-design entry-design ${isActive() ? "design-zone-active" : ""}`}
                    onClick={SwitchingState} onMouseEnter={ComponentHover}
                    style={{ zIndex }}
                >
                    <div className="entry-header-design">
                        <div className="text-entry">
                            <span className="entry-label" style={labelStyle}>{title.visible && title.content} <span className="required">{required ? " *" : ""}</span></span>
                            <input className="entry-input" value={value} placeholder={placeholder.visible && placeholder.content}  />
                        </div>

                    </div>

                </div>

                {renderBackLiner(id, parent)}
            </div>
        )
    }

}