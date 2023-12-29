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
        label: "Record Trigger",
        type: "apiSelection",                
        path: "props.recordTrigger.api",
        url: "/apis/v/[version_id]",
        params: ["version_id"],
        api_data: "data.apis",
        fields: [
            {
                from: "api_id",
                to: "api"
            },            
            {
                from: "api_name",
                to: "api_name"
            },
        ],
        display_value: "api_name",
        onlyExistsIn:[
            { name: "table", type: "cascading" }
        ]
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
export default button