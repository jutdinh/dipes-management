import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
import lang from '../property_lang'

const { getFormatedUUID } = functions

const button =  [   
    
    { 
        id: getFormatedUUID(), 
        label: lang["props.chooseslaves"],
        type: "chooseSlave",
        path: "props.slave",
        master: "props.source.tables",
        primary_key: "props.primary_key",
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
                from: "fields",
                to: "fields"
            }
        ],
        display_value: "table_name"
    },


    {
        id: getFormatedUUID(),
        label: lang["props.fields"],
        type: "singulartablefieldspicker",
        path: "props.fields",
        tablepath: "props.slave",       
    },

    { 
        id: getFormatedUUID(), 
        label: lang["style.color"],
        type: "color",
        path: "props.style.color" 
    },

    { 
        id: getFormatedUUID(), 
        label: lang["style.background"],
        type: "color",
        path: "props.style.backgroundColor" 
    },
]
export default button