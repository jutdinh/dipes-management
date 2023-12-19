import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faCog, faTrash } from "@fortawesome/free-solid-svg-icons"

export default (props) => {
    const { cache, gridState } = useSelector(state => state)
    const { id, 
        zIndex, 
        insertComponent, 
        removeComponent, title, value, placeholder, required, variable_name, 
        PropsSwitching, parent, flex,
        renderFrontLiner,
        renderBackLiner, 
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

    const FrontInsertTrigger = () => {
        insertComponent(id, "front")
    }

    const BackInsertTrgger = () => {

        insertComponent(id, "back")
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
        <div className="design-zone-container" style={{ zIndex, ...flex }}>
            { renderFrontLiner(id, parent)}
            <div
                className={`design-zone text-design entry-design ${isActive() ? "design-zone-active" : ""}`}
                onClick={SwitchingState} onMouseEnter={ComponentHover}
                style={{ zIndex }}
            >
                <div className="entry-header-design">
                    <div className="text-entry">
                        <span className="entry-label">{title.visible && title.content} <span className="required">{required ? " *" : ""}</span></span>
                        <input className="entry-input" value={value} placeholder={placeholder.visible && placeholder.content} onFocus={() => { setDrop(true) }} />
                    </div>
                    {/* {
                        isActive() &&
                        <div className="btns">
                            <div className="edit-icon" onClick={() => { DropSwitch() }}>
                                <FontAwesomeIcon icon={faCog} />
                            </div>
                            <div className="edit-icon" onClick={() => { removeComponent(id) }}>
                                <FontAwesomeIcon icon={faTrash} />
                            </div>
                        </div>
                    } */}
                </div>


                {/* {drop && <div className="configs">

                    <div className="title">
                        <span>Cấu hình</span>
                    </div>
                    <div className="config">
                        <div className="config-checkbox">
                            <input type="checkbox" checked={required ? "checked" : ""} onChange={() => { PropsSwitching(id, "required", !required) }} />
                        </div>
                        <div className="config-title">
                            <span>Bắt buộc</span>
                        </div>
                    </div>                    
                    <div className="config">
                        <div className="config-checkbox">
                            <input type="checkbox" checked={title.visible ? "checked" : ""} onChange={() => { PropsSwitching(id, "title", { ...title, visible: !title.visible }) }} />
                        </div>
                        <div className="config-title">
                            <span>Nhãn</span>
                        </div>
                        <div className={`config-input-container ${true ? "" : "selection-deactive"}`}>
                            <input className="config-input" value={title.content} onChange={(e) => { PropsSwitching(id, "title", { ...title, content: e.target.value }) }} />
                        </div>
                    </div>

                    <div className="config">
                        <div className="config-checkbox">
                            <input type="checkbox" checked={placeholder.visible} onChange={() => { PropsSwitching(id, "placeholder", { ...placeholder, visible: !placeholder.visible }) }} />
                        </div>
                        <div className="config-title">
                            <span>Ghi chú ẩn</span>
                        </div>
                        <div className={`config-input-container ${true ? "" : "selection-deactive"}`}>
                            <input className="config-input" value={placeholder.content} onChange={(e) => { PropsSwitching(id, "placeholder", { ...placeholder, content: e.target.value }) }} />
                        </div>
                    </div>

                    <div className="config">
                        <div className="config-checkbox">
                            <input type="checkbox" style={{ opacity: 0 }} />
                        </div>
                        <div className="config-title">
                            <span>Tên biến</span>
                        </div>
                        <div className={`config-input-container ${true ? "" : "selection-deactive"}`}>
                            <input className="config-input" value={variable_name} onChange={(e) => { PropsSwitching(id, "variable_name", e.target.value) }} />
                        </div>
                    </div>

                </div>} */}

            </div>

            { renderBackLiner(id, parent) }
        </div>
    )
}