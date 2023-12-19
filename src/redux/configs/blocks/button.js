import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faCog, faTrash } from "@fortawesome/free-solid-svg-icons"

export default (props) => {
    const { cache, gridState } = useSelector(state => state)
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

    const DropSwitch = () => {
        setDrop(!drop)
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


    return (
        <div className="design-zone-container" style={{ zIndex }}>
            {renderFrontLiner(id, parent)}
            <div
                className={`design-zone text-design entry-design ${isActive() ? "design-zone-active flex2-design-active" : ""}`}
                onClick={SwitchingState} onMouseEnter={ComponentHover}
                style={{ zIndex }}
            >
                <div className="entry-header-design">
                    <div className="text-entry">
                        <button className="entry-button">{title}</button>
                    </div>
                    {
                        isActive() &&
                        <div className="btns">
                            <div className="edit-icon" onClick={() => { DropSwitch() }}>
                                <FontAwesomeIcon icon={faCog} />
                            </div>
                            <div className="edit-icon" onClick={() => { removeComponent(id) }}>
                                <FontAwesomeIcon icon={faTrash} />
                            </div>
                        </div>
                    }
                </div>

                {/* {drop && <div className="configs">

                    <div className="title">
                        <span>Cấu hình</span>
                    </div>
                    <div className="config">
                        <div className="config-checkbox">
                            <input type="checkbox" style={{ opacity: 0 }} />
                        </div>
                        <div className="config-title">
                            <span>Nhãn</span>
                        </div>
                        <div className={`config-input-container ${true ? "" : "selection-deactive"}`}>
                            <input className="config-input" value={title} onChange={(e) => { PropsSwitching(id, "title", e.target.value) }} />
                        </div>
                    </div>

                </div>} */}

            </div>


            {renderBackLiner(id, parent)}
        </div>
    )
}