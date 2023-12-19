import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import $ from 'jquery';

export default () => {
    const { floating, cache, page, functions, gridState } = useSelector( state => state )
    
    const dispatch = useDispatch()
    useEffect( () => {
        const offsetTop = window.innerHeight - 51
        $('#playground').css({
            marginTop: `-${ offsetTop }px`
        })
    }, [])

    const unsetActiveComponent = (e) => {
        dispatch({
            branch: "design-ui",
            type: "setActiveComponent",
            payload: {
                id: ""
            }
        })
    }

    const unsetHoverComponent = (e) => {
        dispatch({
            branch: "design-ui",
            type: "setHoverComponent",
            payload: {
                id: ""
            }
        })
    }

    const removeComponent = (id) => {
        dispatch({
            branch: "design-ui",
            type: "removeComponent",
            payload: {
                id
            }
        })
    }

    const insertComponent = ( id, position ) => {
        dispatch({
            branch: "design-ui",
            type: "insertComponent",
            payload: {
                id,
                position,
                block: floating.block 
            }
        })
    }

    const appendChildComponent = (id) => {
        dispatch({
            branch: "design-ui",
            type: "appendChildComponent",
            payload: {
                id,                
                block: floating.block 
            }
        })
    }  

  
    
    const modifyChildren = (id, children = []) => {
        dispatch({
            branch: 'design-ui',
            type: "modfifyComponentChildren",
            payload: {
                id,
                children
            }
        })
    }


    const renderComponents = (components = [], parent = undefined) => {
        return components.map( (cpn, index) => {
            const { props, id, name, children } = cpn;                            
            const mergedProps = { ...props, id }
            
            const Component = functions.getComponentByName(name)            
            if( Component ){
                return <Component { ...mergedProps} key={cpn.id} zIndex={ components.length - index + 1 } 
                    removeComponent= { removeComponent } 
                    parent         = { parent}
                    leaves         = { children }

                    insertComponent= { insertComponent } 
                    appendChildComponent = {appendChildComponent}
                    PropsSwitching = { PropsSwitching}

                    renderFrontLiner = { renderFrontLiner }
                    renderBackLiner  = { renderBackLiner }

                    modifyChildren = { modifyChildren }

                >{ renderComponents( children, cpn ) }</Component>
            }
        })
    }

    const PropsSwitching = (id, propName, value) => {
        dispatch({
            branch: 'design-ui',
            type: "updateComponent",
            payload: {
                id,
                values: {
                    [propName]: value
                }
            }
        })
    }

    const renderFrontLiner = (id, parent = {}) => {
        const { name } = parent
        let widget = <span className={`front-line ${gridState ? "line-active" : ""}`} onMouseUp={() => { insertComponent(id, "front") }} />

        if( name == "flex" ){
            widget = null;
        }
        return widget
    }

    const renderBackLiner = (id, parent = {}) => {

        const { name } = parent 
        let widget = <span className={`back-line ${gridState ? "line-active" : ""}`} onMouseUp={() => { insertComponent(id, "back") }} />

        if( name == "flex" ){
            widget = null;
        }
        return widget
    }

    return(
        <div id="playground" style={{ height: 12000, paddingLeft: `${ cache.navbar ? 300 : 36 }px`, position: "relative", zIndex: 1 }} >  
            {/* { page.component.map( (cpn, index) => {
                const { props, id, name } = cpn;                
                const mergedProps = { ...props, id }
                const Component = functions.getComponentByName(name)
                
                if( Component ){
                    return <Component { ...mergedProps} key={cpn.id} zIndex={ pages.length - index + 1 } 
                        removeComponent={ removeComponent } 
                        insertComponent={ insertComponent } 
                        appendChildComponent = {appendChildComponent}
                    ></Component>
                }
            }) }*/}

            { renderComponents( page.component ) }
            <div id="playground-bg" onClick={ unsetActiveComponent } onMouseEnter={ unsetHoverComponent } />
        </div>
    )
}