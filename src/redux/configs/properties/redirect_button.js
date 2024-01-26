import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
import lang from '../property_lang'

const { getFormatedUUID } = functions

const button =  [      
    { 
        id: getFormatedUUID(), 
        label: lang["props.page"],
        type: "selectPage",                
        path: "props.to",
        fields: [
            {
                from: "page_id",
                to: "page_id"
            },            
            {
                from: "page_title",
                to: "page_title"
            },
            {
                from: "params",
                to: "params"
            }
        ],
        display_value: "page_title",
    },

    { 
        id: getFormatedUUID(), 
        label: lang["props.params"],
        type: "showParams",
        path: "props.to.params" 
    },

    { 
        id: getFormatedUUID(), 
        label: lang["style.color"],
        type: "color",
        path: "props.style.color" 
    },
    { 
        id: getFormatedUUID(), 
        label: lang["style.background"],
        type: "color",
        path: "props.style.backgroundColor" 
    },
]
export default button