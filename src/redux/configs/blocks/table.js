import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faArrowDown, faArrowUpRightFromSquare, faCaretDown, faCog, faEdit, faHome, faSquarePlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { useEffect } from "react"

export default (props) => {
    const { cache, apis, gridState, tables } = useSelector(state => state)
    const { id, zIndex,
        name,
        style,
        source,
        buttons,
        visibility,
        removeComponent,
        insertComponent,
        PropsSwitching,
        parent,
        renderFrontLiner,
        renderBackLiner,
    } = props

    const dispatch = useDispatch()

    const sourceTypes = [
        { type: "database", name: "Cơ sở dữ liệu" },
        { type: "api", name: "API" }
    ]


    const [drops, setDrops] = useState({
        configs: true
    })


    useEffect(() => {

    }, [])



    const isActive = () => {
        const { activeComponent, hoverComponent } = cache;
        if (activeComponent.indexOf(id) !== -1|| hoverComponent == id) {
            return true
        }
        return false
    }

    const SwitchingState = () => {
        const { activeComponent } = cache;
        if (activeComponent != id) {
            dispatch({
                branch: "design-ui",
                type: "setActiveComponent",
                payload: {
                    id
                }
            })
        }
    }

    const ComponentHover = () => {
        dispatch({
            branch: "design-ui",
            type: "setHoverComponent",
            payload: {
                id
            }
        })
    }

    const FrontInsertTrigger = () => {
        insertComponent(id, "front")
    }

    const BackInsertTrgger = () => {

        insertComponent(id, "back")
    }

    const getSourceName = () => {
        const type = source.type
        let result = "Vô định"
        for (let i = 0; i < sourceTypes.length; i++) {
            if (type == sourceTypes[i].type) {
                result = sourceTypes[i].name
            }
        }
        return `${result}`;
    }

    const DropSwitch = (name) => {
        drops[name] = !drops[name]
        setDrops({ ...drops })
    }

    const changeTableName = (e) => {
        const newName = e.target.value;
        PropsSwitching(id, "name", newName)
    }

    const changeSourceType = (src) => {
        const newSource = { ...source }
        newSource.type = src.type;
        PropsSwitching(id, "source", newSource)
        DropSwitch("source")
    }

    const changeSourceApi = (api) => {
        api.fields = api.fields.map(f => { f.show = true; return f })
        const newSource = { ...source }
        console.log(api)
        newSource.api = {
            api_id: api.api_id,
            api_name: api.api_name,
            fields: api.fields,
            calculates: api.calculates
        };

        PropsSwitching(id, "source", newSource)
        DropSwitch("apiSource")

    }

    const ApiSelection = (api, type) => {
        const newProp = buttons[type]
        newProp.api = {
            api_id: api.api_id,
            api_name: api.api_name
        };
        buttons[type].api = newProp.api
        console.log(buttons)
        PropsSwitching(id, "buttons", buttons)
        DropSwitch(type)
    }

    const changeButtonState = (type) => {
        const newProp = buttons[type]
        newProp.state = !newProp.state
        buttons[type] = newProp
        PropsSwitching(id, "buttons", buttons)

    }

    const changeNavigation = (e) => {
        buttons.navigator.visible = e.target.value
        PropsSwitching(id, "buttons", buttons)
    }

    const changeMaxRow = (e) => {
        visibility.row_per_page = e.target.value;
        PropsSwitching(id, "visibility", visibility)
    }

    const changeIndexingState = (e) => {
        visibility.indexing = !visibility.indexing
        PropsSwitching(id, "visibility", visibility)
    }

    const changeSourceTable = (table) => {
        table.fields = table.fields.map(f => { f.show = true; return f })

        const newSource = { ...source }
        newSource.table = {
            table_id: table.id,
            table_name: table.table_name,
            fields: table.fields
        }
        PropsSwitching(id, "source", newSource)
        DropSwitch("apiSource")
        PropsSwitching(id, "name", table.table_name)
    }

    const apiFieldSwitching = (field) => {
        const { fields, calculates } = source.api
        for (let i = 0; i < fields.length; i++) {
            const f = fields[i]
            if (f.fomular_alias == field.fomular_alias) {
                fields[i].show = !fields[i].show
            }
        }
        for (let i = 0; i < calculates.length; i++) {
            const f = calculates[i]
            if (f.fomular_alias == field.fomular_alias) {
                calculates[i].show = !calculates[i].show
            }
        }
        const newSource = { ...source }
        newSource.api.fields = fields;
        newSource.api.calculates = calculates;
        PropsSwitching(id, "source", newSource)
    }

    const tableFieldSwitching = (field) => {
        const { fields } = source.table;
        for (let i = 0; i < fields.length; i++) {
            const f = fields[i]
            if (f.fomular_alias == field.fomular_alias) {
                fields[i].show = !fields[i].show
            }
        }

        const newSource = { ...source }
        newSource.table.fields = fields;
        PropsSwitching(id, "source", newSource)
    }


    return (
        <div className="design-zone-container" style={{ zIndex }}>
            { renderFrontLiner(id, parent)}
            <div
                className={`design-zone table-design ${isActive() ? "design-zone-active" : ""}`}
                onClick={SwitchingState} onMouseEnter={ComponentHover}
                style={{ zIndex }}
            >
                <div className="table-name">
                    <input
                        className={`main-input ${isActive() ? "input-active" : ""}`}
                        value={name}
                        onChange={changeTableName}
                        style={style}
                    />
                    {
                        isActive() &&
                        <div className="edit-icon" onClick={() => { DropSwitch("configs") }}>
                            <FontAwesomeIcon icon={faCog} />
                        </div>
                    }
                    {/* {
                        isActive() &&
                        <div className="edit-icon" onClick={() => { removeComponent(id) }}>
                            <FontAwesomeIcon icon={faTrash} />
                        </div>
                    } */}
                </div>
                <div className="configs" style={{ height: `${drops.configs ? "unset" : "0"}`, overflow: `${drops.configs ? "unset" : "hidden"}` }}>
                    <div className="title">
                        <span>Cấu hình</span>
                    </div>
                    <div className="source-config">

                        <div className="source">
                            <div className="source-title">
                                <span>Nguồn dữ liệu </span>
                            </div>
                            <div className="type-selection">
                                <div className="type">
                                    <div className="type-name">
                                        <span>{getSourceName()}</span>
                                    </div>
                                    <div className="type-icon" onClick={() => { DropSwitch("source") }}>
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    </div>
                                </div>
                                <div className="options-container" style={{ display: `${drops.source ? "block" : "none"}`, zIndex: 100 }}>
                                    <div className="options">
                                        {
                                            sourceTypes.map(src =>
                                                <div className="option" key={src.type} onClick={() => { changeSourceType(src) }}>
                                                    <span>{src.name}</span>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>


                        {source.type == 'api' ?

                            <div className="api-drop">
                                <div className="api-drop-title">
                                    <span>API</span>
                                </div>
                                <div className="selection">
                                    <div className="select">
                                        <div className="select-name">
                                            <span>{source.api.api_name ? source.api.api_name : "Chọn API"}</span>
                                        </div>
                                        <div className="drop-icon" onClick={() => { DropSwitch("apiSource") }}>
                                            <FontAwesomeIcon icon={faCaretDown} />
                                        </div>
                                    </div>
                                    <div className="options-container" style={{ display: `${drops.apiSource ? "block" : "none"}`, zIndex: 99 }}>
                                        <div className="options">
                                            {
                                                apis.map(api =>
                                                    <div className="option" key={api.api_id} onClick={() => { changeSourceApi(api) }}>
                                                        <span>{api.api_name}</span>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="api-drop">
                                <div className="api-drop-title">
                                    <span>API</span>
                                </div>
                                <div className="selection">
                                    <div className="select">
                                        <div className="select-name">
                                            <span>{source.table.table_name ? source.table.table_name : "Chọn bảng"}</span>
                                        </div>
                                        <div className="drop-icon" onClick={() => { DropSwitch("apiSource") }}>
                                            <FontAwesomeIcon icon={faCaretDown} />
                                        </div>
                                    </div>
                                    <div className="options-container" style={{ display: `${drops.apiSource ? "block" : "none"}`, zIndex: 99 }}>
                                        <div className="options">
                                            {
                                                tables.map(table =>
                                                    <div className="option" key={table.id} onClick={() => { changeSourceTable(table) }}>
                                                        <span>{table.table_name}</span>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }



                    </div>
                    <hr className="devider" />
                    {source.type == "api" ?
                        <div className="buttons">
                            <Button title={"Nút thêm"} drops={drops} api_type={"add"} DropSwitch={DropSwitch} changeButtonState={changeButtonState} buttons={buttons} apis={apis} zIndex={98} ApiSelection={ApiSelection} />
                            <Button title={"Nút xóa"} drops={drops} api_type={"delete"} DropSwitch={DropSwitch} changeButtonState={changeButtonState} buttons={buttons} apis={apis} zIndex={97} ApiSelection={ApiSelection} />
                            <Button title={"Nút sửa"} drops={drops} api_type={"update"} DropSwitch={DropSwitch} changeButtonState={changeButtonState} buttons={buttons} apis={apis} zIndex={96} ApiSelection={ApiSelection} />
                            <Button title={"Nút chi tiết"} drops={drops} api_type={"detail"} DropSwitch={DropSwitch} changeButtonState={changeButtonState} buttons={buttons} apis={apis} zIndex={95} ApiSelection={ApiSelection} />
                            <hr className="devider" />
                        </div> : null
                    }


                    <div className="visibility" >
                        <div className="" style={{ display: "flex" }}>

                            <div className="api-drop navigation">
                                <div className="api-drop-checkbox">
                                    <input type="checkbox" checked={buttons["navigator"]?.state ? "checked" : ""} onChange={() => { changeButtonState("navigator") }} />
                                </div>
                                <div className="api-drop-title" style={{ width: "max-content" }}>
                                    <span>Thanh điều hướng</span>
                                </div>

                                <div className={`selection ${buttons["navigator"]?.state ? "" : "selection-deactive"}`}>

                                    <div className="input-box">
                                        <input type="number" value={buttons["navigator"]?.visible} onChange={(e) => { changeNavigation(e) }} />
                                    </div>
                                </div>
                            </div>
                            <div className="api-drop navigation">
                                <div className="api-drop-title" style={{ width: "max-content" }}>
                                    <span>Số dòng tối đa</span>
                                </div>

                                <div className={`selection`}>

                                    <div className="input-box">
                                        <input type="number" value={visibility.row_per_page} onChange={(e) => { changeMaxRow(e) }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="api-drop navigation">
                            <div className="api-drop-checkbox">
                                <input type="checkbox" checked={visibility.indexing ? "checked" : ""} onChange={() => { changeIndexingState("") }} />
                            </div>
                            <div className="api-drop-title" style={{ width: "max-content" }}>
                                <span>Cột số thứ tự</span>
                            </div>
                        </div>

                        {
                            source.type == "api" && [...source.api.fields, ...source.api.calculates].map(field =>
                                <div className="api-drop navigation">
                                    <div className="api-drop-checkbox">
                                        <input type="checkbox" checked={field.show ? "checked" : ""} onClick={() => { apiFieldSwitching(field) }} />
                                    </div>
                                    <div className="api-drop-title" style={{ width: "max-content" }}>
                                        <span>{field.display_name}</span>
                                    </div>
                                </div>
                            )
                        }

                        {
                            source.type == "database" && source.table?.fields.map(field =>
                                <div className="api-drop navigation">
                                    <div className="api-drop-checkbox">
                                        <input type="checkbox" checked={field.show ? "checked" : ""}  onClick={() => { tableFieldSwitching(field) }} />
                                    </div>
                                    <div className="api-drop-title" style={{ width: "max-content" }}>
                                        <span>{field.field_name}</span>
                                    </div>
                                </div>
                            )
                        }

                    </div>
                    <hr className="devider" />
                </div>

                {source.type == "api" && source.api.api_id &&
                    <div className="preview">

                        <div className="top-utils">
                            {
                                buttons.add.state &&
                                <div className="util">
                                    <FontAwesomeIcon icon={faSquarePlus} />
                                </div>
                            }
                        </div>
                        <table className="preview-table">
                            <thead>
                                <tr>
                                    {
                                        visibility.indexing && <th>#</th>
                                    }
                                    {source.api.fields.map(field => {
                                        if (field.show) {
                                            return <th>{field.display_name}</th>
                                        }
                                    }
                                    )}
                                    {source.api.calculates.map(field => {
                                        if (field.show) {
                                            return <th>{field.display_name}</th>
                                        }
                                    }
                                    )}
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {
                                        visibility.indexing && <td>1</td>
                                    }
                                    {source.api.fields.map(field => {
                                        if (field.show) {
                                            return <td>{field.fomular_alias}</td>
                                        }
                                    }
                                    )}
                                    {source.api.calculates.map(field => {
                                        if (field.show) {
                                            return <td>{field.fomular_alias}</td>
                                        }
                                    }

                                    )}
                                    <td>
                                        <div className="icons">
                                            {buttons.detail.state && <div className="icon"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /> </div>}
                                            {buttons.update.state && <div className="icon"><FontAwesomeIcon icon={faEdit} /> </div>}
                                            {buttons.delete.state && <div className="icon"><FontAwesomeIcon icon={faTrash} /> </div>}
                                        </div>

                                    </td>
                                </tr>
                                <tr>
                                    {
                                        visibility.indexing && <td>2</td>
                                    }
                                    {source.api.fields.map(field => {
                                        if (field.show) {
                                            return <td>{field.fomular ? `=${field.fomular}` : ""}</td>
                                        }
                                    }


                                    )}
                                    {source.api.calculates.map(field => {
                                        if (field.show) {
                                            return <td>{field.fomular ? `=${field.fomular}` : ""}</td>
                                        }
                                    }

                                    )}
                                    <td>
                                        <div className="icons">
                                            {buttons.detail.state && <div className="icon"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /> </div>}
                                            {buttons.update.state && <div className="icon"><FontAwesomeIcon icon={faEdit} /> </div>}
                                            {buttons.delete.state && <div className="icon"><FontAwesomeIcon icon={faTrash} /> </div>}
                                        </div>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                }
                {source.type == "database" &&
                    <div className="preview">

                        <div className="top-utils">
                            <div className="util">
                                <FontAwesomeIcon icon={faSquarePlus} />
                            </div>
                        </div>
                        <table className="preview-table">
                            <thead>
                                <tr>
                                    {
                                        visibility.indexing && <th>#</th>
                                    }
                                    {source.table.fields?.map(field =>
                                        {
                                            if (field.show) {
                                                return <th>{field.field_name}</th>
                                            }
                                        }
                                        
                                    )}
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {
                                        visibility.indexing && <td>1</td>
                                    }
                                    {source.table.fields?.map(field =>                                        {
                                            if (field.show) {
                                                return <td>{field.fomular_alias}</td>
                                            }
                                        }
                                        
                                    )}

                                    <td>
                                        <div className="icons">
                                            <div className="icon"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /> </div>
                                            <div className="icon"><FontAwesomeIcon icon={faEdit} /> </div>
                                            <div className="icon"><FontAwesomeIcon icon={faTrash} /> </div>
                                        </div>

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                }

            </div>
            { renderBackLiner(id, parent) }
        </div>
    )
}


const Button = (props) => {

    const { title, drops, api_type, DropSwitch, apis, zIndex, ApiSelection, buttons, changeButtonState } = props

    return (
        <div className="api-drop">
            <div className="api-drop-checkbox">
                <input type="checkbox" checked={buttons[api_type]?.state ? "checked" : ""} onChange={() => { changeButtonState(api_type) }} />
            </div>
            <div className="api-drop-title">
                <span>{title}</span>
            </div>
            <div className={`selection ${buttons[api_type]?.state ? "" : "selection-deactive"}`}>
                <div className="select">
                    <div className="select-name">
                        <span>{buttons[api_type].api.api_name ? buttons[api_type].api.api_name : "Chọn API"}</span>
                    </div>
                    <div className="drop-icon" onClick={() => { DropSwitch(api_type) }}>
                        <FontAwesomeIcon icon={faCaretDown} />
                    </div>
                </div>
                <div className="options-container" style={{ display: `${drops[api_type] ? "block" : "none"}`, zIndex }}>
                    <div className="options">
                        {
                            apis.map(api =>
                                <div className="option" key={api.api_id} onClick={() => { ApiSelection(api, api_type) }}>
                                    <span>{api.api_name}</span>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}