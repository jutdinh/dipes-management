import { faCaretDown, faCaretRight, faTrash } from "@fortawesome/free-solid-svg-icons"
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
        setProperties(propertySet)
    }, [selectedCpn])

    const dispatch = useDispatch()

    const getPropByPath = (path, object) => {
        const value = object[path[0]]
        if (path.length > 0 && value != undefined) {
            return getPropByPath(path.slice(1, path.length), value)
        } else {
            return object
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

    const setActiveComponent = (cpn)  => {
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
                { selectedCpns.slice(0, selectedCpns.length - 1).map( c =>
                    <div className="cpn" onClick={ () => {setActiveComponent( c ) }}>
                        <span>{ c.name?.toUpperCase() }</span>
                        <span><FontAwesomeIcon icon={ faCaretRight }/></span>
                    </div>    
                ) }

                    <div className="cpn">
                        <span>{ selectedCpn.name?.toUpperCase() }</span>                        
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
                    />
                } else {
                    return null
                }
            })}
            {
                selectedCpn && <UnlinkComponent selectedCpn={selectedCpn} />
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
        index
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
                />
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
    const proxy = useSelector( state => state.proxy )
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
        updateSelectedComponent
    } = props

    const splittedPath = path.split('.')
    const PARAMS = useParams()

    const [options, setOptions] = useState([])
    const [drop, setDrop] = useState(false)

    useEffect(() => {
        let fromatedURL = url;
        for (let i = 0; i < params.length; i++) {
            fromatedURL = fromatedURL.replaceAll(`[${params[i]}]`, PARAMS[params[i]])
        }

        fetch(`${proxy}${ fromatedURL }`, {
            method: "GET",
            headers: {
                Authorization: token
            }
        }).then( res => res.json() ).then( res => {
            const data = getPropByPath(api_data.split('.'), res)
            if( data ){
                const formatedOptions = data.map( record => {
                    const object = {}

                    for( let i = 0 ; i < fields.length; i++ ){
                        const { from, to } = fields[i]
                        object[to] = record[from]
                    }
                    return object
                })
                setOptions(formatedOptions)
                
            }else{
                setOptions([])
            }
        })
    },[])

    const targetSelectTrigger = (opt) => {
        updateSelectedComponent( opt, splittedPath )
        setDrop(false)
    }
    const getLabel = ( opt ) => {
        return opt[display_value]
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
                        <span>{ getLabel( getPropByPath( splittedPath, selectedCpn ) ) }</span>
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
                                <span>{ getLabel(opt) }</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
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

    let value = options.find( vl => vl.value == currentValue )

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
                            <div className="option" onClick={() => {  updateSelectedComponent(opt.value, splittedPath ); setDrop(false) }}>
                                <span>{opt.label}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
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
}