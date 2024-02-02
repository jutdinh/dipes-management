import { faCaretDown, faCaretRight, faClose, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"

export default () => {
    const selectedCpn = useSelector(state => state.selectedCpn)
    const selectedCpns = useSelector(state => state.selectedCpns)
    const propertySet = useSelector(state => state.propertySet)

    const [properties, setProperties] = useState(propertySet)

    useEffect(() => {

        const parent = selectedCpns.find(cpn => cpn.id == selectedCpn.parent_id)
        if (parent) {
            const parents = selectedCpns?.slice(0, selectedCpns.length - 1)
            const filtedProperties = []

            for (let i = 0; i < propertySet.length; i++) {

                const { onlyExistsIn } = propertySet[i]
                let valid = false
                if (onlyExistsIn) {

                    const directParent = onlyExistsIn.find(c => c.type == "direct" && c.name == parent.name)

                    if (directParent) {
                        valid = true
                    }

                    const cascadingParents = onlyExistsIn.filter(c => c.type == "cascading")
                    const atleastOneParentIsCascading = parents.filter(par => {
                        const { name } = par;
                        const isExisted = cascadingParents.find(cpar => cpar.name == name)
                        return isExisted
                    })

                    if (atleastOneParentIsCascading.length > 0) {
                        valid = true;
                    }

                    if (valid) {
                        filtedProperties.push(propertySet[i])
                    }
                } else {
                    filtedProperties.push(propertySet[i])
                }


            }

            setProperties(filtedProperties)
        } else {
            const filtedProperties = []
            for (let i = 0; i < propertySet.length; i++) {
                const { onlyExistsIn } = propertySet[i]
                if (!onlyExistsIn) {
                    filtedProperties.push(propertySet[i])
                }
            }
            setProperties(filtedProperties)
        }
    }, [selectedCpn])

    const dispatch = useDispatch()

    const getPropByPath = (path, object) => {
        const value = object[path[0]]
        if (path.length > 0 && value != undefined) {
            return getPropByPath(path.slice(1, path.length), value)
        } else {
            if (path.length == 0) {
                return object
            } else {
                if (value == undefined) {
                    return []
                }
            }
        }
    }
    const setPropByPath = (object, path, value) => {
        if (path.length == 1) {
            object = { ...object, [path[0]]: value }
        } else {
            object[path[0]] = setPropByPath(object[path[0]], path.slice(1, path.length), value)
        }
        return object
    }

    const areParentActive = (childOf) => {
        if (childOf != undefined) {
            const { prop_id, caseIf } = childOf
            const parent = propertySet.find(p => p.id == prop_id)
            if (parent) {
                const { path } = parent;
                const value = getPropByPath(path.split('.'), selectedCpn)
                if (value == caseIf) {
                    return true
                }
            }
            return false
        }
        return true
    }

    const updateSelectedComponent = (value, path) => {

        const newComp = setPropByPath(selectedCpn, path, value)

        dispatch({
            branch: "design-ui",
            type: "overideSelectedComp",
            payload: {
                component: newComp
            }
        })
    }

    const setActiveComponent = (cpn) => {
        dispatch({
            branch: "design-ui",
            type: "setActiveComponent",
            payload: {
                id: cpn.id
            }
        })
    }

    const getCpnById = () => {

    }

    return (
        <div className="properties">
            <div className="cpn-chain">
                {selectedCpns.slice(0, selectedCpns.length - 1).map(c =>
                    <div className="cpn" onClick={() => { setActiveComponent(c) }}>
                        <span>{c.name?.toUpperCase()}</span>
                        <span><FontAwesomeIcon icon={faCaretRight} /></span>
                    </div>
                )}

                <div className="cpn">
                    <span>{selectedCpn.name?.toUpperCase()}</span>
                </div>
            </div>

            {properties.map((prop, index) => {
                const { type } = prop;
                const Component = Components[type];
                if (Component != undefined) {
                    return <Component
                        {...prop}
                        index={properties.length - index + 2}
                        selectedCpn={selectedCpn}

                        updateSelectedComponent={updateSelectedComponent}
                        getPropByPath={getPropByPath}
                        areParentActive={areParentActive}
                    />
                } else {
                    return null
                }
            })}
            {/* {
                selectedCpn.id && <UnlinkComponent selectedCpn={selectedCpn} />
            } */}
        </div>
    )
}


const flatteningComponents = (components) => {
    const cpns = []
    for (let i = 0; i < components.length; i++) {
        const { children } = components[i]
        cpns.push({ ...components[i], children: [] })
        if (children) {
            cpns.push(...flatteningComponents(children))
        }
    }
    return cpns
}


const EntryBox = (props) => {
    const {
        label,
        path,
        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        index,
        read_only
    } = props
    const splittedPath = path.split('.')

    return (
        <div className="property" style={{ zIndex: index }}>
            <div className="label-box">
                <span>{label}</span>
            </div>
            <div className="input-box">
                <input type="text" value={getPropByPath(splittedPath, selectedCpn)}
                    onChange={(e) => { updateSelectedComponent(e.target.value, splittedPath) }}
                    disabled={read_only} />
            </div>
        </div>
    )
}

const NumberBox = (props) => {
    const {
        label,
        path,
        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        index
    } = props

    const splittedPath = path.split('.')
    return (
        <div className="property" style={{ zIndex: index }}>
            <div className="label-box">
                <span>{label}</span>
            </div>
            <div className="input-box">
                <input type="number" value={getPropByPath(splittedPath, selectedCpn)}
                    onChange={(e) => { updateSelectedComponent(parseInt(e.target.value), splittedPath) }}
                />
            </div>
        </div>
    )
}

const IconicSwitchingGroup = (props) => {
    const {
        label,
        path,
        buttons,
        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        index
    } = props
    const splittedPath = path.split('.')
    const currentValue = getPropByPath(splittedPath, selectedCpn)

    return (
        <div className="property" style={{ zIndex: index }}>
            <div className="label-box">
                <span>{label}</span>
            </div>
            <div className="iconic-switches">
                {buttons.map(btn => <div className={`icon-switch-btn ${currentValue == btn.value ? " switch-activated " : ""}`}
                    onClick={() => { updateSelectedComponent(btn.value, splittedPath) }}
                >
                    <FontAwesomeIcon icon={btn.icon} />
                </div>)}
            </div>
        </div>
    )
}


const IconicSwitching = (props) => {
    const {
        label,
        path,
        values,
        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        icon,
        index
    } = props

    const splittedPath = path.split('.')

    const currentValue = getPropByPath(splittedPath, selectedCpn)

    return (
        <div className="property" style={{ zIndex: index }}>
            <div className="label-box">
                <span>{label}</span>
            </div>
            <div
                className={`iconic-switch ${currentValue == values[1] ? "switch-activated" : ""}`}
                onClick={() => { updateSelectedComponent(currentValue == values[0] ? values[1] : values[0], splittedPath) }}
            >
                <FontAwesomeIcon icon={icon} />
            </div>
        </div>
    )
}

const Color = (props) => {
    const {
        label,
        path,
        values,
        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        icon,
        index
    } = props

    const splittedPath = path.split('.')

    const currentValue = getPropByPath(splittedPath, selectedCpn)

    return (
        <div className="property" style={{ zIndex: index }}>
            <div className="label-box">
                <span>{label}</span>
            </div>
            <div
                className={`color-box`}
            >
                <input type="color" className="color-input" value={currentValue}
                    onChange={(e) => { updateSelectedComponent(e.target.value, splittedPath) }}
                />
            </div>
        </div>
    )
}

const Bool = (props) => {
    const {
        label,
        path,
        if_true,
        if_false,
        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        index
    } = props

    const splittedPath = path.split('.')

    const currentValue = getPropByPath(splittedPath, selectedCpn)

    const [drop, setDrop] = useState(false)

    let value = if_true
    if (!currentValue) {
        value = if_false
    }

    const options = [
        if_true, if_false
    ]

    return (
        <div className="property" style={{ zIndex: index }}>
            <div className="label-box">
                <span>{label}</span>
            </div>
            <div
                className={`drop-box`}
            >
                <div className="content-container" onClick={() => { setDrop(!drop) }}>
                    <div className={`content ${currentValue ? "true" : "false"}`}>
                        <span>{value.label}</span>
                    </div>
                    <div className="caret">
                        <FontAwesomeIcon icon={faCaretDown} />
                    </div>
                </div>
                <div className="options-container" style={{ display: drop ? "block" : "none" }}>
                    <div className="options" >
                        {options.map(opt =>
                            <div className="option" onClick={() => { updateSelectedComponent(opt.value, splittedPath); setDrop(false) }}>
                                <span>{opt.label}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


const ChildSelection = (props) => {
    const {
        label,
        path,
        if_true,
        if_false,
        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        types,
        scope,
        index
    } = props

    const splittedPath = path.split('.')


    const currentValue = getPropByPath(splittedPath, selectedCpn)
    const [drop, setDrop] = useState(false)

    let options = []
    const children = flatteningComponents(selectedCpn.children ? selectedCpn.children : [])
    if (scope == "cascade") {
        options = children.filter(c => types[c.name] != undefined)
    } else {
        const children = selectedCpn.children ? selectedCpn.children : []
        options = children.filter(c => types[c.name] != undefined)
    }

    const selectedChild = children.find(c => c.id == currentValue)


    const getLabel = (opt) => {
        const type = types[opt.name]
        let label = ""
        if (type) {
            const { display_value } = type;
            label = getPropByPath(display_value.split('.'), opt)
        }
        return label
    }

    return (
        <div className="property" style={{ zIndex: index }}>
            <div className="label-box">
                <span>{label}</span>
            </div>
            <div
                className={`drop-box`}
            >
                <div className="content-container" onClick={() => { setDrop(!drop) }}>
                    <div className="content">
                        <span>{selectedChild ? getLabel(selectedChild) : ""}</span>
                    </div>
                    <div className="caret">
                        <FontAwesomeIcon icon={faCaretDown} />
                    </div>
                </div>
                <div className="options-container" style={{ display: drop ? "block" : "none" }}>
                    <div className="options" >
                        {options.map(opt =>
                            <div className="option" onClick={() => {
                                updateSelectedComponent(opt.id, splittedPath);
                                setDrop(false)
                            }}>
                                <span>{getLabel(opt)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}




const ApiSelection = (props) => {
    const proxy = useSelector(state => state.proxy)
    const token = localStorage.getItem('_token')
    const {
        index,
        label,
        type,
        path,
        url,
        params,
        api_data,
        fields,
        display_value,

        getPropByPath,
        selectedCpn,
        updateSelectedComponent,

        childOf,
        areParentActive,
        sideFunction

    } = props

    const splittedPath = path.split('.')
    const PARAMS = useParams()
    const dispatch = useDispatch()

    const [options, setOptions] = useState([])
    const [drop, setDrop] = useState(false)


    useEffect(() => {
        let fromatedURL = url;
        for (let i = 0; i < params.length; i++) {
            fromatedURL = fromatedURL.replaceAll(`[${params[i]}]`, PARAMS[params[i]])
        }

        fetch(`${proxy}${fromatedURL}`, {
            method: "GET",
            headers: {
                Authorization: token
            }
        }).then(res => res.json()).then(res => {
            const data = getPropByPath(api_data.split('.'), res)
            if (data) {
                const formatedOptions = data.map(record => {
                    const object = {}

                    for (let i = 0; i < fields.length; i++) {
                        const { from, to } = fields[i]
                        object[to] = record[from]
                    }
                    return object
                })
                setOptions(formatedOptions)

            } else {
                setOptions([])
            }
        })
    }, [])

    const targetSelectTrigger = (opt) => {
        updateSelectedComponent(opt, splittedPath)

        if (sideFunction) {

            const payload = {}
            const { params } = sideFunction;

            for (let i = 0; i < params.length; i++) {
                const { from, param, translateTo } = params[i]

                if (from == "target") {
                    payload[translateTo] = getPropByPath(param.split('.'), opt)
                } else {
                    payload[translateTo] = getPropByPath(param.split('.'), selectedCpn)
                }
            }

            dispatch({
                branch: "side-funcs",
                type: sideFunction.name,
                payload
            })
        }

        setDrop(false)
    }
    const getLabel = (opt) => {
        return opt[display_value]
    }

    if (areParentActive(childOf)) {
        return (
            <div className="property" style={{ zIndex: index }}>
                <div className="label-box">
                    <span>{label}</span>
                </div>
                <div
                    className={`drop-box`}
                >
                    <div className="content-container" onClick={() => { setDrop(!drop) }}>
                        <div className="content">
                            <span>{getLabel(getPropByPath(splittedPath, selectedCpn))}</span>
                        </div>
                        <div className="caret">
                            <FontAwesomeIcon icon={faCaretDown} />
                        </div>
                    </div>
                    <div className="options-container" style={{ display: drop ? "block" : "none" }}>
                        <div className="options" >
                            {options.map(opt =>
                                <div className="option" onClick={() => {
                                    targetSelectTrigger(opt)
                                }}>
                                    <span>{getLabel(opt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}


const ListSelection = (props) => {
    const {
        label,
        path,
        options,
        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        index
    } = props

    const splittedPath = path.split('.')

    const currentValue = getPropByPath(splittedPath, selectedCpn)

    const [drop, setDrop] = useState(false)

    let value = options.find(vl => vl.value == currentValue)

    return (
        <div className="property" style={{ zIndex: index }}>
            <div className="label-box">
                <span>{label}</span>
            </div>
            <div
                className={`drop-box`}
            >
                <div className="content-container" onClick={() => { setDrop(!drop) }}>
                    <div className="content">
                        <span>{value?.label}</span>
                    </div>
                    <div className="caret">
                        <FontAwesomeIcon icon={faCaretDown} />
                    </div>
                </div>
                <div className="options-container" style={{ display: drop ? "block" : "none" }}>
                    <div className="options" >
                        {options.map(opt =>
                            <div className="option" onClick={() => { updateSelectedComponent(opt.value, splittedPath); setDrop(false) }}>
                                <span>{opt.label}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


const SelfSelection = (props) => {
    const {
        label,
        path,
        data,
        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        index,
        fields,
        display_value,

        childOf,
        areParentActive,
    } = props

    const splittedPath = path.split('.')
    const currentValue = getPropByPath(splittedPath, selectedCpn)
    const [drop, setDrop] = useState(false)

    const options = getPropByPath(data.split('.'), selectedCpn)

    const formatObjectByFields = (opt) => {
        const clone = {}
        for (let i = 0; i < fields.length; i++) {
            const { from, to } = fields[i]
            clone[to] = opt[from]
        }
        return clone
    }
    if (areParentActive(childOf)) {
        return (
            <div className="property" style={{ zIndex: index }}>
                <div className="label-box">
                    <span>{label}</span>
                </div>
                <div
                    className={`drop-box`}
                >
                    <div className="content-container" onClick={() => { setDrop(!drop) }}>
                        <div className="content">
                            <span>{currentValue?.[display_value]}</span>
                        </div>
                        <div className="caret">
                            <FontAwesomeIcon icon={faCaretDown} />
                        </div>
                    </div>
                    <div className="options-container" style={{ display: drop ? "block" : "none" }}>
                        <div className="options" >
                            {options.map(opt =>
                                <div className="option" onClick={() => { updateSelectedComponent(formatObjectByFields(opt), splittedPath); setDrop(false) }}>
                                    <span>{opt[display_value]}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}




const SelectTables = (props) => {
    const {
        label,
        path,
        fieldsPath,

        namePath,
        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        index
    } = props

    const localTables = useSelector(state => state.tables)
    const [tables, setTables] = useState(localTables) // ủa gì dị
    const [drop, setDrop] = useState(false)
    const splittedPath = path.split('.')
    const selectedTables = getPropByPath(splittedPath, selectedCpn);

    useEffect(() => {

        if (selectedTables.length > 0) {
            const foreignKeys = []
            for (let i = 0; i < selectedTables.length; i++) {
                foreignKeys.push(...selectedTables[i].foreign_keys)
            }
            const validTablesId = foreignKeys.map(key => key.table_id)
            const validTables = localTables.filter(tb => validTablesId.indexOf(tb.id) != -1)
            const selectedTablesId = selectedTables.map(tb => tb.id)

            const finalTables = validTables.filter(tb => {
                return selectedTablesId.indexOf(tb.id) == -1
            })

            setTables(finalTables)
        } else {
            setTables(localTables)
        }
    }, [selectedTables])


    const tableSelect = (table) => {
        setDrop(false)

        const newTables = [...selectedTables, table]
        if (newTables.length > 0) {

            const foreignKeys = []
            for (let i = 0; i < newTables.length; i++) {
                foreignKeys.push(...newTables[i].foreign_keys)
            }
            const validTablesId = foreignKeys.map(key => key.table_id)
            const validTables = localTables.filter(tb => validTablesId.indexOf(tb.id) != -1)
            const finalTables = validTables.filter(tb => newTables.indexOf(tb) == -1)

            setTables(finalTables)
        } else {
            setTables(localTables)
        }

        if (newTables.length == 1) {
            const { table_name } = newTables[0]
            if (namePath) {
                updateSelectedComponent(table_name, namePath.split('.'))
            }
        }

        updateSelectedComponent([...selectedTables, table], splittedPath)
    }

    const removeLastTable = () => {
        const removedTable = selectedTables[selectedTables.length - 1]
        const newTables = selectedTables.slice(0, selectedTables.length - 1)

        if (newTables.length > 0) {

            const foreignKeys = []
            for (let i = 0; i < newTables.length; i++) {
                foreignKeys.push(...newTables[i].foreign_keys)
            }
            const validTablesId = foreignKeys.map(key => key.table_id)
            const validTables = localTables.filter(tb => validTablesId.indexOf(tb.id) != -1)
            const finalTables = validTables.filter(tb => newTables.indexOf(tb) == -1)

            setTables(finalTables)

        } else {
            setTables(localTables)
        }
        const currentFields = getPropByPath(fieldsPath.split('.'), selectedCpn)

        const leftFields = currentFields.filter(f => f.table_id != removedTable.id)
        updateSelectedComponent(leftFields, fieldsPath.split('.'))
        updateSelectedComponent(newTables, splittedPath)
    }

    return (
        <div>
            <div className="property" style={{ zIndex: index }}>
                <div className="label-box">
                    <span>{label}</span>
                </div>
                <div
                    className={`drop-box`}
                >
                    <div className="content-container" onClick={() => { setDrop(!drop) }}>
                        <div className="content">
                            <span></span>
                        </div>
                        <div className="caret">
                            <FontAwesomeIcon icon={faCaretDown} />
                        </div>
                    </div>
                    <div className="options-container" style={{ display: drop ? "block" : "none" }}>
                        <div className="options" >
                            {tables.map(table =>
                                <div className="option" onClick={() => { tableSelect(table) }}>
                                    <span>{table.table_name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="property table-tag-list">
                {selectedTables.map((table, index) =>
                    <div className="table-tag">
                        <span>{table.table_name}</span>
                        {index == selectedTables.length - 1 &&
                            <span className="close" onClick={removeLastTable}>
                                <FontAwesomeIcon icon={faClose} />
                            </span>
                        }
                    </div>
                )}
            </div>
        </div>
    )
}

const TableFieldsPicker = (props) => {
    const {
        path,
        label,
        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        tablespath,
        index
    } = props
    const splittedPath = path.split('.')

    const currentValue = getPropByPath(splittedPath, selectedCpn)
    const fomularAliases = currentValue.map(f => f.fomular_alias)

    const tables = getPropByPath(tablespath.split('.'), selectedCpn)

    const fieldSelectOrNot = (field) => {
        const isFieldSelected = currentValue.find(f => f.fomular_alias == field.fomular_alias)

        let newValues = currentValue
        if (isFieldSelected) {
            newValues = currentValue.filter(f => f.fomular_alias != field.fomular_alias)
        } else {
            newValues.push(field)
        }
        updateSelectedComponent(newValues, splittedPath)
    }

    return (
        <div>
            <div className="property">
                {tables.length > 0 &&
                    <div className="">
                        <span>{label}</span>
                    </div>
                }
            </div>
            <div className="property" style={{ zIndex: index }}>
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
                                            type="checkbox" checked={fomularAliases.indexOf(field.fomular_alias) != -1}
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
        </div>
    )
}



const SingularTableFieldsPicker = (props) => {
    const {
        path,

        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        tablepath,
        index
    } = props
    const splittedPath = path.split('.')

    const dispatch = useDispatch()

    const [tables, setTables] = useState([])

    const currentValue = getPropByPath(splittedPath, selectedCpn)
    const fomularAliases = currentValue.map(f => f.fomular_alias)
    const table = getPropByPath(tablepath.split('.'), selectedCpn)

    useEffect(() => {
        if (table) {
            setTables([table])
        }
    }, [table])


    const fieldSelectOrNot = (field) => {
        const isFieldSelected = currentValue.find(f => f.fomular_alias == field.fomular_alias)

        let newValues = currentValue
        if (isFieldSelected) {
            newValues = currentValue.filter(f => f.fomular_alias != field.fomular_alias)
            /**
             *  Remove coresponding component
             */

            const componentAboutToBeRemoved = selectedCpn.children?.find(cpn => cpn.field_id == field.id)
            if (componentAboutToBeRemoved) {
                dispatch({
                    branch: "design-ui",
                    type: "removeComponent",
                    payload: {
                        id: componentAboutToBeRemoved.id
                    }
                })
            }

        } else {
            /**
             *  Add component
            */

            dispatch({
                branch: "design-ui",
                type: "addFormField",
                payload: {
                    form_id: selectedCpn.id,
                    field
                }
            })
            newValues.push(field)
        }
        updateSelectedComponent(newValues, splittedPath)
    }



    return (
        <div className="property" style={{ zIndex: index }}>
            <div
                className={'fields-picker'}
            >
                {tables.map(tb => tb.fields && <div className="table-fields-picker">
                    <div className="fields-picker-header">
                        <span>{tb.table_name}</span>
                    </div>
                    <div className="picker-field-list">
                        {tb.fields?.map(field =>
                            <div className="field-picker">
                                <div className="picker-checkbox">
                                    <input
                                        type="checkbox" checked={fomularAliases.indexOf(field.fomular_alias) != -1}
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


const TableCalculateFields = (props) => {
    const {
        path,
        label,
        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        tablespath,
        index
    } = props

    const { functions, proxy } = useSelector(state => state)
    const token = localStorage.getItem('_token')
    const splittedPath = path.split('.')
    const currentValue = getPropByPath(splittedPath, selectedCpn)

    const [focusFieldId, setFocusField] = useState("")
    const { version_id } = useParams()

    const makeCloneField = () => {
        const newCalculate = {
            id: functions.getFormatedUUID(),
            display_name: "",
            fomular_alias: "",
            fomula: ""
        }

        updateSelectedComponent([...currentValue, newCalculate], splittedPath)
    }

    const fieldChangeName = (field, newName) => {
        const fields = currentValue;
        const newFields = fields.map(f => {
            if (f.id == field.id) {
                f.display_name = newName
            }
            return f
        })

        updateSelectedComponent(newFields, splittedPath)
    }

    const fieldChangeFomular = (field, fomular) => {
        const fields = currentValue;
        const newFields = fields.map(f => {
            if (f.id == field.id) {
                f.fomular = fomular
            }
            return f
        })

        updateSelectedComponent(newFields, splittedPath)
    }

    const isFieldFocused = (id) => {
        return id == focusFieldId
    }

    const recordFocusing = (field) => {
        const { id } = field;
        setFocusField(id)
    }

    const regenerateAlias = async (field) => {
        let display_name = field.display_name;

        if (!display_name || display_name.length == 0) {
            display_name = "Trường mới"
            fieldChangeName(field, display_name)
        }

        const response = await fetch(`${proxy}/apis/make/alias`, {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ version_id, field_name: display_name })
        })
        const data = await response.json()
        const alias = data.alias;

        const newFields = currentValue.map(f => {
            if (f.id == field.id) {
                f.fomular_alias = alias
            }
            return f
        })
        updateSelectedComponent(newFields, splittedPath)
    }

    const removeField = (field) => {

        const fields = currentValue;
        const newFields = fields.filter(f => {
            return f.id != field.id
        })

        updateSelectedComponent(newFields, splittedPath)
    }

    return (
        <div className="property" style={{ zIndex: index }}>
            <div
                className={'fields-picker'}
            >

                <div className="table-fields-picker">
                    <div className="fields-picker-header">
                        <span>{label}</span>
                        <div className="add-icon" onClick={makeCloneField}>
                            <FontAwesomeIcon icon={faPlusCircle} />
                        </div>
                    </div>
                    <div className="dynamic-field-list">
                        <table>
                            <thead className="field-record">
                                <th className="record-prop display-name">Tên hiển thị</th>
                                <th className="record-prop fomular-alias">Bí danh</th>
                                <th className="record-prop fomular">Công thức tính</th>
                                <th className="trash"></th>
                            </thead>
                            <tbody>
                                {
                                    currentValue.map(field =>
                                        <tr className={`field-record ${isFieldFocused(field.id) && "field-focus"}`} onClick={() => { recordFocusing(field) }}>
                                            <td className="record-prop display-name"><input type="text" onBlur={() => { regenerateAlias(field) }} onChange={(e) => { fieldChangeName(field, e.target.value) }} value={field.display_name} /></td>
                                            <td className="record-prop fomular-alias"><span>{field.fomular_alias}</span></td>
                                            <td className="record-prop fomular"><input type="text" onChange={(e) => { fieldChangeFomular(field, e.target.value) }} value={field.fomular} /></td>
                                            <td className="trash" onClick={() => { removeField(field) }}>
                                                {isFieldFocused(field.id) && <FontAwesomeIcon icon={faTrash} />}
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}



const PrimaryTableOnlyBool = (props) => {
    const {
        label,
        path,
        tablesPath,
        data,
        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        index,
        fields,
        display_value,
        childOf,
        areParentActive,
    } = props

    const splittedPath = path.split('.')
    const splittedTablesPath = tablesPath.split('.')
    const splittedFieldsPath = data.split('.')

    const currentTables = getPropByPath(splittedTablesPath, selectedCpn)
    const currentFields = getPropByPath(splittedFieldsPath, selectedCpn)

    const currentValue = getPropByPath(splittedPath, selectedCpn)

    const [drop, setDrop] = useState(false)
    const [options, setOptions] = useState([])

    useEffect(() => {

        const options = getPropByPath(data.split('.'), selectedCpn)

        const firstTable = currentTables[0]
        if (firstTable) {
            const filtedOptions = options.filter(opt => opt.table_id == firstTable.id)
            const boolFields = filtedOptions.filter(opt => opt.props.DATATYPE == "BOOL")
            setOptions(boolFields)
        }
    }, [JSON.stringify(currentTables), JSON.stringify(currentFields)])


    const formatObjectByFields = (opt) => {
        const clone = {}
        for (let i = 0; i < fields.length; i++) {
            const { from, to } = fields[i]
            clone[to] = opt[from]
        }
        return clone
    }
    if (areParentActive(childOf)) {
        return (
            <div className="property" style={{ zIndex: index }}>
                <div className="label-box">
                    <span>{label}</span>
                </div>
                <div
                    className={`drop-box`}
                >
                    <div className="content-container" onClick={() => { setDrop(!drop) }}>
                        <div className="content">
                            <span>{currentValue?.[display_value]}</span>
                        </div>
                        <div className="caret">
                            <FontAwesomeIcon icon={faCaretDown} />
                        </div>
                    </div>
                    <div className="options-container" style={{ display: drop ? "block" : "none" }}>
                        <div className="options" >
                            {options.map(opt =>
                                <div className="option" onClick={() => { updateSelectedComponent(formatObjectByFields(opt), splittedPath); setDrop(false) }}>
                                    <span>{opt[display_value]}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const SingleFieldSelection = (props) => {
    const {
        path,
        data,

        label,

        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        index
    } = props

    const tablespath = data;

    const splittedPath = path.split('.')

    const currentValue = getPropByPath(splittedPath, selectedCpn)
    const tables = getPropByPath(tablespath.split('.'), selectedCpn)

    const fieldSelectOrNot = (field) => {
        updateSelectedComponent(field, splittedPath)
    }

    return (
        <div>
            <div className="property">
                {tables.length > 0 &&
                    <div className="">
                        <span>{label}</span>
                    </div>
                }
            </div>
            <div className="property" style={{ zIndex: index }}>
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
                                            type="checkbox" checked={currentValue.fomular_alias == field.fomular_alias}
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
        </div>
    )
}

const SelectParams = (props) => {
    const { page } = useSelector(state => state)
    const { params } = page

    const {
        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        index,

        label,
        type,
        path,
        tablespath,

    } = props


    const tables = getPropByPath(tablespath.split('.'), selectedCpn)
    const fields = []
    tables.map(tb => {
        fields.push(...tb.fields)
    })

    const validParams = params.filter(param => {
        const isParamSelected = fields.find(f => f.fomular_alias == param.fomular_alias)
        return isParamSelected
    })

    const currentValue = getPropByPath(path.split('.'), selectedCpn)

    const isFieldPicked = (field) => {
        const selected = currentValue.find(f => f.fomular_alias == field.fomular_alias)
        return selected ? true : false
    }


    const fieldSelectOrNot = (field) => {
        const isPicked = isFieldPicked(field)

        if (isPicked) {
            const newParamsSet = currentValue.filter(p => p.fomular_alias != field.fomular_alias)
            updateSelectedComponent(newParamsSet, path.split('.'))
        } else {
            updateSelectedComponent([...currentValue, field], path.split('.'))
        }
    }

    return (
        <div>
            <div className="property">
                <div className="">
                    <span>{label}</span>
                </div>

            </div>
            <div className="property" style={{ zIndex: index }}>
                <div
                    className={'fields-picker'}
                >
                    <div className="table-fields-picker">
                        <div className="picker-field-list">
                            {validParams.map(field =>
                                <div className="field-picker">
                                    <div className="picker-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={isFieldPicked(field)}
                                            onClick={() => { fieldSelectOrNot(field) }}
                                        />
                                    </div>

                                    <div className="picker-label">
                                        <span>{field.field_name} - {field.fomular_alias}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}




const SelectPage = (props) => {
    const {
        index,
        label,
        path,
        fields,
        childOf,
        areParentActive,
        display_value,
        getPropByPath,
        updateSelectedComponent,
        selectedCpn
    } = props

    const { pages } = useSelector(state => state)


    const flatteningPages = (pages) => {

        /**
         * Ép dẹp cây component thành mảng các component cùng cấp
         */

        const cpns = []
        for (let i = 0; i < pages.length; i++) {
            const { children } = pages[i]
            cpns.push({ ...pages[i] })
            if (children) {
                cpns.push(...flatteningPages(children))
            }
        }
        return cpns
    }

    const splittedPath = path.split('.')
    const currentValue = getPropByPath(splittedPath, selectedCpn)
    const [drop, setDrop] = useState(false)

    const options = flatteningPages(pages)

    const formatObjectByFields = (opt) => {
        const clone = {}
        for (let i = 0; i < fields.length; i++) {
            const { from, to } = fields[i]
            clone[to] = opt[from]
        }
        console.log(clone)
        return clone
    }
    if (areParentActive(childOf)) {
        return (
            <div className="property" style={{ zIndex: index }}>
                <div className="label-box">
                    <span>{label}</span>
                </div>
                <div
                    className={`drop-box`}
                >
                    <div className="content-container" onClick={() => { setDrop(!drop) }}>
                        <div className="content">
                            <span>{currentValue?.[display_value]}</span>
                        </div>
                        <div className="caret">
                            <FontAwesomeIcon icon={faCaretDown} />
                        </div>
                    </div>
                    <div className="options-container" style={{ display: drop ? "block" : "none" }}>
                        <div className="options" >
                            {options.map(opt =>
                                <div className="option" onClick={() => { updateSelectedComponent(formatObjectByFields(opt), splittedPath); setDrop(false) }}>
                                    <span>{opt[display_value]}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const ShowParams = (props) => {
    const {
        path,
        label,

        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        index
    } = props


    const params = getPropByPath(path.split('.'), selectedCpn)

    return (
        <div className="property" style={{ zIndex: index }}>
            <div className="label-box">
                <span>{label}</span>
            </div>

            <div className="params-list">
                {params.map((p, index) => <div className="param-record">
                    <span>{index + 1}. {p.field_name} - {p.fomular_alias}</span>
                </div>)}
            </div>

        </div>
    )

}

const ChooseSlave = (props) => {
    const {
        type,
        path,
        master,
        primary_key,
        display_value,
        fields,

        label,
        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        index
    } = props

    const primaryKey = primary_key;

    const { tables, selectedCpns } = useSelector(state => state)

    const parent = selectedCpns.find(cpn => cpn.id == selectedCpn.parent_id)
    const [drop, setDrop] = useState(false)
    if (parent) {

        const parentTables = getPropByPath(master.split('.'), parent)

        const primalTable = parentTables[0]

        const slaveTables = tables.filter(tb => {
            const { foreign_keys } = tb;
            const existedForeignKey = foreign_keys.find(key => {
                const { table_id } = key;
                return table_id == primalTable.id
            })
            return existedForeignKey
        })


        const splittedPath = path.split('.')
        const currentValue = getPropByPath(splittedPath, selectedCpn)

        const formatObjectByFields = (opt) => {
            const clone = {}
            for (let i = 0; i < fields.length; i++) {
                const { from, to } = fields[i]
                clone[to] = opt[from]
            }
            return clone
        }

        /**
         * 
         * tìm tất cả bản phụ thuộc r chọn nó ở đây
         * 
         */

        const clickTrigger = (opt) => {

            const { primary_key, fields } = primalTable


            const pKey = primary_key[0]

            const primaryField = fields.find(f => f.id == pKey)


            updateSelectedComponent(primaryField, primaryKey.split('.'));
            setDrop(false)
            updateSelectedComponent(formatObjectByFields(opt), splittedPath);
        }


        return (
            <div className="property" style={{ zIndex: index }}>
                <div className="label-box">
                    <span>{label}</span>
                </div>
                <div
                    className={`drop-box`}
                >
                    <div className="content-container" onClick={() => { setDrop(!drop) }}>
                        <div className="content">
                            <span>{currentValue?.[display_value]}</span>
                        </div>
                        <div className="caret">
                            <FontAwesomeIcon icon={faCaretDown} />
                        </div>
                    </div>
                    <div className="options-container" style={{ display: drop ? "block" : "none" }}>
                        <div className="options" >
                            {slaveTables.map(opt =>
                                <div className="option" onClick={() => { clickTrigger(opt) }}>
                                    <span>{opt[display_value]}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return
}


const ButtonChangeIcon = (props) => {
    const {
        label,
        path,

        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        index
    } = props

    const dispatch = useDispatch()

    const { icons } = useSelector( state => state )

    const splittedPath = path.split('.')
    const currentValue = getPropByPath( splittedPath, selectedCpn )

    const renderIcon = ( icon ) => {
        return icons[icon]?.icon
    }

    const changeIconTrigger = () => {
        
        dispatch({
            branch: "floating-boxes",
            type: "floatingTrigger"            
        })

        dispatch({
            branch: "floating-boxes",
            type: "setBoxType",
            payload: {
                type: "customButtonChangeIcon"
            }
        })
    }

    return (
        <div className="property" style={{ zIndex: index }}>
            <div className="label-box">
                <span>{label}</span>
            </div>
            <div
                className={`drop-box`}
            >
               <div className="icon-preview" onClick={ changeIconTrigger }>
                    <FontAwesomeIcon icon={ renderIcon(currentValue) }/>
               </div>
            </div>
        </div>
    )
}


const ChoosePreImportTable = ( props ) => {
    const {
        label,
        optionslabel,

        fieldPath,
        valuePath,
        masterTables,

        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        index
    } = props

    const { version_id } = useParams()
    const _token = localStorage.getItem("_token");
    const { tables, selectedCpns, proxy } = useSelector(state => state)

    const parent = selectedCpns.find(cpn => cpn.id == selectedCpn.parent_id)
    const [drop, setDrop] = useState(false)
    const [optionDrop, setOptionDrop] = useState(false)

    const [ fTable, setFTable ] = useState(undefined)

    const [ options, setOptions ] = useState([]) 

    useEffect(() => {

        const InitFunc = async () => {

            const field = getPropByPath( fieldPath.split('.'), selectedCpn )
            const { table_id } = field;
    
            if( table_id ){
                const table = tables.find( tb => tb.id == table_id )      
                setFTable( table )
                updateSelectedComponent(  field, fieldPath.split('.'))
                updateSelectedComponent( {}, valuePath.split('.') )
                
                setDrop( false )
    
                const res = await fetch(`${ proxy }/db/preimport/${version_id}/${table.id}`, {
                    headers: {
                        "Authorization": _token
                    }
                })
                const data = await res.json()
                console.log(data)
                setOptions( data.data )
            }
        }
        InitFunc()
        return () => {
            
        }
    }, [])


    const fieldClickTrigger = async ( field ) => {        

        const { table_id } = field;
        const table = tables.find( tb => tb.id == table_id )      
        setFTable( table )
        updateSelectedComponent(  field, fieldPath.split('.'))
        updateSelectedComponent( {}, valuePath.split('.') )
        
        setDrop( false )

        const res = await fetch(`${ proxy }/db/preimport/${version_id}/${table.id}`, {
            headers: {
                "Authorization": _token
            }
        })
        const data = await res.json()
        console.log(data)
        setOptions( data.data )
    }

    if( parent ){
        const currentField = getPropByPath( fieldPath.split('.'), selectedCpn )
        const currentValue = getPropByPath( valuePath.split('.'), selectedCpn )
        const fields = []
        const parentTables = getPropByPath( masterTables.split('.'), parent )
        parentTables.map( tb => {      
            
            const { foreign_keys } = tb;            
            
            const foreignKeyFieldsID = foreign_keys.map( key => key.field_id )
            const thisTableFields = Object.values( tb.fields )
            const foreignFields = thisTableFields.filter( f => foreignKeyFieldsID.indexOf( f.id ) != -1 ).map( field => {
               const { id } = field
               const corespondingKey = foreign_keys.find( key => key.field_id == id )

               const foreignTable = tables.find( tbl => tbl.id == corespondingKey.table_id )

                if( foreignTable.pre_import ){
                    return { ...field, table_id: corespondingKey.table_id, onTable: tb.id }
                }
            }).filter( f => f != undefined )        

            fields.push( ...foreignFields )
        })

        const valueClickTrigger = ( opt ) => {
            updateSelectedComponent( opt, valuePath.split('.') )
            setOptionDrop(false)
        }

        return (
            <div>
                <div className="property" style={{ zIndex: index + 1 }}>
                    <div className="label-box">
                        <span>{label}</span>
                    </div>
                    <div
                        className={`drop-box`}
                    >
                        <div className="content-container" onClick={() => { setDrop(!drop) }}>
                            <div className="content">
                                <span>{ currentField.field_name }</span>
                            </div>
                            <div className="caret">
                                <FontAwesomeIcon icon={faCaretDown} />
                            </div>
                        </div>
                        <div className="options-container" style={{ display: drop ? "block" : "none" }}>
                            <div className="options" >
                                {fields.map(opt =>
                                    <div className="option" onClick={() => { fieldClickTrigger(opt) }}>
                                        <span>{opt[ "field_name" ]}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                { fTable &&                
                    <div className="property" style={{ zIndex: index }}>
                        <div className="label-box">
                            <span>{ optionslabel }</span>
                        </div>
                        <div
                            className={`drop-box`}
                        >
                            <div className="content-container" onClick={() => { setOptionDrop(!optionDrop) }}>
                                <div className="content">
                                    <span>{ Object.values(currentValue).join(' - ') }</span>
                                </div>
                                <div className="caret">
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </div>
                            </div>
                            <div className="options-container" style={{ display: optionDrop ? "block" : "none" }}>
                                <div className="options" >
                                    {options.map( opt =>
                                        <div className="option" onClick={() => { valueClickTrigger(opt) }}>
                                            <span>{ Object.values(opt).join(' - ') }</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                }

            </div>
        )
    }
    return
}


const Components = {
    "text": EntryBox,
    "number": NumberBox,
    "iconicSwitchingGroup": IconicSwitchingGroup,
    "iconicSwitching": IconicSwitching,
    "color": Color,
    "bool": Bool,
    "selection": ListSelection,
    "childSelection": ChildSelection,
    "apiSelection": ApiSelection,
    "selfSelection": SelfSelection,
    "icon": ButtonChangeIcon,


    "selectTables": SelectTables, // onetimeuse
    "tablefieldspicker": TableFieldsPicker, // onetimeuse
    "singulartablefieldspicker": SingularTableFieldsPicker, // onetimeuse
    "tablecalculatefields": TableCalculateFields, // onetimeuse
    "primaryTableOnlyBool": PrimaryTableOnlyBool, // onetimeuse
    "singleFieldSelection": SingleFieldSelection,
    "selectParams": SelectParams,
    "selectPage": SelectPage,
    "showParams": ShowParams, // onetimeuse
    "chooseSlave": ChooseSlave, 

    "choosePreImportTable": ChoosePreImportTable

}

