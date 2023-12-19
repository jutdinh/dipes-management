import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export default () => {    
    const selectedCpn = useSelector( state => state.selectedCpn )
    const propertySet = useSelector( state => state.propertySet )

    const [ properties, setProperties ] = useState(propertySet)

    useEffect(() => {
        setProperties( propertySet )
        console.log(propertySet)
    }, [ selectedCpn ])

    const dispatch = useDispatch()
    
    const getPropByPath = ( path, object ) => {
        const value = object[ path[0] ]
        if( value && path.length > 0 ){
            return getPropByPath( path.slice(1, path.length), value )
        }else{
            return object
        }
    }
    const setPropByPath = ( object, path, value ) => {
        if( path.length == 1 ){
            object = { ...object, [ path[0] ]: value }
        }else{           
            object[path[0]] = setPropByPath( object[path[0]], path.slice(1, path.length), value )
        }
        return object
    }

    const updateSelectedComponent = (value, path) => {
        
        const newComp = setPropByPath( selectedCpn, path, value )
        
        dispatch({
            branch: "design-ui",
            type: "overideSelectedComp",
            payload: {
                component: newComp
            }
        })
    }
    
    return(
        <div className="properties">
            { properties.map( prop => {
                const { type } = prop;
                const Component = Components[ type ];
                if( Component != undefined ){
                    return <Component 
                        { ...prop } 
                        selectedCpn = { selectedCpn }
                        updateSelectedComponent={updateSelectedComponent}
                        getPropByPath = { getPropByPath }
                    />
                }else{
                    return null
                }
            }) }
        </div>
    )
}


const EntryBox = ( props )  => {
    const { 
        label, 
        path, 
        getPropByPath,
        updateSelectedComponent,
        selectedCpn
    } = props
    const splittedPath = path.split('.')
    return(
        <div className="property">
            <div className="label-box">
                <span>{ label }</span>
            </div>
            <div className="input-box">
                <input type="text" value={ getPropByPath( splittedPath, selectedCpn ) } 
                    onChange={(e) => { updateSelectedComponent(e.target.value, splittedPath) }}
                />
            </div>
        </div>
    )
}

const NumberBox = (props)  => {
    const { 
        label, 
        path, 
        getPropByPath,
        updateSelectedComponent,
        selectedCpn
    } = props

    const splittedPath = path.split('.')
    return(
        <div className="property">
            <div className="label-box">
                <span>{ label }</span>
            </div>
            <div className="input-box">
                <input type="number" value={ getPropByPath( splittedPath, selectedCpn ) } 
                    onChange={(e) => { updateSelectedComponent(parseInt(e.target.value), splittedPath) }}
                />
            </div>
        </div>
    )
}

const Components = {
    "text": EntryBox,
    "number": NumberBox
}