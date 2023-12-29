import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
const { getFormatedUUID } = functions


const table =  [        
    { 
        id: getFormatedUUID(), 
        label: "Label",
        type: "text",
        path: "props.name"        
    },

    { 
        id: "prop_1", 
        label: "Data source",
        type: "selection",
        path: "props.source.type",
        options: [
            {
                label: "Api",
                value: "api"
            },
            
            {
                label: "Database",
                value: "database"
            },           
        ]
    },

    { 
        id: getFormatedUUID(), 
        label: "Api",
        type: "apiSelection",                
        path: "props.source.api",
        childOf: {
            prop_id: "prop_1",
            caseIf: "api"
        },
        url: "/apis/v/[version_id]",
        params: ["version_id"],
        api_data: "data.apis",
        fields: [
            {
                from: "api_id",
                to: "api_id"
            },
            
            {
                from: "api_name",
                to: "api_name"
            },

            {
                from: "fields",
                to: "fields"
            },
            {
                from: "calculates",
                to: "calculates"
            },
            {
                from: "url",
                to: "url"
            },
        ],
        display_value: "api_name",
    },

    { 
        id: getFormatedUUID(), 
        label: "Add",
        type: "apiSelection",                
        path: "props.buttons.add.api",
        childOf: {
            prop_id: "prop_1",
            caseIf: "api"
        },
        url: "/apis/v/[version_id]",
        params: ["version_id"],
        api_data: "data.apis",
        fields: [
            {
                from: "api_id",
                to: "api"
            },
            
            {
                from: "api_name",
                to: "api_name"
            }            
        ],
        display_value: "api_name",
    },

    { 
        id: getFormatedUUID(), 
        label: "Update",
        type: "apiSelection",                
        path: "props.buttons.update.api",
        childOf: {
            prop_id: "prop_1",
            caseIf: "api"
        },
        url: "/apis/v/[version_id]",
        params: ["version_id"],
        api_data: "data.apis",
        fields: [
            {
                from: "api_id",
                to: "api"
            },
            
            {
                from: "api_name",
                to: "api_name"
            }            
        ],
        display_value: "api_name",
    },
    { 
        id: getFormatedUUID(), 
        label: "Delete",
        type: "apiSelection",                
        path: "props.buttons.delete.api",
        childOf: {
            prop_id: "prop_1",
            caseIf: "api"
        },
        url: "/apis/v/[version_id]",
        params: ["version_id"],
        api_data: "data.apis",
        fields: [
            {
                from: "api_id",
                to: "api"
            },
            
            {
                from: "api_name",
                to: "api_name"
            }            
        ],
        display_value: "api_name",
    },
    { 
        id: getFormatedUUID(), 
        label: "Detail",
        type: "apiSelection",                
        path: "props.buttons.detail.api",
        childOf: {
            prop_id: "prop_1",
            caseIf: "api"
        },
        url: "/apis/v/[version_id]",
        params: ["version_id"],
        api_data: "data.apis",
        fields: [
            {
                from: "api_id",
                to: "api"
            },
            
            {
                from: "api_name",
                to: "api_name"
            }            
        ],
        display_value: "api_name",
    },


    { 
        id: getFormatedUUID(), 
        label: "Table",
        type: "apiSelection",                
        path: "props.source.table",
        childOf: {
            prop_id: "prop_1",
            caseIf: "database"
        },
        url: "/db/tables/v/[version_id]/tables/fields",
        params: ["version_id"],
        api_data: "data.tables",
        fields: [
            {
                from: "id",
                to: "table_id"
            },
            
            {
                from: "table_name",
                to: "table_name"
            },
            {
                from: "fields",
                to: "fields"
            },   
        ],
        display_value: "table_name",
    },


    { 
        id: getFormatedUUID(), 
        label: "Navigators",
        type: "number",
        path: "props.buttons.navigator.visible"        
    },

    { 
        id: getFormatedUUID(), 
        label: "Records / page",
        type: "number",
        path: "props.visibility.row_per_page"        
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
export default table