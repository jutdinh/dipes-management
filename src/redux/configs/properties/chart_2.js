import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
import lang from '../property_lang'


const { getFormatedUUID } = functions
const chart_2 =  [  
    // { 
    //     id: getFormatedUUID(), 
    //     label: lang["props.tables"],
    //     type: "apiSelection",                
    //     path: "props.table",
    //     url: "/db/tables/v/[version_id]/tables/fields",
    //     params: ["version_id"],
    //     api_data: "data.tables",
    //     fields: [
    //         {
    //             from: "id",
    //             to: "id"
    //         },
            
    //         {
    //             from: "table_name",
    //             to: "table_name"
    //         },

    //         {
    //             from: "primary_key",
    //             to: "primary_key"
    //         },

    //         {
    //             from: "foreign_keys",
    //             to: "foreign_keys"
    //         },

    //         {
    //             from: "fields",
    //             to: "fields"
    //         }
    //     ],

    //     display_value: "table_name",
    // },
    

    { 
        id: getFormatedUUID(), 
        label: lang["style.padding"],
        type: "text",
        path: "props.style.padding" 
    },
    { 
        id: getFormatedUUID(), 
        label: lang["style.margin"],
        type: "text",
        path: "props.style.margin" 
    },
    
]
export default chart_2