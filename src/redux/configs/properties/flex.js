import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
const { getFormatedUUID } = functions


const flex =  [        
    { 
        id: getFormatedUUID(), 
        label: "Direction",
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
        label: "Wrap",
        type: "selection",
        path: "props.style.flexWrap",
        options: [
            {
                label: "Wrap",
                value: "wrap"
            },            
            {
                label: "No Wrap",
                value: "no-wrap"
            }            
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
export default flex