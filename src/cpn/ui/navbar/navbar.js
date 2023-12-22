import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faUndo, faRedo, faEye } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

export default () => {
    const dispatch = useDispatch()

    const pages = useSelector( state => state.pages )
    const proxy  = useSelector( state => state.proxy )
    const { version_id } = useParams()
    const _token = localStorage.getItem("_token")
    const saveUI = () => {       

        fetch( `${ proxy }/uis/saveui`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": _token
            },
            body: JSON.stringify({ version_id, ui: pages })
        })
        // dispatch({
        //     branch: "design-ui",
        //     type: "saveCache"
        // })
    }

    const { page }= useSelector( state => state )

    

    return(
        <div className="navbar-design">
            <div className="page-name">
                <span><b>Vùng thiết kế</b></span>
            </div>
            <div className="items">
                <div className="item">
                    <div className="circle-item"> <FontAwesomeIcon icon={ faUndo }/> </div>
                </div>
                <div className="item">
                    <div className="circle-item"> <FontAwesomeIcon icon={ faRedo }/> </div>
                </div>
                <div className="item">
                    <div className="circle-item"> <FontAwesomeIcon icon={ faEye }/> </div>
                </div>
                <div className="item" onClick={ saveUI }>
                    <div className="circle-item"> <FontAwesomeIcon icon={ faCog }/></div>
                </div>                
            </div>
        </div>
    )
}