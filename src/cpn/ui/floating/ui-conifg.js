import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'

import { useParams } from 'react-router-dom'


export default (props) => {

    const { pageSettingTrigger } = props

    const { pages, proxy } = useSelector(state => state)
    const dispatch = useDispatch()

    const { version_id } = useParams()
    const token = localStorage.getItem("_token")
    
    const saveUI = () => {    
        
        const validPages = pages

        fetch( `${ proxy }/uis/saveui`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({ version_id, ui: validPages })
        }).then(res => res.json()).then((res) => {
            pageSettingTrigger()
        })
        dispatch({
            branch: "design-ui",
            type: "saveCache"
        })
    }

    const syncData = () => {
        fetch(`${ proxy }/uis/${ version_id }/savedui`, {
            headers: {
                "Authorization": token
            },            
        }).then((res) => res.json()).then(res => {
            const { ui } = res.data;
            const { last_modified_by, last_modified_at, pages } = ui
            
            dispatch({
                branch: "design-ui",
                type: "initState",
                payload: {
                    pages
                }
            })
        })


        fetch(`${ proxy }/apis/v/${ version_id }`, {
            headers: {
                "Authorization": token
            }
        }).then( res => res.json() ).then( res => {
            const { apis } = res.data;
            dispatch({
                branch: "default",
                type: "setAPIList",
                payload: { apis }
            })
        })

        fetch(`${ proxy }/db/tables/v/${ version_id }/tables/fields`, {
            headers: {
                "Authorization": token
            }
        }).then( res => res.json() ).then( res => {
            const { tables, fields } = res.data;            
            
            dispatch({
                branch: "default",
                type: "setDatabase",
                payload: { tables, fields }
            })

        })
        pageSettingTrigger()
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
            <div className="sync-data">
                <div className="config-title">
                    <span>Đồng bộ dữ liệu</span>
                </div>
                <div className="config-content">
                    <p>Đồng bộ dữ liệu từ các config mới vừa được thay đổi ở module khác có liên quan như API, Database ... </p>
                </div>
                <div className="buttons">
                    <button className="primary" onClick={ syncData }>Đồng bộ</button>
                </div>
            </div>
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
