import { useDispatch, useSelector } from "react-redux"

import $ from 'jquery';

export default (props) => {
    const { cache, gridState, preview } = useSelector(state => state)
    const { id, zIndex,
        appendChildComponent, 
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


    const FlexAppendsChild = () => {
        appendChildComponent(id)
    }

    if( preview ){
        return(
            <div className="flex2-design">
                { children }
            </div>
        )
    }else{

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
                    <div className="trigger-bg" onClick={SwitchingState} ></div>
                </div>
                {renderBackLiner(id, parent)}
            </div>
        )
    }

}