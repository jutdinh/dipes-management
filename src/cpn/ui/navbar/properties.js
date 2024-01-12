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
            if( path.length == 0 ){
                return object
            }else{
                if( value == undefined ){
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
            {
                selectedCpn.id && <UnlinkComponent selectedCpn={selectedCpn} />
            }
        </div>
    )
}

const UnlinkComponent = (props) => {

    const dispatch = useDispatch()

    const {
        selectedCpn,
    } = props

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
        <div className="property">
            <div
                className={`iconic-switch icon-trash`}
                onClick={() => { removeComponent() }}
            >
                <FontAwesomeIcon icon={faTrash} />
            </div>
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
                    <div className="content">
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


        getPropByPath,
        updateSelectedComponent,
        selectedCpn,
        index
    } = props

    const localTables = useSelector(state => state.tables)
    const [tables, setTables] = useState(localTables)
    const [drop, setDrop] = useState(false)
    const splittedPath = path.split('.')
    const selectedTables = getPropByPath(splittedPath, selectedCpn);



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
                                    <span>{field.field_name}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>)}
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
        if( table ){
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
            
            const componentAboutToBeRemoved = selectedCpn.children.find( cpn => cpn.field_id == field.id )
            dispatch({
                branch: "design-ui",
                type: "removeComponent",
                payload: {
                    id: componentAboutToBeRemoved.id
                }
            })
            
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
                                    <span>{field.field_name}</span>
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
        const newFields = fields.map( f => {
            if( f.id == field.id ){
                f.display_name = newName                
            }
            return f 
        } )

        updateSelectedComponent(newFields, splittedPath)
    }

    const fieldChangeFomular = (field, fomular ) => {
        const fields = currentValue;
        const newFields = fields.map( f => {
            if( f.id == field.id ){
                f.fomular = fomular                
            }
            return f 
        } )

        updateSelectedComponent(newFields, splittedPath)
    }

    const isFieldFocused = (id) => {
        return id == focusFieldId
    }

    const recordFocusing = (field) => {
        const { id } = field;
        setFocusField(id)
    }

    const regenerateAlias = async ( field ) => {
        let display_name = field.display_name;

        if( !display_name || display_name.length == 0 ){
            display_name = "Trường mới"
            fieldChangeName( field, display_name )
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

        const newFields = currentValue.map( f => {
            if( f.id == field.id ){
                f.fomular_alias = alias
            }
            return f 
        } )
        updateSelectedComponent( newFields, splittedPath )
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
                                            <td className="record-prop display-name"><input type="text" onBlur={ () => { regenerateAlias(field) } } onChange={(e) => { fieldChangeName(field, e.target.value) }} value={field.display_name} /></td>
                                            <td className="record-prop fomular-alias"><span>{field.fomular_alias}</span></td>
                                            <td className="record-prop fomular"><input type="text" onChange={(e) => { fieldChangeFomular(field, e.target.value) }} value={field.fomular} /></td>
                                            <td className="trash">
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
    const [ options, setOptions ] = useState([])

    useEffect(() =>{       

        const options = getPropByPath(data.split('.'), selectedCpn)

        const firstTable = currentTables[0]
        if( firstTable ){
            const filtedOptions  = options.filter( opt => opt.table_id == firstTable.id )            
            const boolFields = filtedOptions.filter( opt => opt.props.DATATYPE == "BOOL" )
            setOptions(boolFields)
        }
    }, [ JSON.stringify(currentTables), JSON.stringify(currentFields) ])


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

    "selectTables": SelectTables, // onetimeuse
    "tablefieldspicker": TableFieldsPicker, // onetimeuse
    "singulartablefieldspicker": SingularTableFieldsPicker, // onetimeuse
    "tablecalculatefields": TableCalculateFields, // onetimeuse
    "primaryTableOnlyBool": PrimaryTableOnlyBool, // onetimeuse
}

