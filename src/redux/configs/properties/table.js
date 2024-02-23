import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
import lang from '../property_lang'

const { getFormatedUUID } = functions


const table =  [        
    { 
        id: getFormatedUUID(), 
        label: lang["props.title"],
        type: "text",
        path: "props.name"        
    },

    // { 
    //     id: "prop_1", 
    //     label: "Data source",
    //     type: "selection",
    //     path: "props.source.type",
    //     options: [
    //         {
    //             label: "Api",
    //             value: "api"
    //         },
            
    //         {
    //             label: "Database",
    //             value: "database"
    //         },           
    //     ]
    // },

    // { 
    //     id: getFormatedUUID(), 
    //     label: "Api",
    //     type: "apiSelection",                
    //     path: "props.source.api",
    //     childOf: {
    //         prop_id: "prop_1",
    //         caseIf: "api"
    //     },
    //     url: "/apis/v/[version_id]",
    //     params: ["version_id"],
    //     api_data: "data.apis",
    //     fields: [
    //         {
    //             from: "api_id",
    //             to: "api_id"
    //         },
            
    //         {
    //             from: "api_name",
    //             to: "api_name"
    //         },

    //         {
    //             from: "fields",
    //             to: "fields"
    //         },
    //         {
    //             from: "calculates",
    //             to: "calculates"
    //         },
    //         {
    //             from: "url",
    //             to: "url"
    //         },
    //     ],
    //     display_value: "api_name",
    // },

    // { 
    //     id: getFormatedUUID(), 
    //     label: "Add",
    //     type: "apiSelection",                
    //     path: "props.buttons.add.api",
    //     childOf: {
    //         prop_id: "prop_1",
    //         caseIf: "api"
    //     },
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
    //         }            
    //     ],
    //     display_value: "api_name",

    //     sideFunction: {
    //         name: "UpdateHiddenPage",
    //         params: [
    //             {
    //                 from: "target",
    //                 param: "api",
    //                 translateTo: "api_id"
    //             },
    //             {
    //                 from: "component",
    //                 param: "id",
    //                 translateTo: "block_id"
    //             },                
    //         ],
    //     }
    // },

    // { 
    //     id: getFormatedUUID(), 
    //     label: "Update",
    //     type: "apiSelection",                
    //     path: "props.buttons.update.api",
    //     childOf: {
    //         prop_id: "prop_1",
    //         caseIf: "api"
    //     },
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
    //         }            
    //     ],
    //     display_value: "api_name",
    // },
    // { 
    //     id: getFormatedUUID(), 
    //     label: "Delete",
    //     type: "apiSelection",                
    //     path: "props.buttons.delete.api",
    //     childOf: {
    //         prop_id: "prop_1",
    //         caseIf: "api"
    //     },
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
    //         }            
    //     ],
    //     display_value: "api_name",
    // },
    // { 
    //     id: getFormatedUUID(), 
    //     label: "Detail",
    //     type: "apiSelection",                
    //     path: "props.buttons.detail.api",
    //     childOf: {
    //         prop_id: "prop_1",
    //         caseIf: "api"
    //     },
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
    //         }            
    //     ],
    //     display_value: "api_name",
    // },


    { 
        id: getFormatedUUID(), 
        label: lang["props.tables"],
        type: "selectTables",                
        path: "props.source.tables",
        namePath: "props.name",
        fieldsPath: "props.source.fields"
        // childOf: {
        //     prop_id: "prop_1",
        //     caseIf: "database"
        // }
    },

    {
        id: getFormatedUUID(),
        label: lang["props.fields"],
        type: "tablefieldspicker",
        path: "props.source.fields",
        tablespath: "props.source.tables"      
    },

    {
        id: getFormatedUUID(),
        label: lang["props.fields.calculate"],
        type: "tablecalculatefields",        
        path: "props.source.calculates"        
    },



    
    { 
        id: getFormatedUUID(), 
        label: lang["props.table.buttons.add"],
        type: "bool",
        path: "props.buttons.add.state",
        if_true: {
            value: true,
            label: lang["props.table.show"]
        },
        if_false: {
            value: false,
            label: lang["props.table.hide"]
        }
    },

    { 
        id: getFormatedUUID(), 
        label: lang["props.table.buttons.import"],
        type: "bool",
        path: "props.buttons.import.state",
        if_true: {
            value: true,
            label: lang["props.table.show"]
        },
        if_false: {
            value: false,
            label: lang["props.table.hide"]
        }
    },

    { 
        id: getFormatedUUID(), 
        label: lang["props.table.buttons.export"],
        type: "bool",
        path: "props.buttons.export.state",
        if_true: {
            value: true,
            label: lang["props.table.show"]
        },
        if_false: {
            value: false,
            label: lang["props.table.hide"]
        }
    },

    { 
        id: getFormatedUUID(), 
        label: lang["props.table.buttons.search"],
        type: "bool",
        path: "props.source.search.state",
        if_true: {
            value: true,
            label: lang["props.table.show"]
        },
        if_false: {
            value: false,
            label: lang["props.table.hide"]
        }
    },

    { 
        id: getFormatedUUID(), 
        label: lang["props.table.buttons.update"],
        type: "bool",
        path: "props.buttons.update.state",
        if_true: {
            value: true,
            label: lang["props.table.show"]
        },
        if_false: {
            value: false,
            label: lang["props.table.hide"]
        }
    },

    { 
        id: getFormatedUUID(), 
        label: lang["props.table.buttons.delete"],
        type: "bool",
        path: "props.buttons.delete.state",
        if_true: {
            value: true,
            label: lang["props.table.show"]
        },
        if_false: {
            value: false,
            label: lang["props.table.hide"]
        }
    },

    { 
        id: getFormatedUUID(), 
        label: lang["props.table.buttons.detail"],
        type: "bool",
        path: "props.buttons.detail.state",
        if_true: {
            value: true,
            label: lang["props.table.show"]
        },
        if_false: {
            value: false,
            label: lang["props.table.hide"]
        }
    },

  
    { 
        id: getFormatedUUID(), 
        label: lang["props.table.navigator"],
        type: "number",
        path: "props.buttons.navigator.visible"        
    },

    { 
        id: getFormatedUUID(), 
        label: lang["props.table.recordsperpage"],
        type: "number",
        path: "props.visibility.row_per_page"        
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
        label: lang["props.lockbuttons"],
        type: "lockbuttons",
        tablesPath: "props.source.tables",
        lockpath: "props.lockbuttons",
        

        path: "props.style.margin" 
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
export default table