import { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faArrowsUpDownLeftRight, faCog, faEdit, faHome, faIcons, faRocket, faStar, faTrash } from "@fortawesome/free-solid-svg-icons"


export default () => {    
    const dispatch = useDispatch()
    const { floating, cache } = useSelector(state => state)
    const { offset } = floating
    
    const ref = useRef()
    const [ top, setTop ] = useState(0)

    const [ name, setName ] = useState( cache.page.page_title )

    const calculateTop = () => {
        const windowHeight = window.innerHeight;
        const { top } = offset;

        const height = ref.current.offsetHeight;
        if( height + top > windowHeight ){
            offset.top = offset.top - height + 40
        }
        return offset.top - 60
    }

    useEffect(() => {        
        setTop(calculateTop())
    }, [offset.top])

    useEffect(() => {
        setName( cache.page.page_title )
    }, [cache.page])

    const changeName = () => {

        dispatch({
            branch: "floating-boxes",
            type: "setBoxType",
            payload: {
                type: "pageChangeName"
            }
        })
    }

    const handleKeyUp = (e) => {
        if( e.keyCode == 13 ){
            saveName()
        }
    }

    const handleChangeName = (e) => {
        const { value } = e.target;
        setName( value )
    }


    const remove = () => {
        dispatch({
            branch: "design-ui",
            type: "removeCurrentPage"
        })
        dispatch({
            branch: "floating-boxes",
            type: "floatingTrigger"            
        })
    }

    const saveName = () => {
        dispatch({
            branch: "floating-boxes",
            type: "setBoxType",
            payload: {
                type: "pageModify"
            }
        })

        dispatch({ 
            branch: "design-ui",
            type: "updatePageName",
            payload: {
                name
            }
        })
    }

    const createChildPage = () => {
        dispatch({ 
            branch: "design-ui",
            type: "createChildPage"            
        })
        dispatch({
            branch: "floating-boxes",
            type: "floatingTrigger"            
        })
    }

    const setHomePage = () => {
        dispatch({ 
            branch: "design-ui",
            type: "setHomePage"            
        })
    }

    const changeIcon = () => {
        dispatch({
            branch: "floating-boxes",
            type: "setBoxType",
            payload: {
                type: "pageChangeIcon"
            }
        })
    }

    return (
        <div ref={ref} className="floating-box page-modify" style={{ top, left: `${ 312 }px` }}>
            { floating.type == "pageModify" ?
                <>
                    <div className="page-name">
                        <span>{ cache.page.page_title }</span>
                    </div>

                    <div className="page-utils">
                        <div className="util" onClick={ changeName }>
                            <div className="icon-container">
                                <FontAwesomeIcon icon={ faEdit } />
                            </div>
                            <span className="content">Đổi tên</span>
                        </div>
                        <div className="util" onClick={ createChildPage }>
                            <div className="icon-container">
                                <FontAwesomeIcon icon={ faAdd } />
                            </div>
                            <span className="content">Tạo trang con</span>
                        </div>
                        <div className="util" onClick={ setHomePage }>
                            <div className="icon-container">
                                <FontAwesomeIcon icon={ faHome } />
                            </div>
                            <span className="content">Đặt làm trang chủ</span>
                        </div>

                        <div className="util" onClick={ changeIcon }>
                            <div className="icon-container">
                                <FontAwesomeIcon icon={ faIcons } />
                            </div>
                            <span className="content">Đổi icon</span>
                        </div>

                        <div className="util" onClick={ remove }  style={{ color: "#ff6655" }}>
                            <div className="icon-container">
                                <FontAwesomeIcon icon={ faTrash } />
                            </div>
                            <span className="content">Xóa</span>
                        </div>
                    </div>
                </>
                :

                <>
                    <div className="page-name">
                        <span>Đổi tên trang</span>
                    </div>

                    <div className="page-utils" style={{display: "flex", "flexDirection": "column"}}>
                        <div className="util-input">
                            <input value={ name } onChange={ handleChangeName } onKeyUp={handleKeyUp}/>
                        </div>

                        <div className="util-btn" style={{ marginTop: "3em" }} onClick ={ () => { saveName() } }>
                            <button>Xong</button>
                        </div>

                    </div>
                </>
            }
            

        </div>
    )
}