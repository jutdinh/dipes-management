import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
const { getFormatedUUID } = functions


const block =  [        
    { 
        id: getFormatedUUID(), 
        label: "Margin",
        type: "text",
        path: "props.style.margin" 
    },
    { 
        id: getFormatedUUID(), 
        label: "Padding",
        type: "text",
        path: "props.style.padding" 
    },
    
]
export default block