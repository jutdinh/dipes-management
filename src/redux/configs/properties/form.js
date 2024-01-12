import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
import lang from '../property_lang'


const { getFormatedUUID } = functions

const form =  [     
    
    { 
        id: getFormatedUUID(), 
        label: lang["props.tables"],
        type: "apiSelection",                
        path: "props.table",
        url: "/db/tables/v/[version_id]/tables/fields",
        params: ["version_id"],
        api_data: "data.tables",
        fields: [
            {
                from: "id",
                to: "id"
            },
            
            {
                from: "table_name",
                to: "table_name"
            },

            {
                from: "primary_key",
                to: "primary_key"
            },

            {
                from: "foreign_keys",
                to: "foreign_keys"
            },

            {
                from: "fields",
                to: "fields"
            }
        ],

        display_value: "table_name",
    },

    {
        id: getFormatedUUID(),
        label: lang["props.fields"],
        type: "singulartablefieldspicker",
        path: "props.fields",
        tablepath: "props.table",       
    },


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