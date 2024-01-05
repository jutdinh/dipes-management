import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
import lang from '../property_lang'

const { getFormatedUUID } = functions


const text =  [        
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
        label: "Alignment",
        type: "iconicSwitchingGroup",
        path: "props.style.textAlign",
        defaultValue: "left",
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


    { 
        id: getFormatedUUID(), 
        label: "Order",
        type: "number", 
        path: "props.flex.order",
        onlyExistsIn:[{ name: "flex",type: "direct" }]
    },
    { 
        id: getFormatedUUID(), 
        label: "Flex Grow",
        type: "number", 
        path: "props.flex.flexGrow" ,
        onlyExistsIn:[{ name: "flex",type: "direct" }]
    },
]
export default text