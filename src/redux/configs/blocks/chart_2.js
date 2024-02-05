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
            <div className="flex2-design" style={ renderStyle() }>
                { children }
            </div>
        )
    }else{

        return (
            <div className="design-zone-container" style={{ zIndex }}>
                { renderFrontLiner(id, parent)}
                <div
                    className={`design-zone flex2-design ${isActive() ? "design-zone-active flex2-design-active" : ""}`}
                    onClick={SwitchingState} onMouseEnter={ComponentHover}
                    style={{ zIndex }}
                    onMouseUp={FlexAppendsChild}
                >
                    {atLeastOneChildIsNotUndefined() ?
                        children
                        :
                        <div className={`placeholder ${gridState ? "grid-active" : ""}`}>
                            <span className="default-text">CHART 2</span>
                        </div>
                    }                   
    
                </div>
                
                { renderBackLiner(id, parent) }
            </div>
        )
    }

}