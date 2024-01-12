import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'

import { useParams } from 'react-router-dom'


export default () => {

    const { pages, proxy } = useSelector(state => state)
    const dispatch = useDispatch()

    const { version_id } = useParams()
    const _token = localStorage.getItem("_token")
    const saveUI = () => {    
        
        const validPages = pages.filter( p => !p.is_hidden )

        fetch( `${ proxy }/uis/saveui`, {
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

    const sectionSaveUi = () => {
        return (
            <div>
                <div className="config-title">
                    <span>Lưu thay đổi</span>
                </div>
                <div className="config-content">
                    <p>Sau khi xác nhận lưu, dữ liệu của bản thiết kế <br/> cũ sẽ bị <b>ghi đè </b> hoàn toàn và <b>không</b> thể <br/> khôi phục lại. <br/><br/>Xin lưu ý.</p>                    
                </div>
                <div className="buttons">
                    <button className="primary" onClick={ saveUI }>Lưu</button>
                </div>
            </div>
        )
    }

    const sectionSyncDatabaseAndAPI = () => {
        return (
            <>Sync Data</>
        )
    }

    const [selectedSection, setSelectedSection] = useState(1)
    const [Config, setConfig] = useState(sectionSaveUi())

    const sections = [
        {
            id: 1,
            name: "Lưu thay đổi",
            component: sectionSaveUi()
        },
        {
            id: 2,
            name: "Đồng bộ dữ liệu",
            component: sectionSyncDatabaseAndAPI()
        },
    ]

    return (
        <div className="floating-box ui-config" >
            <div className="title">
                <span>Cài đặt</span>
            </div>

            <div className="configs-container">
                <div className="sections">
                    {sections.map(sec =>
                        <div key={sec.id} className={`section ${sec.id == selectedSection ? "section-active" : ""}`} onClick={() => { setSelectedSection(sec.id); setConfig(sec.component) }}>
                            <span>{sec.name}</span>
                        </div>
                    )}
                </div>
                <div className="config-container">
                    <div className="scrollable-box">
                        {Config}
                    </div>
                </div>
            </div>
        </div>
    )
}