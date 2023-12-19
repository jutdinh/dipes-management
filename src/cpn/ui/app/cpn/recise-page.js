import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from 'react-redux'

export default (props) => {    
    const icons = useSelector( state => state.icons )
    const dispatch = useDispatch()
    const { page } = props


    const ClickTrigger = () => {
        dispatch({
            branch: "design-ui",
            type: "pageSelected",
            payload: {
                page
            }
        })
    }

    
    return (
        <div className={"page-container"}>
            {/* <span className="page-front"/> */}
                <div className="page" key={page.page_id} onClick={ ClickTrigger } style={{ padding: "4px 6px" }}>
                    <div className="icon-ne"><FontAwesomeIcon icon={ page.is_home ? faHome : icons[ page.icon ].icon } /></div>                              
                </div>
            {/* <span className="page-behind"/>     */}
        </div>
    )
}