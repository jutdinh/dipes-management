import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faBold, faItalic, faStrikethrough, faTextSlash, faTrash, faUnderline } from "@fortawesome/free-solid-svg-icons"
import $ from 'jquery';

export default (props) => {
    const { cache, gridState, preview } = useSelector(state => state)
    const { children, parent,
        content, style, id, zIndex,
        removeComponent, insertComponent,
        flex,
        field,
        renderFrontLiner,
        renderBackLiner,
    } = props



    const [left, setLeft] = useState("0")
    const [right, setRight] = useState("unset")
    const ref = useRef()
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


    const [ axis, setAxis ] = useState(["0", "-100%", "-100%"])






    const isAChildOfAFlex = () => {
        if (parent) {
            const { name } = parent
            if (name == "flex") {
                return true
            }
        }
        return false
    }


    const renderStyle = () => {
        let style = { zIndex }
        if (isAChildOfAFlex()) {
            style = { ...style, ...flex }
        }
        return style
    }
    if (preview) {
        return (
            <div className="image-design" style={renderStyle()}>
                <div className="images">
                    <img src="/assets/image/default.png" />
                </div>
            </div>
        )
    } else {
        return (
            <div className="design-zone-container" style={renderStyle()} ref={ref}>
                {renderFrontLiner(id, parent)}
                <div
                    className={`design-zone image-design ${isActive() ? "design-zone-active" : ""}`}
                    onClick={SwitchingState} onMouseEnter={ComponentHover}
                >
                    <div className="images">
                        <div className="image-container" style={{ left: axis[0] }}>
                            <img src="/assets/image/default.png" />
                        </div>
                        <div className="image-container" style={{ left: axis[1] }}>
                            <img src="/assets/image/default.png" />
                        </div>
                        <div className="image-container" style={{ left: axis[2] }}>
                            <img src="/assets/image/default.png" />
                        </div>
                    </div>
                    <div className="btns">
                        <button onClick={ () => { setAxis(["0", "100%", "-100%"]) } }></button>
                        <button onClick={ () => { setAxis(["-100%", "0", "100%"]) } }></button>
                        <button onClick={ () => { setAxis(["100%", "-100%", "0"]) } }></button>
                    </div>
                </div>
                {renderBackLiner(id, parent)}
            </div>
        )
    }
}