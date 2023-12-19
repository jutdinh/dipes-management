import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from './functions'
const { getFormatedUUID } = functions

const properties = {
    "text": [        
        { 
            id: getFormatedUUID(), 
            label: "Content",
            type: "text",
            path: "props.content" 
        },
       
        { 
            id: getFormatedUUID(), 
            label: "Font size",
            type: "number",
            path: "props.style.fontSize" 
        },
        { 
            id: getFormatedUUID(), 
            label: "Color",
            type: "color",
            path: "props.style.color"
        },
        { 
            id: getFormatedUUID(), 
            label: "Text Alignment",
            type: "iconicSwitchingGroup",
            path: "props.style.textAlign",
            buttons: [
                { 
                    id: getFormatedUUID(),
                    icon: faAlignLeft,
                    value: "left"
                },
                { 
                    id: getFormatedUUID(),
                    icon: faAlignCenter,
                    value: "center"
                },
                { 
                    id: getFormatedUUID(),
                    icon: faAlignRight,
                    value: "right"
                },
                { 
                    id: getFormatedUUID(),
                    icon: faAlignJustify,
                    value: "justify"
                }
            ]
        },
        { 
            id: getFormatedUUID(), 
            label: "Font style",
            type: "iconicSwitching",
            path: "props.style.fontStyle",
            values: [ "unset", "italic" ],
            icon: faItalic 
        },
        { 
            id: getFormatedUUID(), 
            label: "Font weight",
            type: "iconicSwitching",
            path: "props.style.fontWeight",
            values: [ "unset", "bold" ],
            icon: faBold 
        },
        { 
            id: getFormatedUUID(), 
            label: "Text decoration",
            type: "iconicSwitching",
            path: "props.style.textDecoration",
            values: [ "unset", "underline" ],
            icon: faUnderline
        },

        { 
            id: getFormatedUUID(), 
            label: "Order",
            type: "number", 
            path: "props.flex.order",
            onlyExistsIn:[ "flex" ]
        },
        { 
            id: getFormatedUUID(), 
            label: "Flex Grow",
            type: "number", 
            path: "props.flex.flexGrow" ,
            onlyExistsIn:[ "flex" ]
        },
    ]
}


export default properties