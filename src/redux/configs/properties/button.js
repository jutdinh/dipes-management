import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
const { getFormatedUUID } = functions


const button =  [        
    { 
        id: getFormatedUUID(), 
        label: "Content",
        type: "text",
        path: "props.title" 
    },

    { 
        id: getFormatedUUID(), 
        label: "Font Size",
        type: "number",
        path: "props.style.fontSize" 
    },

    { 
        id: getFormatedUUID(), 
        label: "Border Width",
        type: "number",
        path: "props.style.borderWidth" 
    },

    { 
        id: getFormatedUUID(), 
        label: "Border Color",
        type: "color",
        path: "props.style.borderColor" 
    },
   
    { 
        id: getFormatedUUID(), 
        label: "Border Style",
        type: "selection",
        path: "props.style.borderStyle",
        options: [
            {
                label: "Solid",
                value: "solid"
            },
            
            {
                label: "Dashed",
                value: "dashed"
            },

            {
                label: "Dotted",
                value: "dotted"
            },

            {
                label: "None",
                value: "none"
            },

        ] 
    },

    { 
        id: getFormatedUUID(), 
        label: "Border Radius",
        type: "number",
        path: "props.style.borderRadius" 
    },

    { 
        id: getFormatedUUID(), 
        label: "Color",
        type: "color",
        path: "props.style.color" 
    },

    { 
        id: getFormatedUUID(), 
        label: "Background",
        type: "color",
        path: "props.style.backgroundColor" 
    },


    { 
        id: getFormatedUUID(), 
        label: "Italic",
        type: "iconicSwitching",
        path: "props.style.fontStyle",
        values: [ "unset", "italic" ],
        icon: faItalic 
    },
    { 
        id: getFormatedUUID(), 
        label: "Bold",
        type: "iconicSwitching",
        path: "props.style.fontWeight",
        values: [ "unset", "bold" ],
        icon: faBold 
    },
    { 
        id: getFormatedUUID(), 
        label: "Underline",
        type: "iconicSwitching",
        path: "props.style.textDecoration",
        values: [ "unset", "underline" ],
        icon: faUnderline
    },
]
export default button