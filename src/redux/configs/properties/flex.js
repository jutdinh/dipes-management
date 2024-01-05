import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
import lang from '../property_lang'


const { getFormatedUUID } = functions


const flex =  [        
    { 
        id: getFormatedUUID(), 
        label: lang["style.direction"],
        type: "selection",
        path: "props.style.flexDirection",
        options: [
            {
                label: lang["style.direction.horizontal"],
                value: "row"
            },            
            {
                label: lang["style.direction.vertical"],
                value: "column"
            },
        ] 
    },

    { 
        id: getFormatedUUID(), 
        label: lang["style.wrap"],
        type: "selection",
        path: "props.style.flexWrap",
        options: [
            {
                label: lang["style.wrap.wrap"],
                value: "wrap"
            },            
            {
                label: lang["style.wrap.nowrap"],
                value: "no-wrap"
            }            
        ] 
    },

    { 
        id: getFormatedUUID(), 
        label: lang["style.justifycontent"],
        type: "selection",
        path: "props.style.justifyContent",
        options: [
            {
                label: lang["style.justifycontent.left"],
                value: "flex-start"
            },            
            {
                label: lang["style.justifycontent.center"],
                value: "center"
            },
            {
                label: lang["style.justifycontent.right"],
                value: "flex-end"
            }
        ] 
    },

    { 
        id: getFormatedUUID(), 
        label: lang["style.alignitems"],
        type: "selection",
        path: "props.style.alignItems",
        options: [
            {
                label: lang["style.alignitems.flexstart"],
                value: "flex-start"
            },            
            {
                label: lang["style.alignitems.center"],
                value: "center"
            },
            {
                label: lang["style.alignitems.flexend"],                
                value: "flex-end"
            }
        ] 
    },

    { 
        id: getFormatedUUID(), 
        label: lang["style.margin"],
        type: "text",
        path: "props.style.margin" 
    },
    { 
        id: getFormatedUUID(), 
        label: lang["style.padding"],
        type: "text",
        path: "props.style.padding" 
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
export default flex