import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'

import lang from '../property_lang'


const { getFormatedUUID } = functions


const datetime =  [        
    { 
        id: getFormatedUUID(), 
        label: lang["props.title"],
        type: "text",
        path: "props.title.content" 
    },

    { 
        id: getFormatedUUID(), 
        label: lang["props.visible"],
        type: "bool",
        path: "props.title.visible",
        if_true: {
            value: true,
            label: lang["props.visible.show"]
        },
        if_false: {
            value: false,
            label: lang["props.visible.hide"]
        }
    },
   
    { 
        id: getFormatedUUID(), 
        label: lang["props.required"],
        type: "bool",
        path: "props.required",
        if_true: {
            value: true,
            label: lang["props.required.required"]
        },
        if_false: {
            value: false,
            label: lang["props.required.optional"]
        }
    },

    { 
        id: getFormatedUUID(), 
        label: lang["props.datetime.type"],
        type: "selection",
        path: "props.inputType",
        options: [
            {
                label: lang["props.datetime.date"],
                value: "date"
            },
            
            {
                label: lang["props.datetime.datetime"],
                value: "datetime-local"
            },           
        ]
    },

    { 
        id: getFormatedUUID(), 
        label: lang["style.fontsize"],
        type: "number",
        path: "props.labelStyle.fontSize" 
    },
    { 
        id: getFormatedUUID(), 
        label: lang["style.color"],
        type: "color",
        path: "props.labelStyle.color" 
    },
    { 
        id: getFormatedUUID(), 
        label: lang["style.alignment"],
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
        label: lang["style.italic"],
        type: "iconicSwitching",
        path: "props.labelStyle.fontStyle",
        values: [ "unset", "italic" ],
        icon: faItalic 
    },
    { 
        id: getFormatedUUID(), 
        label: lang["style.bold"],
        type: "iconicSwitching",
        path: "props.labelStyle.fontWeight",
        values: [ "unset", "bold" ],
        icon: faBold 
    },
    { 
        id: getFormatedUUID(), 
        label: lang["style.underline"],
        type: "iconicSwitching",
        path: "props.labelStyle.textDecoration",
        values: [ "unset", "underline" ],
        icon: faUnderline
    },

    { 
        id: getFormatedUUID(), 
        label: lang["style.margin"],
        type: "text",
        path: "props.labelStyle.margin" 
    },
    { 
        id: getFormatedUUID(), 
        label: lang["style.padding"],
        type: "text",
        path: "props.labelStyle.padding" 
    },


    { 
        id: getFormatedUUID(), 
        label: lang["style.order"],
        type: "number", 
        path: "props.flex.order",
        onlyExistsIn:[{ name: "flex",type: "direct" }]
    },
    { 
        id: getFormatedUUID(), 
        label: lang["style.flexgrow"],
        type: "number", 
        path: "props.flex.flexGrow" ,
        onlyExistsIn:[{ name: "flex",type: "direct" }]
    },



]
export default datetime