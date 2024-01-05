import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useDispatch, useSelector } from 'react-redux'

export default () => {
    const dispatch = useDispatch()
    const { preview, showAll, showAllPages } = useSelector(state => state)

    const SwitchingPageShowAllOrNot = () => {
        
        dispatch({
            branch: "design-ui",
            type: "SwitchingPageShowAllOrNot"
        })    
    }    

    return(
        <div className="app-topbar" style={preview ? { display:  "none" }: {}}>
            <span><b>Cấu trúc trang</b></span>     

            <div className="hide-or-show" onClick={ SwitchingPageShowAllOrNot }>
                <FontAwesomeIcon icon={ showAllPages ? faEye : faEyeSlash } />
            </div>     
        </div>
    )
}