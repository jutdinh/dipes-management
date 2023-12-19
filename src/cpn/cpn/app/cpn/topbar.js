import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useDispatch } from 'react-redux'

export default () => {
    const dispatch = useDispatch()

    const reverseNavBarState = () => {
        
        dispatch({
            branch: "design-ui",
            type: "reverseNavBarState"
        })    
    }

    return(
        <div className="app-topbar">
            <div className="toggle" onClick={ reverseNavBarState }>
                 <FontAwesomeIcon icon={ faBars }/>
            </div>
        </div>
    )
}