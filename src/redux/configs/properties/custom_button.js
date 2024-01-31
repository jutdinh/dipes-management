import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
import lang from '../property_lang'

const { getFormatedUUID } = functions

const button =  [   

    {
        id: getFormatedUUID(), 
        label: lang["props.icon"],
        type: "icon",
        path: "props.icon" 
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