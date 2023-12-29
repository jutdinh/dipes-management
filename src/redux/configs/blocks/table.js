import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faArrowDown, faArrowUpRightFromSquare, faCaretDown, faCog, faEdit, faHome, faSquarePlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import { useEffect } from "react"

export default (props) => {
    const { cache, apis, gridState, tables, preview, floating } = useSelector(state => state)
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
        appendChildComponent,
        children
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
        if (activeComponent.indexOf(id) !== -1 || hoverComponent == id) {
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


    const AddButton = (e) => {
        const { block } = floating
        if (block == "button") {
            appendChildComponent(id)
        }
    }

    const moveToAddPage = () => {
        
    }


    if (preview) {
        return (
            <div className="design-zone-container" style={{ zIndex }}>
                {renderFrontLiner(id, parent)}
                <div
                    className={`design-zone table-design`}
                    style={{ zIndex }}
                >


                    {source.type == "api" && source.api.api_id &&
                        <div className="preview">

                            <div className="top-utils">
                                <div className="table-name">
                                    <input
                                        className={`main-input ${isActive() ? "input-active" : ""}`}
                                        value={name}
                                        onChange={changeTableName}
                                        style={style}
                                    />
                                </div>
                                {
                                    buttons.add.state &&
                                    <div className="util" onClick={ moveToAddPage }>
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
                                            return <th>{field.display_name}</th>
                                        }
                                        )}
                                        {source.api.calculates.map(field => {
                                            return <th>{field.display_name}</th>
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
                                            return <td>{field.fomular_alias}</td>
                                        }
                                        )}
                                        {source.api.calculates.map(field => {
                                            return <td>{field.fomular_alias}</td>
                                        }

                                        )}
                                        <td>
                                            <div className="icons">
                                                {buttons.detail.state && <div className="icon"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /> </div>}
                                                {buttons.update.state && <div className="icon"><FontAwesomeIcon icon={faEdit} /> </div>}
                                                {buttons.delete.state && <div className="icon"><FontAwesomeIcon icon={faTrash} /> </div>}
                                                {children}
                                            </div>

                                        </td>
                                    </tr>
                                    <tr>
                                        {
                                            visibility.indexing && <td>2</td>
                                        }
                                        {source.api.fields.map(field => {
                                            return <td>{field.fomular ? `=${field.fomular}` : ""}</td>
                                        }


                                        )}
                                        {source.api.calculates.map(field => {
                                            return <td>{field.fomular ? `=${field.fomular}` : ""}</td>
                                        }

                                        )}
                                        <td>
                                            <div className="icons">
                                                {buttons.detail.state && <div className="icon"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /> </div>}
                                                {buttons.update.state && <div className="icon"><FontAwesomeIcon icon={faEdit} /> </div>}
                                                {buttons.delete.state && <div className="icon"><FontAwesomeIcon icon={faTrash} /> </div>}
                                                {children}
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
                                <div className="table-name">
                                    <input
                                        className={`main-input ${isActive() ? "input-active" : ""}`}
                                        value={name}
                                        onChange={changeTableName}
                                        style={style}
                                    />
                                </div>
                                {
                                    buttons.add.state &&
                                    <div className="util" onClick={ moveToAddPage }>
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
                                        {source.table.fields?.map(field => {
                                            return <th>{field.field_name}</th>
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
                                        {source.table.fields?.map(field => {
                                            return <td>{field.fomular_alias}</td>
                                        }

                                        )}

                                        <td>
                                            <div className="icons">
                                                <div className="icon"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /> </div>
                                                <div className="icon"><FontAwesomeIcon icon={faEdit} /> </div>
                                                <div className="icon"><FontAwesomeIcon icon={faTrash} /> </div>
                                                {children}
                                            </div>

                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }

                    <nav aria-label="Page navigation example" style={{ marginTop: "2em", display: "flex", justifyContent: "flex-end" }}>
                        <ul className="pagination mb-0">
                            {/* Nút đến trang đầu */}
                            <li className={`page-item`}>
                                <button className="page-link">
                                    &#8810;
                                </button>
                            </li>
                            <li className={`page-item`}>
                                <button className="page-link">
                                    &laquo;
                                </button>
                            </li>                       
                            
                            
                            <li className={`page-item`}>
                                <button className="page-link">
                                    &raquo;
                                </button>
                            </li>
                        
                            <li className={`page-item`}>
                                <button className="page-link" >
                                    &#8811;
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        )
    } else {

        return (
            <div className="design-zone-container" style={{ zIndex }}>
                {renderFrontLiner(id, parent)}
                <div
                    className={`design-zone table-design ${isActive() ? "design-zone-active" : ""}`}
                    onMouseEnter={ComponentHover}
                    style={{ zIndex }}
                >

                    {/* {
                            isActive() &&
                            <div className="edit-icon" onClick={() => { DropSwitch("configs") }}>
                                <FontAwesomeIcon icon={faCog} />
                            </div>
                        } */}
                    {/* {
                            isActive() &&
                            <div className="edit-icon" onClick={() => { removeComponent(id) }}>
                                <FontAwesomeIcon icon={faTrash} />
                            </div>
                        } */}
                    {/* <div className="configs" style={{ height: `${drops.configs ? "unset" : "0"}`, overflow: `${drops.configs ? "unset" : "hidden"}` }}>
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
    
                        </div>
                        <hr className="devider" />
                    </div> */}

                    {source.type == "api" && source.api.api_id &&
                        <div className="preview" style={{ zIndex: 2, position: "relative" }}>

                            <div className="top-utils">
                                <div className="table-name">
                                    <input
                                        className={`main-input ${isActive() ? "input-active" : ""}`}
                                        value={name}
                                        onChange={changeTableName}
                                        style={style}
                                    />
                                </div>
                                {
                                    buttons.add.state &&
                                    <div className="util" onClick={ moveToAddPage }>
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
                                            return <th>{field.display_name}</th>

                                        }
                                        )}
                                        {source.api.calculates.map(field => {
                                            return <th>{field.display_name}</th>

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
                                            return <td>{field.fomular_alias}</td>
                                        }
                                        )}
                                        {source.api.calculates.map(field => {

                                            return <td>{field.fomular_alias}</td>
                                        }

                                        )}
                                        <td>
                                            <div className="icons" onMouseUp={AddButton}>
                                                {buttons.detail.state && <div className="icon"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /> </div>}
                                                {buttons.update.state && <div className="icon"><FontAwesomeIcon icon={faEdit} /> </div>}
                                                {buttons.delete.state && <div className="icon"><FontAwesomeIcon icon={faTrash} /> </div>}
                                                {children}
                                            </div>

                                        </td>
                                    </tr>
                                    <tr>
                                        {
                                            visibility.indexing && <td>2</td>
                                        }
                                        {source.api.fields.map(field => {
                                            return <td>{field.fomular ? `=${field.fomular}` : ""}</td>
                                        }


                                        )}
                                        {source.api.calculates.map(field => {
                                            return <td>{field.fomular ? `=${field.fomular}` : ""}</td>
                                        }

                                        )}
                                        <td>
                                            <div className="icons" onMouseUp={AddButton}>
                                                {buttons.detail.state && <div className="icon"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /> </div>}
                                                {buttons.update.state && <div className="icon"><FontAwesomeIcon icon={faEdit} /> </div>}
                                                {buttons.delete.state && <div className="icon"><FontAwesomeIcon icon={faTrash} /> </div>}
                                                {children}
                                            </div>

                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }
                    {source.type == "database" &&
                        <div className="preview" style={{ zIndex: 2, position: "relative" }}>

                            <div className="top-utils">
                                <div className="table-name">
                                    <input
                                        className={`main-input ${isActive() ? "input-active" : ""}`}
                                        value={name}
                                        onChange={changeTableName}
                                        style={style}
                                    />
                                </div>
                                {
                                    buttons.add.state &&
                                    <div className="util" onClick={ moveToAddPage }>
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
                                        {source.table.fields?.map(field => {
                                            return <th>{field.field_name}</th>

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
                                        {source.table.fields?.map(field => {
                                            return <td>{field.fomular_alias}</td>
                                        }

                                        )}

                                        <td>
                                            <div className="icons" onMouseUp={AddButton}>
                                                <div className="icon"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /> </div>
                                                <div className="icon"><FontAwesomeIcon icon={faEdit} /> </div>
                                                <div className="icon"><FontAwesomeIcon icon={faTrash} /> </div>
                                                {children}
                                            </div>

                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }

                    <div className="trigger-bg" onClick={SwitchingState} ></div>
                </div>
                {renderBackLiner(id, parent)}
            </div>
        )
    }
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