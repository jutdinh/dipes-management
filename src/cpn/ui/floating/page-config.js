import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'


export default (props) => {
    const { pageSettingTrigger } = props
    const {cache } = useSelector(state => state)
    
    const [selectedSection, setSelectedSection] = useState(1)
    const sections = [
        {
            id: 1,
            name: "Cấu hình chung",
            component: SectionGeneral
        },
        {
            id: 2,
            name: "Tham số",
            component: SectionParams
        },
    ]
    
    
    

    return (
        <div className="floating-box page-config" >
            <div className="title">
                <span>{ cache.page.page_title }</span>
            </div>

            <div className="configs-container">
                <div className="sections">
                    { sections.map(sec =>
                        <div key={sec.id} 
                            className={`section ${sec.id == selectedSection ? "section-active" : ""}`} 
                            onClick={() => { setSelectedSection(sec.id) }}
                            >
                            <span>{sec.name}</span>
                        </div>
                    )}
                </div>
                {  }
                <div className="config-container">
                    <div className="scrollable-box">
                         { selectedSection == 1 && <SectionGeneral/> }
                         { selectedSection == 2 && <SectionParams/> }
                    </div>
                </div>
            </div>
        </div>
    )
}


const SectionParams = () => {
    const { tables, cache } = useSelector(state => state)

    const dispatch = useDispatch()
    const { params } = cache.page

    const fomularAliases = params? params.map( f => f.fomular_alias )  : []
    

    const fieldSelectOrNot = (field) => {
        const IsFieldAlreadyPicked = fomularAliases.find( alias => alias == field.fomular_alias )
        
        if( !IsFieldAlreadyPicked ){
            const { page } = cache
            if( !page.params ){
                page.params = []
            }
            page.params.push( field )
            dispatch({
                branch: "floating-boxes",
                type: "setCache",
                payload: {
                    name: "page",
                    value: page
                }
            })
            dispatch({
                branch: "design-ui",
                type: "updatePageParams",
                payload: {
                    params: page.params
                }
            })
        }else{
            const { page } = cache
            
            page.params = page.params.filter( p => p.fomular_alias != field.fomular_alias )
            dispatch({
                branch: "floating-boxes",
                type: "setCache",
                payload: {
                    name: "page",
                    value: page
                }
            })
            dispatch({
                branch: "design-ui",
                type: "updatePageParams",
                payload: {
                    params: page.params
                }
            })
        }
    }

    return (
        <div>
            <div className="config-title">
                <span>THAM SỐ</span>
            </div>              
            <div
                    className={'fields-picker'}
                >
                    {tables.map(tb => <div className="table-fields-picker">
                        <div className="fields-picker-header">
                            <span>{tb.table_name}</span>
                        </div>
                        <div className="picker-field-list">
                            {tb.fields.map(field =>
                                <div className="field-picker">
                                    <div className="picker-checkbox">
                                        <input
                                            type="checkbox" 
                                            checked={fomularAliases.indexOf(field.fomular_alias) != -1}
                                            onClick={() => { fieldSelectOrNot(field) }}
                                        />
                                    </div>

                                    <div className="picker-label">
                                        <span>{field.field_name} - {field.fomular_alias}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>)}
                </div>
        </div>
    )
}

const SectionGeneral = (props) => {

    const { cache, functions } = useSelector(state => state)

    const dispatch = useDispatch()

    const changePageName = (e) => {
        const { page } = cache;
        page.page_title = e.target.value;

        dispatch({
            branch: "floating-boxes",
            type: "setCache",
            payload: {
                name: "page",
                value: page
            }
        })

        dispatch({
            branch: "design-ui",
            type: "updatePageName",
            payload: {
                name: e.target.value
            }
        })
    }

    const pageVisibilitySwitch = (state) => {
        const { page } = cache;
        page.is_hidden = state

        dispatch({
            branch: "floating-boxes",
            type: "setCache",
            payload: {
                name: "page",
                value: page
            }
        })

        dispatch({
            branch: "design-ui",
            type: "updatePageVisibility",
            payload: {
                is_hidden: state
            }
        })
    }

    return (
        <div>
            <div className="config-title">
                <span>CÀI ĐẶT CHUNG</span>
            </div>              
            <div className="property text-property">
                <div className="label">
                    <span>Tên trang</span>
                </div>
                <div className="input-text">
                    <input type="text" value={ cache.page.page_title } onChange={ changePageName }/>
                </div>
            </div>
            <div className="property text-property">
                <div className="label">
                    <span>URL</span>
                </div>
                <div className="input-text">
                    <input type="text" value={ functions.makePageURL(cache.page ) } disabled={true}/>                    
                </div>
            </div>

            <div className="property checkbox-property">
                <div className="label">
                    <span>Trạng thái</span>
                </div>
                <div className="checkboxes">
                    <div className="checkbox-contain">
                        <div className="checkbox">
                            <input type="checkbox" checked={ !cache.page.is_hidden } onClick={ () => { pageVisibilitySwitch(false) } }/>
                        </div>
                        <div className="checkbox-label">
                            <span>Hiện</span>
                        </div>
                    </div>
                    <div className="checkbox-contain">
                        <div className="checkbox">
                            <input type="checkbox" checked={ cache.page.is_hidden } onClick={ () => { pageVisibilitySwitch(true) } }/>
                        </div>
                        <div className="checkbox-label">
                            <span>Ẩn</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}