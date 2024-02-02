import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faUndo, faRedo, faEye, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import $ from 'jquery';

export default () => {
    const dispatch = useDispatch()

    const pages = useSelector(state => state.pages)
    const proxy = useSelector(state => state.proxy)
    const preview = useSelector(state => state.preview)

    const selectedCpn = useSelector(state => state.selectedCpn)

    const { version_id } = useParams()
    const _token = localStorage.getItem("_token")
    const saveUI = () => {

        fetch(`${proxy}/uis/saveui`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": _token
            },
            body: JSON.stringify({ version_id, ui: pages })
        })
        dispatch({
            branch: "design-ui",
            type: "saveCache"
        })
    }

    const settingTrigger = (e) => {
        dispatch({
            branch: "floating-boxes",
            type: "floatingTrigger",
            payload: {
                offset: $(e.target).offset()
            }
        })

        dispatch({
            branch: "floating-boxes",
            type: "setBoxType",
            payload: {
                type: "uiConfig"
            }
        })
    }

    // const { page }= useSelector( state => state )

   

    const colors = {
        undo: "#FFEB3B",
        redo: "#FFEB3B",
        eyes: "rgb(255, 87, 34)",
        cog: "rgb(82, 166, 231)",
        trash: "red"
    }

    return (
        <div className="navbar-design" style={{ display: preview ? "none" : "flex" }}>
            <div className="page-name">
                <span><b>Vùng thiết kế</b></span>
            </div>
            <div className="items">
                <div className="item">
                    <div className="circle-item" style={{ color: colors.undo }}> <FontAwesomeIcon icon={faUndo} /> </div>
                </div>
                <div className="item">
                    <div className="circle-item" style={{ color: colors.redo }}> <FontAwesomeIcon icon={faRedo} /> </div>
                </div>
                
                <div className="item" onClick={settingTrigger}>
                    <div className="circle-item" style={{ color: colors.cog }}> <FontAwesomeIcon icon={faCog} /></div>
                </div>
                {
                    selectedCpn.id &&
                        <div className="item">
                            <div className="circle-item" style={{ color: colors.trash }}> 
                                <UnlinkComponent />
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}


const UnlinkComponent = () => {

    const { selectedCpn } = useSelector(state => state)
    const dispatch = useDispatch()



    const removeComponent = (id) => {
        dispatch({
            branch: "design-ui",
            type: "removeComponent",
            payload: {
                id: selectedCpn.id
            }
        })
    }


    return (
        <FontAwesomeIcon icon={faTrash} onClick={ removeComponent } />
    )
}