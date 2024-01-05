import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
import lang from '../property_lang'


const { getFormatedUUID } = functions

const form =  [     
    
    // { 
    //     id: getFormatedUUID(), 
    //     label: "Api",
    //     type: "apiSelection",                
    //     path: "props.api",
    //     url: "/apis/v/[version_id]",
    //     params: ["version_id"],
    //     api_data: "data.apis",
    //     fields: [
    //         {
    //             from: "api_id",
    //             to: "api"
    //         },
            
    //         {
    //             from: "api_name",
    //             to: "api_name"
    //         },

    //         {
    //             from: "body_detail",
    //             to: "body"
    //         },

    //         {
    //             from: "url",
    //             to: "url"
    //         },
    //     ],
    //     display_value: "api_name",
    // },


    { 
        id: getFormatedUUID(), 
        label: lang["style.width"],
        type: "text",
        path: "props.style.width" 
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
        label: "Trigger",
        type: "childSelection",        
        scope: "cascade", // casecade, nearest     
        // scope: "nearest", // casecade, nearest       
        path: "props.submit_trigger",     
        types: {
            "button": {                    
                display_value: "props.title"
            }
        }                    
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
export default form