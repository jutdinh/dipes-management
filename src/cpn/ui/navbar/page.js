import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faHome } from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from 'react-redux'

import $ from 'jquery';


export default (props) => {
    const { isDragging, icons, preview, pages, showAllPages }  = useSelector( state => state )
    
    const dispatch = useDispatch()
    const { page, pageSettingTrigger } = props

    const currentPage = useSelector( state => state.page )

    const MouseDownTrigger = () => {
        
        dispatch({
            branch: "design-ui",
            type: "setDraggingState",
            payload: {
                status: true,                
            }
        }) 

        dispatch({
            branch: "design-ui",
            type: "setDraggingPage",
            payload: {
                page: page     
            }
        })

        $('*').on( 'mouseup', () => {
            dispatch({
                branch: "design-ui",
                type: "setDraggingState",
                payload: {
                    status: false
                }
            })                   
            
            $('*').off("mouseup")
        })
    }

    const ClickTrigger = () => {

        const { children } = page 


        if( children && children.length > 0 ){

            dispatch({
                branch: "design-ui",
                type: "pageSelected",
                payload: {
                    page: children[0]
                }
            })
        }else{

            dispatch({
                branch: "design-ui",
                type: "pageSelected",
                payload: {
                    page
                }
            })
        }

        dispatch({
            branch: "design-ui",
            type: "SwitchingStateForPageSavesPreviousStateItself",
            payload: true
        })

    }

    const FrontMouseUpTrigger = () => {
        dispatch({
            branch: "design-ui",
            type: "pageMoveToFront",
            payload: {
                page
            }
        })
    }

    if( !page.is_hidden || showAllPages){        
        return (
            <div className={isDragging ? "page-container-active" : "page-container"}>
                <span className="page-front" onMouseUp={FrontMouseUpTrigger}/>
                <div className={`page ${ page.page_id == currentPage?.page_id ? "page-active": "" }`} key={page.page_id} onMouseDown={MouseDownTrigger} onClick={ ClickTrigger }>
                    <div className="icon-ne icon-center"><FontAwesomeIcon icon={ page.is_home ? faHome : icons[ page.icon ].icon } /></div>
                    <div className="name">
                        <span>{page.page_title}</span>
                    </div>
                    { !preview &&
                        <div className="icon-ne cog" onClick={(e) => { pageSettingTrigger(e, page) }}>
                            <FontAwesomeIcon icon={faCog} />
                        </div>
                    }
                </div>           
                {/* <span className="page-behind" onMouseUp={BehindMouseUpTrigger}/> */}
            </div>
        )
    }else{
        return
    }  
}