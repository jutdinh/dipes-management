import { useDispatch, useSelector } from "react-redux"
import $ from 'jquery'

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

    const FormAppendsChild = () => {
        appendChildComponent(id)
    }



    const getDecsButtonRecursive = (components) => {
        const buttons = []
        for (let i = 0; i < components.length; i++) {
            const cpn = components[i]
            const { name } = cpn
            if (name == "button") {
                buttons.push(cpn)
            } else {
                const { children } = cpn;
                if (children) {
                    const descButtons = getDecsButtonRecursive(children)
                    buttons.push(...descButtons)
                }
            }
        }
        return buttons
    }



    const findButtonByID = (components, id) => {
        const buttons = []
        for (let i = 0; i < components.length; i++) {
            const cpn = components[i]

            if (cpn.id == id) {
                buttons.push(cpn)
            } else {
                const { children } = cpn;
                if (children) {
                    const descButtons = findButtonByID(children, id)
                    buttons.push(descButtons)
                }
            }
        }
        return buttons[0]
    }


    


    if( preview ){
        return(
            <div className="design-zone-container" style={{ ...style, zIndex }}>
                           
                { children }

            </div>  
        )
    }else{

        return (
            <div className="design-zone-container" style={{ ...style, zIndex }}>
                {renderFrontLiner(id, parent)}
                <div
                    className={`design-zone form-design  ${isActive() ? "design-zone-active form-design-active" : ""}`}
                    onMouseEnter={ComponentHover}
                    style={{ zIndex }}
                    onMouseUp={FormAppendsChild}
                >
    
    
                    {atLeastOneChildIsNotUndefined() ?
                        children
                        :
                        <div className={`placeholder ${gridState ? "grid-active" : ""}`}>
                            <span className="default-text">FORM</span>
                        </div>
                    }
    
    
    
                    <div className="trigger-bg" onClick={SwitchingState} ></div>
    
                </div>
    
    
                {renderBackLiner(id, parent)}
            </div>
        )
    }


}

