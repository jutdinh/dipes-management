import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
const { getFormatedUUID } = functions


const flex =  [        
    { 
        id: getFormatedUUID(), 
        label: "Border Style",
        type: "selection",
        path: "props.style.flexDirection",
        options: [
            {
                label: "Horizontal",
                value: "row"
            },            
            {
                label: "Veritical",
                value: "column"
            },
        ] 
    },

    { 
        id: getFormatedUUID(), 
        label: "Justify content",
        type: "selection",
        path: "props.style.justifyContent",
        options: [
            {
                label: "Left",
                value: "flex-start"
            },            
            {
                label: "Center",
                value: "center"
            },
            {
                label: "Right",
                value: "flex-end"
            }
        ] 
    },

    { 
        id: getFormatedUUID(), 
        label: "Align items",
        type: "selection",
        path: "props.style.alignItems",
        options: [
            {
                label: "Top",
                value: "flex-start"
            },            
            {
                label: "Center",
                value: "center"
            },
            {
                label: "Bottom",
                value: "flex-end"
            }
        ] 
    },
    
]
export default flex