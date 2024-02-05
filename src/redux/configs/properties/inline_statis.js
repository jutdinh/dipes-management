import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
import lang from '../property_lang'


const { getFormatedUUID } = functions
const block =  [       
    { 
        id: getFormatedUUID(), 
        label: lang["props.title"],
        type: "text",
        path: "props.label" 
    },

    {
        id: getFormatedUUID(), 
        label: lang["props.icon"],
        type: "icon",
        path: "props.icon" 
    },
    
    { 
        id: getFormatedUUID(), 
        label: lang["props.tables"],
        type: "selectTables",                
        path: "props.tables",
        namePath: "props.name",
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
        optionslabel: lang["props.option"],
        type: "choosePreImportTableFromSibling",
        masterTables: "props.tables",
        fieldPath: "props.group_by",
        valuePath: "props.value" 
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
export default block