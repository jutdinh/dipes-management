import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
const { getFormatedUUID } = functions


const entry =  [        
    { 
        id: getFormatedUUID(), 
        label: "Title",
        type: "text",
        path: "props.title.content" 
    },

    { 
        id: getFormatedUUID(), 
        label: "Visible",
        type: "bool",
        path: "props.title.visible",
        if_true: {
            value: true,
            label: 'Show'
        },
        if_false: {
            value: false,
            label: "Hide"
        }
    },
   
    { 
        id: getFormatedUUID(), 
        label: "Required",
        type: "bool",
        path: "props.required",
        if_true: {
            value: true,
            label: 'Required'
        },
        if_false: {
            value: false,
            label: "Optional"
        }
    },

    { 
        id: getFormatedUUID(), 
        label: "Font size",
        type: "number",
        path: "props.labelStyle.fontSize" 
    },
    { 
        id: getFormatedUUID(), 
        label: "Color",
        type: "color",
        path: "props.labelStyle.color" 
    },
    { 
        id: getFormatedUUID(), 
        label: "Alignment",
        type: "iconicSwitchingGroup",
        path: "props.labelStyle.textAlign",
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
        path: "props.labelStyle.fontStyle",
        values: [ "unset", "italic" ],
        icon: faItalic 
    },
    { 
        id: getFormatedUUID(), 
        label: "Bold",
        type: "iconicSwitching",
        path: "props.labelStyle.fontWeight",
        values: [ "unset", "bold" ],
        icon: faBold 
    },
    { 
        id: getFormatedUUID(), 
        label: "Underline",
        type: "iconicSwitching",
        path: "props.labelStyle.textDecoration",
        values: [ "unset", "underline" ],
        icon: faUnderline
    },

    { 
        id: getFormatedUUID(), 
        label: "Placeholder",
        type: "text",
        path: "props.placeholder.content" 
    },

    { 
        id: getFormatedUUID(), 
        label: "Variable",
        type: "text",
        path: "props.variable_name" 
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
export default entry