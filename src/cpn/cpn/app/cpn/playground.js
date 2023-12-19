import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import $ from 'jquery';

export default () => {
    const { floating, cache, page, pages } = useSelector( state => state )
    const dispatch = useDispatch()
    useEffect( () => {
        const offsetTop = window.innerHeight - 112
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

    return(
        <div id="playground" style={{ height: 12000, paddingLeft: `${ cache.navbar ? 300 : 36 }px`, position: "relative", zIndex: 1 }} >  
            { page.component.map( (cpn, index) => {
                const { Component, props, id } = cpn;
                const mergedProps = { ...props, id }
                return <Component { ...mergedProps} key={cpn.id} zIndex={ pages.length - index + 1 } removeComponent={ removeComponent } insertComponent={ insertComponent }/>
            }) }       
            <div id="playground-bg" onClick={ unsetActiveComponent } onMouseEnter={ unsetHoverComponent } />
        </div>
    )
}