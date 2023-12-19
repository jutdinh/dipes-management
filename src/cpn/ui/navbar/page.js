import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faHome, faSeedling } from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from 'react-redux'

import $ from 'jquery';


export default (props) => {
    const isDragging  = useSelector(state => state.isDragging)
    const icons = useSelector( state => state.icons )
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

    const BehindMouseUpTrigger = () => {
        dispatch({
            branch: "design-ui",
            type: "pageMoveToBehind",
            payload: {
                page
            }
        })
    }

    
    return (
        <div className={isDragging ? "page-container-active" : "page-container"}>
            <span className="page-front" onMouseUp={FrontMouseUpTrigger}/>
            <div className={`page ${ page.page_id == currentPage?.page_id ? "page-active": "" }`} key={page.page_id} onMouseDown={MouseDownTrigger} onClick={ ClickTrigger }>
                <div className="icon-ne icon-center"><FontAwesomeIcon icon={ page.is_home ? faHome : icons[ page.icon ].icon } /></div>
                <div className="name">
                    <span>{page.page_title}</span>
                </div>
                <div className="icon-ne cog" onClick={(e) => { pageSettingTrigger(e, page) }}>
                    <FontAwesomeIcon icon={faCog} />
                </div>
            </div>           
            {/* <span className="page-behind" onMouseUp={BehindMouseUpTrigger}/> */}
        </div>
    )
}