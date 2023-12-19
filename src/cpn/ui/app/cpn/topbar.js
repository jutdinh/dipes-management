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
            <span><b>Cấu trúc trang</b></span>          
        </div>
    )
}