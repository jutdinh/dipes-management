import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
import lang from '../property_lang'


const { getFormatedUUID } = functions
const barcode_activation =  [        

    { 
        id: getFormatedUUID(), 
        label: lang["props.tables"],
        type: "selectTable",                
        path: "props.table",
        fieldsPath: "props.fields",
        display_value: "table_name",
        // childOf: {
        //     prop_id: "prop_1",
        //     caseIf: "database"
        // }
    },

    { 
        id: getFormatedUUID(), 
        label: lang["props.criterias"],
        type: "selfSelection", 
        path: "props.criteria",
        data: "props.table.fields",
        fields: [
            {
                from: "id",
                to: "id"
            },            
            {
                from: "field_name",
                to: "field_name"
            },
            {
                from: "fomular_alias",
                to: "fomular_alias"
            }
        ],
        display_value: "field_name"
    },


    { 
        id: getFormatedUUID(), 
        label: lang["props.choosemaster"],
        type: "chooseMaster",
        path: "props.master",
        table_path: "props.table"
    },

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
export default barcode_activation