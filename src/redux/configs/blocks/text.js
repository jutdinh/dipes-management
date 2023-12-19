import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faBold, faItalic, faStrikethrough, faTextSlash, faTrash, faUnderline } from "@fortawesome/free-solid-svg-icons"
import $ from 'jquery';

export default (props) => {
    const { cache, gridState } = useSelector( state => state )
    const { children, parent, 
        content, style, id, zIndex, 
        removeComponent, insertComponent, 
        flex,
        renderFrontLiner,
        renderBackLiner,
    } = props
    
    

    const [ left,  setLeft ]  = useState("0")
    const [ right, setRight ] = useState("unset")
    const ref = useRef()
    const dispatch = useDispatch()

    const isActive = () => {
        const { activeComponent, hoverComponent } = cache;        
        if(activeComponent.indexOf(id) !== -1 || hoverComponent == id ){
            return true
        }
        return false
    }

    const SwitchingState = () => {       
        const { activeComponent } = cache;     
        if( activeComponent != id ){
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
        insertComponent( id, "front" )
    }

    const BackInsertTrgger = () => {

        insertComponent( id, "back" )
    }

    const changeText = (e) => {
        const value = e.target.value 
        dispatch({
            branch: 'design-ui',
            type: "updateComponent",
            payload: {
                id,
                values: {
                    content: value
                }
            }
        })
    }

    const changeColor = (e) => {

        dispatch({
            branch: 'design-ui',
            type: "updateComponent",
            payload: {
                id,
                values: {
                    style: { ...style, color: e.target.value }
                }
            }
        })
    }

    const changeFontSize = (e) => {
        
        dispatch({
            branch: 'design-ui',
            type: "updateComponent",
            payload: {
                id,
                values: {
                    style: { ...style, fontSize: parseInt(e.target.value) }
                }
            }
        })

    }

    const StyleSwitching = ( styleName, valueIfActive, valueIfDeactive ) => {
        let value = valueIfActive
        if( style[styleName] == valueIfActive){
            value = valueIfDeactive
        }
        dispatch({
            branch: 'design-ui',
            type: "updateComponent",
            payload: {
                id,
                values: {
                    style: { ...style, [ styleName ]: value }
                }
            }
        })
    }

    const isAChildOfAFlex = () => {
        if( parent ){
            const { name } = parent
            if( name == "flex" ){
                return true
            }
        }
        return false
    }

    const changeFlexGrow = (e) => {
        dispatch({
            branch: 'design-ui',
            type: "updateComponent",
            payload: {
                id,
                values: {
                    flex: { ...flex, flexGrow: e.target.value }
                }
            }
        })
    }
    const changeFlexOrder = (e) => {
        dispatch({
            branch: 'design-ui',
            type: "updateComponent",
            payload: {
                id,
                values: {
                    flex: { ...flex, order: e.target.value }
                }
            }
        })
    }

    const renderStyle = () => {
        let style = { zIndex }
        if(  isAChildOfAFlex() ){
            style = { ...style, ...flex }
        }        
        return style
    }

    return (
        <div className="design-zone-container" style={ renderStyle() } ref={ ref }>
            { renderFrontLiner(id, parent)}
            <div 
                className={`design-zone text-design ${ isActive() ? "design-zone-active" : "" }`} 
                onClick={ SwitchingState } onMouseEnter={ ComponentHover } 
                
                >
                
                <input 
                    className={`main-input ${ isActive() ? "input-active": "" }` } 
                    value={ content } 
                    onChange = { changeText }                
                    style={ style }
                />            
                {/* {  
                    cache.activeComponent == id &&            
                    <div className="styling-box">
                        <div className="styling" style={{ left, right }}>
                            <div className="initial-group">
                                <div className="style-group font-box">                        
                                    <input type="number" value={ style.fontSize } onChange={ changeFontSize }/>                        
                                </div>
                                <div className="style-group justify-box">
                                    <div className="icon-ne">
                                        <FontAwesomeIcon icon={ faBold } onClick={ () => { StyleSwitching( "fontWeight", "bold", "normal" ) } }/>
                                    </div>
                                    <div className="icon-ne">
                                        <FontAwesomeIcon icon={ faItalic } onClick={ () => { StyleSwitching( "fontStyle", "italic", "normal" ) }  }/>
                                    </div>
                                    <div className="icon-ne">
                                        <FontAwesomeIcon icon={ faUnderline } onClick={ () => { StyleSwitching( "textDecoration", "underline", "none" ) }  } />
                                    </div>
                                    <div className="icon-ne">
                                        <FontAwesomeIcon icon={ faStrikethrough } onClick={ () => { StyleSwitching( "textDecoration", "line-through", "none" ) }  }/>
                                    </div>
                                </div>
                                <div className="style-group justify-box">
                                    <div className="icon-ne">
                                        <FontAwesomeIcon icon={ faAlignLeft } onClick={ () => { StyleSwitching( "textAlign", "left", "left" ) }  }/>
                                    </div>
                                    <div className="icon-ne">
                                        <FontAwesomeIcon icon={ faAlignCenter } onClick={ () => { StyleSwitching( "textAlign", "center", "left" ) }  }/>
                                    </div>
                                    <div className="icon-ne">
                                        <FontAwesomeIcon icon={ faAlignRight } onClick={ () => { StyleSwitching( "textAlign", "right", "left" ) }  }/>
                                    </div>
                                    <div className="icon-ne">
                                        <FontAwesomeIcon icon={ faAlignJustify } onClick={ () => { StyleSwitching( "textAlign", "justify", "left" ) }  }/>
                                    </div>
                                </div>

                                <div className="style-group color-box">
                                    <input type="color" value={style.color} onChange={ changeColor }/>
                                </div>                                
                            </div>
                            { isAChildOfAFlex() &&
                                <div className="special-group">
                                    <div className="title">
                                        <span>Flex box</span>
                                    </div>
                                    <div className="groups">
                                        <div className="style-group font-box">                                     
                                            <input type="number" value={ flex?.flexGrow } onChange={ changeFlexGrow }/>                        
                                        </div>
                                        <div className="style-group font-box">                                     
                                            <input type="number" value={ flex?.order } onChange={ changeFlexOrder }/>                        
                                        </div>                                        
                                    </div>                                    
                                </div>
                             }

                             <div className="initial-group">
                                <div className="style-group">
                                    <div className="icon-ne">
                                        <FontAwesomeIcon icon={ faTrash } onClick={ () => { removeComponent(id) }  }/>
                                    </div>                            
                                </div>
                             </div>

                        </div>
                    </div>
                } */}
            </div>
            { renderBackLiner(id, parent) }        
        </div>
    )
}