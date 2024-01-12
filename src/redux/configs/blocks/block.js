import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faBold, faItalic, faStrikethrough, faTextSlash, faTrash, faUnderline } from "@fortawesome/free-solid-svg-icons"
import $ from 'jquery';

export default (props) => {
    const { cache, gridState, floating, preview } = useSelector(state => state)
    const { id, zIndex, 
        insertComponent, appendChildComponent, removeComponent, 
        children, parent,
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

    const atLeastOneChildIsNotUndefined = () => {

        /**
         *  Ít nhất có một cpn con không phải undefined
         */

        const filtedChildren = children.filter(c => c != undefined)
        return filtedChildren.length
    }

    const SwitchingState = () => {
        const { activeComponent } = cache;
        if (children.length == 0) {

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

    const renderStyle = () => {
        let style = { zIndex }
        // if(  isAChildOfAFlex() ){
        //     style = { ...style, ...flex }
        // }        
        return style
    }

    if( preview ){
        return(
            <div style={ renderStyle() }>
                { children }
            </div>
        )
    }else{

        return (
            <div className="design-zone-container" style={{ zIndex }}>
                { renderFrontLiner(id, parent)}
                <div
                    className={`design-zone block-design ${isActive() ? "design-zone-active flex2-design-active" : ""}`}
                    onClick={SwitchingState} onMouseEnter={ComponentHover}
                    style={{ zIndex }}
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
                                <FontAwesomeIcon icon={faTrash} onClick={() => { removeComponent(id) }} />
                            </div>
                        </div>
                    </div>} */}
    
                </div>
                
                {/* <div className="styling-box">
                    <div className="styling" >
    
                        <div className="style-group justify-box">
                            <div className="icon-ne">
                                <FontAwesomeIcon icon={faBold} onClick={() => {  }} />
                            </div>
                            <div className="icon-ne">
                                <FontAwesomeIcon icon={faItalic} onClick={() => {  }} />
                            </div>
                            <div className="icon-ne">
                                <FontAwesomeIcon icon={faUnderline} onClick={() => {  }} />
                            </div>
                            <div className="icon-ne">
                                <FontAwesomeIcon icon={faStrikethrough} onClick={() => {  }} />
                            </div>
                        </div>
    
                    </div>
                </div> */}
    
    
    
                { renderBackLiner(id, parent) }
            </div>
        )
    }

}