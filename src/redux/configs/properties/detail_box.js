import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
import lang from '../property_lang'


const { getFormatedUUID } = functions
const detail_box =  [  
    
    { 
        id: getFormatedUUID(), 
        label: lang["props.tables"],
        type: "selectTables",                
        path: "props.tables",
        namePath: "props.name",
        fieldsPath: "props.fields"
    },

    {
        id: getFormatedUUID(),
        label: lang["props.fields"],
        type: "tablefieldspicker",
        path: "props.fields",
        tablespath: "props.tables"      
    },

    { 
        id: getFormatedUUID(), 
        label: lang["props.params"],
        type: "selectParams",                
        path: "props.params",
        tablespath: "props.tables"  
    },

    { 
        id: getFormatedUUID(), 
        label: lang["style.padding"],
        type: "text",
        path: "props.style.padding" 
    },
    { 
        id: getFormatedUUID(), 
        label: lang["style.margin"],
        type: "text",
        path: "props.style.margin" 
    },
    
]
export default detail_box