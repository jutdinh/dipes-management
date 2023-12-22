import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faBold, faCog, faItalic, faStrikethrough, faTextSlash, faTrash, faUnderline, faCaretDown } from "@fortawesome/free-solid-svg-icons"

export default (props) => {
    const { cache, gridState, floating } = useSelector(state => state)
    const { id, zIndex,
        insertComponent, appendChildComponent, removeComponent,
        children, parent,
        renderFrontLiner,
        renderBackLiner,
        style
    } = props

    const dispatch = useDispatch()


    const isActive = () => {
        const { activeComponent, hoverComponent } = cache;
        if (activeComponent.indexOf(id) !== -1 || hoverComponent == id) {
            return true
        }
        return false
    }

    const atLeastOneChildIsNotUndefined = () => {
        const filtedChildren = children.filter(c => c != undefined)
        return filtedChildren.length
    }

    const SwitchingState = () => {
        const { activeComponent } = cache;
        if (children.length == 0) {

        }
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


    const FlexAppendsChild = () => {
        appendChildComponent(id)
    }


    return (
        <div className="design-zone-container" style={{ zIndex }}>
            {renderFrontLiner(id, parent)}
            <div
                className={`design-zone flex2-design ${isActive() ? "design-zone-active " : ""}`}
                onMouseEnter={ComponentHover}
                style={{ zIndex, ...style }}
                onMouseUp={FlexAppendsChild}
            >

                {atLeastOneChildIsNotUndefined() ?
                    children
                    :
                    <div className={`placeholder ${gridState ? "grid-active" : ""}`}>
                        <span className="default-text">BLOCKS</span>
                    </div>
                }
                {/* {isActive() && <div className="flex-utilities">
                    <div className="style-group">
                        <div className="icon-ne">
                            <FontAwesomeIcon icon={faCog} onClick={() => { setDrop(!drop) }} />
                        </div>

                        <div className="icon-ne">
                            <FontAwesomeIcon icon={faTrash} onClick={() => { removeComponent(id) }} />
                        </div>

                    </div>
                </div>} */}
                <div className="trigger-bg" onClick={SwitchingState} ></div>
            </div>
            {/* {drop && <div
                className={`design-zone flex2-design ${isActive() ? "design-zone-active flex2-design-active" : ""}`}
                onClick={SwitchingState} onMouseEnter={ComponentHover}
                style={{ zIndex }}
            >
                <div className="configs">

                    <div className="title">
                        <span>Cấu hình</span>
                    </div>

                    <div className="source-config">

                        <div className="source">
                            <div className="source-title">
                                <span>Phương</span>
                            </div>
                            <div className="type-selection">
                                <div className="type">
                                    <div className="type-name">
                                        <span>{  }</span>
                                    </div>
                                    <div className="type-icon" onClick={() => { dropSwitch("direction") }}>
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    </div>
                                </div>
                                <div className="options-container" style={{ display: `${drops.source ? "block" : "none"}`, zIndex: 100 }}>
                                    <div className="options">
                                        {
                                            flexDrs.map(dir =>
                                                <div className="option" key={dir.id} onClick={() => { }}>
                                                    <span>{dir.name}</span>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>


                        </div>


                    </div>
                </div>} */}




                {renderBackLiner(id, parent)}
            </div>
    )
}