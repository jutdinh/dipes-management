import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faA, faAdd, faBars, faEye, faEyeSlash, faFileCirclePlus, faList, faListCheck, faPlusCircle, faXmark } from "@fortawesome/free-solid-svg-icons"
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

    const createPage = () => {
        dispatch({
            branch: "design-ui",
            type: "createPage"
        })
    }

    return(
        <div className="app-topbar" style={preview ? { display:  "none" }: {}}>
            <span><b>Cấu trúc trang</b></span>     

            <div className="hide-or-show ml-auto" style={{ color: "rgb(30, 208, 133)" }} onClick={ createPage }>
                <FontAwesomeIcon icon={ faFileCirclePlus } />                
            </div>  

            <div className="hide-or-show" style={{ color: "#cddc39" }} onClick={ SwitchingPageShowAllOrNot }>
                <FontAwesomeIcon icon={ !showAllPages ? faList : faListCheck } />
            </div>     
        </div>
    )
}