import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
import lang from '../property_lang'

const { getFormatedUUID } = functions


const detail_image =  [        
    
    {
        id: getFormatedUUID(), 
        label: lang["props.field"],
        type: "pickdetailsinglepropertybutonlymultiplefiletype",
        masterpath: "props.fields",
        path: "props.field",
        display_field: "field_name"
    },

   

   
    
    { 
        id: getFormatedUUID(), 
        label: lang["style.margin"],
        type: "text",
        path: "props.style.margin" 
    },
    { 
        id: getFormatedUUID(), 
        label: lang["style.padding"],
        type: "text",
        path: "props.style.padding" 
    },
]
export default detail_image