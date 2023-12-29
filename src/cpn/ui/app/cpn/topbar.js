import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from 'react-redux'

export default () => {
    const dispatch = useDispatch()
    const { preview } = useSelector(state => state)
    const reverseNavBarState = () => {
        
        dispatch({
            branch: "design-ui",
            type: "reverseNavBarState"
        })    
    }

    return(
        <div className="app-topbar" style={preview ? { display:  "none" }: {}}>
            <span><b>Cấu trúc trang</b></span>          
        </div>
    )
}