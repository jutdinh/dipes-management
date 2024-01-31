import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faArrowDown, faArrowUpRightFromSquare, faCaretDown, faCheckCircle, faCircleXmark, faCog, faDownload, faEdit, faHome, faMagnifyingGlass, faSquarePlus, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons"
import { useEffect } from "react"
import $ from "jquery"


export default (props) => {
    const { cache, preview, floating, pages, page } = useSelector(state => state)
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

    const fakeDataAmount = 500;
    const [fakeData, setFakeData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    const { fields } = source
    const [drops, setDrops] = useState({
        configs: true
    })


    useEffect(() => {
        const initialFakeData = createFakeData()

        setFakeData(initialFakeData)

    }, [fields])



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
            $('#property-trigger').click()
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



    const changeTableName = (e) => {
        const newName = e.target.value;
        PropsSwitching(id, "name", newName)
    }


    const AddButton = (e) => {
        const { block } = floating
        const buttons = ["button", "redirect_button", "table_export_button", "custom_button"]

        if (buttons.indexOf(block) != -1) {
            appendChildComponent(id)
        }
    }

    const moveToAddPage = () => {
        const hiddenPage = pages.find(page => page.block == id)

        if (hiddenPage) {

            dispatch({
                branch: "side-funcs",
                type: "UpdateHiddenPageButDeHellOnTable",
                payload: {
                    block_id: id
                }
            })

            dispatch({
                branch: "design-ui",
                type: "pageSelected",
                payload: {
                    page: hiddenPage
                }
            })
        }
    }

    const parseFormatToValue = (pattern, value) => {

        const number = value
        let result = pattern
        if (!pattern) {
            result = "[N]"
        }
        const today = new Date();
        const date = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        result = result.replaceAll("[DD]", date);
        result = result.replaceAll("[MM]", month);
        result = result.replaceAll("[YYYY]", year);
        const numberPlaces = [];
        for (let i = 0; i < result.length; i++) {
            if (result[i] === '[') {
                var temp = ""
                for (let j = i + 1; j < result.length; j++) {
                    if (result[j] === 'N' && result[j] !== ']') {
                        temp += result[j];
                    } else {
                        if (result[j] === ']') {
                            numberPlaces.push(temp);
                            i = j;
                            temp = ""
                        }
                    }
                }
            }
        }

        if (numberPlaces.length == 0) {
            result += "[N]"
            numberPlaces.push("N")
        }
        const places = numberPlaces.map(place => {
            const placeLength = place.length;
            let numberLength = number.toString().length;
            let header = "";
            for (let i = 0; i < placeLength; i++) {
                header += "0";
            }
            const result = header.slice(0, placeLength - numberLength) + number.toString();
            return { place, value: result };
        })
        for (let i = 0; i < places.length; i++) {
            const { place, value } = places[i];
            result = result.replace(`[${place}]`, value)
        }
        return result;
    }

    const parseDateToFormatedValue = (format) => {
        const date = new Date()
        let result = format;
        result = result.replaceAll('dd', date.getDate())
        result = result.replaceAll('MM', date.getMonth() + 1)
        result = result.replaceAll('yyyy', date.getFullYear())

        result = result.replaceAll('ss', date.getSeconds())
        result = result.replaceAll('mm', date.getMinutes())
        result = result.replaceAll('hh', date.getHours())

        return result;
    }

    const makeSampleDataBaseOnDataType = (field, currentIndex) => {
        const { props } = field;
        const { DATATYPE, NULL, AUTO_INCREMENT, FORMAT, PATTERN, DEFAULT_TRUE, DEFAULT_FALSE, DECIMAL_PLACE } = props;
        let value
        switch (DATATYPE) {
            case "INT":
            case "INT UNSIGNED":
            case "BIGINT":
            case "BIGINT UNSIGNED":
                if (AUTO_INCREMENT) {
                    value = parseFormatToValue(PATTERN, currentIndex)
                } else {
                    value = Math.floor(Math.random() * 1000) + 100;
                }
                break;
            case "BOOL":
                value = DEFAULT_TRUE
                if (currentIndex % 4 == 0) {
                    value = DEFAULT_FALSE
                }
                break;

            case "DECIMAL":
            case "DECIMAL UNSIGNED":
                const decimalPlace = parseInt(DECIMAL_PLACE)
                const postfix = "0".repeat(decimalPlace)
                value = `${Math.floor(Math.random() * 10) + 1},${postfix}`
                break;

            case "DATE":
            case "DATETIME":
                value = parseDateToFormatedValue(FORMAT)
                break;

            case "TEXT":
                value = `${field.fomular_alias}-${Math.floor(Math.random() * 1000) + 100}`
                break;
        }

        if (NULL) {
            value = `${value} | NULL`
        }
        return value
    }


    const createFakeData = () => {
        const { fields } = source;
        const data = []
        for (let i = 0; i < fakeDataAmount; i++) {
            const record = {
                __indexing__: i + 1
            }

            for (let j = 0; j < fields.length; j++) {
                const field = fields[j]

                record[field.fomular_alias] = makeSampleDataBaseOnDataType(field, i)
            }
            data.push(record)
        }
        return data;
    }

    const calculateMaxPages = () => {
        const { row_per_page } = visibility
        let totalPages = 0
        if (row_per_page > 0) {
            totalPages = Math.ceil(fakeDataAmount / row_per_page)
        } else {
            totalPages = 1
        }
        return totalPages
    }

    const getDataInSpecificPeriod = (data) => {
        return data.slice(currentPage * visibility.row_per_page, (currentPage + 1) * visibility.row_per_page)
    }

    const movePageTo = (pageIndex) => {
        setCurrentPage(pageIndex)
    }

    const getClassNameBasedOnRole = ( field ) => {
        const { approve, unapprove } = buttons;
        let className = []

        const approveFieldId = approve.field.id;
        const unapproveFieldId = unapprove.field.id;

        if( approve.state && approveFieldId == field.id ){
            className.push("approve-field")
        }
        if( unapprove.state && unapproveFieldId == field.id ){
            className.push("unapprove-field")
        }
        return className.join('-')
    }




    if (preview) {
        return (
            <div className="design-zone-container " style={{ zIndex }}>
                {renderFrontLiner(id, parent)}
                <div
                    className={`design-zone table-design table-preview-state`}
                    style={{ zIndex }}
                >
                    {source.type == "database" &&
                        <div className="preview">

                            <div className="top-utils">
                                <div className="table-name">
                                    <span>{name}</span>
                                </div>
                                {
                                    buttons.add.state &&
                                    <div className="util icon-blue" onClick={moveToAddPage}>
                                        <FontAwesomeIcon icon={faSquarePlus} />
                                    </div>
                                }
                                {
                                    buttons.export.state &&
                                    <div className="util icon-green">
                                        <FontAwesomeIcon icon={faDownload} />
                                    </div>
                                }
                                {
                                    buttons.import.state &&
                                    <div className="util icon-flammel">
                                        <FontAwesomeIcon icon={faUpload} />
                                    </div>
                                }
                            </div>
                            <hr className="devider"/>
                            <table className="preview-table">
                                <thead>
                                    <tr>
                                        {
                                            visibility.indexing && <td>No.</td>
                                        }
                                        {source.fields?.map(field => {
                                            return <td>{field.field_name}</td>
                                        })}

                                        {source.calculates?.map(field => {
                                            return <td>{field.display_name}</td>
                                        })}

                                        {(buttons.detail.state || buttons.update.state || buttons.delete.state || buttons.approve.state || buttons.unapprove.state || source.search.state)
                                            &&
                                            <td>Thao tác</td>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {source.search.state && <tr>
                                        {
                                            visibility.indexing && <th></th>
                                        }
                                        {source.fields?.map(field => {
                                            return <td className="search-cell"><input type="text" /></td>
                                        })}
                                        {source.calculates?.map(field => {
                                            return <td className="search-cell"><input type="text" /></td>
                                        })}
                                        {(buttons.detail.state || buttons.update.state || buttons.delete.state || buttons.approve.state || buttons.unapprove.state || source.search.state)
                                            &&
                                            <td className="table-icons">
                                                <div className="icons">
                                                    <div className="table-icon"><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
                                                </div>
                                            </td>
                                        }
                                    </tr>}
                                    {
                                        getDataInSpecificPeriod(fakeData).map((record, index) => <tr>
                                            {
                                                visibility.indexing && <td>{record.__indexing__}</td>
                                            }

                                            {source.fields?.map(field => {
                                                return <td>{record[field.fomular_alias]}</td>
                                            })}
                                            {source.calculates?.map(field => {
                                                return <td>{field.fomular}</td>
                                            })}
                                            {(buttons.detail.state || buttons.update.state || buttons.delete.state || buttons.approve.state || buttons.unapprove.state || source.search.state)
                                                &&
                                                <td className="table-icons">
                                                    <div className="icons" onMouseUp={AddButton}>
                                                        {buttons.detail.state && <div className="table-icon icon-1"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /> </div>}
                                                        {buttons.update.state && <div className="table-icon icon-2"><FontAwesomeIcon icon={faEdit} /> </div>}
                                                        {buttons.delete.state && <div className="table-icon icon-3"><FontAwesomeIcon icon={faTrash} /> </div>}
                                                        {buttons.approve.state && <div className="table-icon icon-4"><FontAwesomeIcon icon={faCheckCircle} /> </div>}
                                                        {buttons.unapprove.state && <div className="table-icon icon-5"><FontAwesomeIcon icon={faCircleXmark} /> </div>}
                                                        {children}
                                                    </div>

                                                </td>
                                            }
                                        </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                    }

                    <nav aria-label="Page navigation example" style={{ display: "flex", padding: 12 }}>
                        <span className="period-display">Hiển thị {visibility.row_per_page} của {fakeData.length} kết quả. </span>
                        <ul className="pagination ml-auto">
                            {/* Nút đến trang đầu */}
                            <li className={`page-item`} onClick={() => { movePageTo(0) }}>
                                <button className="page-link">
                                    &#8810;
                                </button>
                            </li>
                            <li className={`page-item`} onClick={() => { currentPage >= 1 && movePageTo(currentPage - 1) }}>
                                <button className="page-link">
                                    &laquo;
                                </button>
                            </li>
                            {
                                [...Array(buttons.navigator.visible).keys()].map(pos => {
                                    const current = 1 + currentPage + pos - Math.floor(buttons.navigator.visible / 2)
                                    if (current > 0 && current < (calculateMaxPages())) {
                                        return (<li className={`page-item ${ (currentPage + 1) == current ? "navigator-active": "" }`} onClick={() => { movePageTo(currentPage + pos - Math.floor(buttons.navigator.visible / 2)) }} >
                                            <button className="page-link">
                                                {current}
                                            </button>
                                        </li>)
                                    }
                                })
                            }

                            <li className={`page-item`} onClick={() => { currentPage < calculateMaxPages() && movePageTo(currentPage + 1) }}>
                                <button className="page-link">
                                    &raquo;
                                </button>
                            </li>

                            <li className={`page-item`} onClick={() => { movePageTo(calculateMaxPages() - 1) }}> {/** MAY CAUSE BUG HERE */}
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
            <div className="design-zone-container" style={{ zIndex }} 
                    // onClick={SwitchingState}
                >
                {renderFrontLiner(id, parent)}
                <div
                    className={`design-zone table-design ${isActive() ? "design-zone-active" : ""}`}
                    onMouseEnter={ComponentHover}
                    style={{ zIndex }}
                >
                    
                    {source.type == "database" &&
                        <div className="preview" style={{ zIndex: 2, position: "relative" }}>

                            <div className="top-utils">
                                <div className="table-name">
                                    <input
                                        className={`main-input ${isActive() ? "input-active" : ""}`}
                                        value={name}
                                        onChange={changeTableName}
                                        // style={style}
                                    />
                                </div>
                                {
                                    buttons.add.state &&
                                    <div className="util icon-blue" onClick={moveToAddPage}>
                                        <FontAwesomeIcon icon={faSquarePlus} />
                                    </div>
                                }
                                {
                                    buttons.export.state &&
                                    <div className="util icon-green">
                                        <FontAwesomeIcon icon={faDownload} />
                                    </div>
                                }
                                {
                                    buttons.import.state &&
                                    <div className="util icon-flammel">
                                        <FontAwesomeIcon icon={faUpload} />
                                    </div>
                                }
                            </div>
                            <hr className="devider"/>
                            <table className="preview-table">
                                <thead>
                                    <tr>
                                        {
                                            visibility.indexing && <td>No.</td>
                                        }
                                        {source.fields?.map(field => {
                                            return <td  className={ getClassNameBasedOnRole( field ) }>{field.field_name}</td>
                                        })}
                                        {source.calculates?.map(field => {
                                            return <td>{field.display_name}</td>
                                        })}
                                        {(buttons.detail.state || buttons.update.state || buttons.delete.state || buttons.approve.state || buttons.unapprove.state || source.search.state)
                                            &&
                                            <td>Thao tác</td>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {source.search.state && <tr>
                                        {
                                            visibility.indexing && <th></th>
                                        }
                                        {source.fields?.map(field => {
                                            return <td className="search-cell"><input type="text" /></td>
                                        })}
                                        {source.calculates?.map(field => {
                                            return <td className="search-cell"><input type="text" /></td>
                                        })}
                                        {(buttons.detail.state || buttons.update.state || buttons.delete.state || buttons.approve.state || buttons.unapprove.state || source.search.state)
                                            &&
                                            <td className="table-icons">
                                                <div className="icons">
                                                    <div className="table-icon"><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
                                                </div>
                                            </td>
                                        }
                                    </tr>}
                                    <tr>
                                        {
                                            visibility.indexing && <td>1</td>
                                        }

                                        {source.fields?.map(field => {
                                            return <td>{field.fomular_alias}</td>
                                        })}
                                        {source.calculates?.map(field => {
                                            return <td>{field.fomular_alias} = {field.fomular}</td>
                                        })}
                                        {(buttons.detail.state || buttons.update.state || buttons.delete.state || buttons.approve.state || buttons.unapprove.state || source.search.state)
                                            &&
                                            <td className="table-icons">
                                                <div className="icons" onMouseUp={AddButton}>
                                                    {buttons.detail.state && <div className="table-icon icon-1"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /> </div>}
                                                    {buttons.update.state && <div className="table-icon icon-2"><FontAwesomeIcon icon={faEdit} /> </div>}
                                                    {buttons.delete.state && <div className="table-icon icon-3"><FontAwesomeIcon icon={faTrash} /> </div>}
                                                    {buttons.approve.state && <div className="table-icon icon-4"><FontAwesomeIcon icon={faCheckCircle} /> </div>}
                                                    {buttons.unapprove.state && <div className="table-icon icon-5"><FontAwesomeIcon icon={faCircleXmark} /> </div>}
                                                    {children}
                                                </div>

                                            </td>
                                        }
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }

                    <nav aria-label="Page navigation example" style={{ display: "flex" , padding: 12}}>
                        <span className="period-display">Hiển thị {visibility.row_per_page} của {fakeData.length} kết quả. </span>
                        <ul className="pagination ml-auto">
                            {/* Nút đến trang đầu */}
                            <li className={`page-item`} >
                                <button className="page-link">
                                    &#8810;
                                </button>
                            </li>
                            <li className={`page-item`}>
                                <button className="page-link">
                                    &laquo;
                                </button>
                            </li>
                            {
                                [...Array(buttons.navigator.visible).keys()].map(pos => <li className={`page-item`} >
                                    <button className="page-link">
                                        {currentPage + pos - Math.floor(buttons.navigator.visible / 2)}
                                    </button>
                                </li>)
                            }

                            <li className={`page-item`} >
                                <button className="page-link">
                                    &raquo;
                                </button>
                            </li>

                            <li className={`page-item`}> {/** MAY CAUSE BUG HERE */}
                                <button className="page-link" >
                                    &#8811;
                                </button>
                            </li>
                        </ul>
                    </nav>

                    <div className="trigger-bg" onClick={SwitchingState} ></div>
                </div>
                {renderBackLiner(id, parent)}
            </div>
        )
    }
}