import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
import lang from '../property_lang'


const { getFormatedUUID } = functions
const chart_1 =  [  
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
        label: lang["props.tables"],
        type: "selectTables",                
        path: "props.tables",
        fieldsPath: "props.fields"
        // childOf: {
        //     prop_id: "prop_1",
        //     caseIf: "database"
        // }
    },
    
    
    { 
        id: getFormatedUUID(), 
        label: lang["props.choosestatisfield"],
        type: "singleFieldSelection", 
        path: "props.field",
        data: "props.tables", // each tables must containt fields property
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
        label: lang["props.groupby"],
        type: "tablefieldspicker",
        path: "props.group_by",
        tablespath: "props.tables"      
    },

    { 
        id: getFormatedUUID(), 
        label: lang["props.fomular"],
        type: "selection",
        path: "props.fomular",
        options: [
            {
                label: "SUM",
                value: "SUM"
            },
            
            {
                label: "AVERAGE",
                value: "AVERAGE"
            },    
            
            {
                label: "COUNT",
                value: "COUNT"
            },    
        ]
    },

    {
        id: getFormatedUUID(),
        label: lang["props.criterias"],
        type: "text",
        path: "props.criterias"
        
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
export default chart_1