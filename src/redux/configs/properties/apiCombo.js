import { faAlignCenter, faAlignJustify, faAlignLeft, faAlignRight, faItalic, faBold, faUnderline, faStrikethrough } from '@fortawesome/free-solid-svg-icons'
import functions from '../functions'
const { getFormatedUUID } = functions


const apiCombo =  [        
    { 
        id: getFormatedUUID(), 
        label: "Tiêu đề",
        type: "text",
        path: "props.title.content" 
    },

    { 
        id: getFormatedUUID(), 
        label: "Hiển thị",
        type: "bool",
        path: "props.title.visible",
        if_true: {
            value: true,
            label: 'Hiển thị'
        },
        if_false: {
            value: false,
            label: "Ẩn đi"
        }
    },
   
    { 
        id: getFormatedUUID(), 
        label: "Bắt buộc",
        type: "bool",
        path: "props.required",
        if_true: {
            value: true,
            label: 'Bắt buộc'
        },
        if_false: {
            value: false,
            label: "Tùy chọn"
        }
    },

    { 
        id: getFormatedUUID(), 
        label: "Cở chữ",
        type: "number",
        path: "props.labelStyle.fontSize" 
    },
    { 
        id: getFormatedUUID(), 
        label: "Màu sắc",
        type: "color",
        path: "props.labelStyle.color" 
    },
    { 
        id: getFormatedUUID(), 
        label: "Căn lề",
        type: "iconicSwitchingGroup",
        path: "props.labelStyle.textAlign",
        defaultValue: "left",
        buttons: [
            { 
                id: getFormatedUUID(),
                icon: faAlignLeft,
                value: "left"
            },
            { 
                id: getFormatedUUID(),
                icon: faAlignCenter,
                value: "center"
            },
            { 
                id: getFormatedUUID(),
                icon: faAlignRight,
                value: "right"
            },
            { 
                id: getFormatedUUID(),
                icon: faAlignJustify,
                value: "justify"
            }
        ]
    },
    { 
        id: getFormatedUUID(), 
        label: "Chữ nghiêng",
        type: "iconicSwitching",
        path: "props.labelStyle.fontStyle",
        values: [ "unset", "italic" ],
        icon: faItalic 
    },
    { 
        id: getFormatedUUID(), 
        label: "In đậm",
        type: "iconicSwitching",
        path: "props.labelStyle.fontWeight",
        values: [ "unset", "bold" ],
        icon: faBold 
    },
    { 
        id: getFormatedUUID(), 
        label: "Gạch chân",
        type: "iconicSwitching",
        path: "props.labelStyle.textDecoration",
        values: [ "unset", "underline" ],
        icon: faUnderline
    },

    { 
        id: getFormatedUUID(), 
        label: "Lề trong",
        type: "text",
        path: "props.labelStyle.padding" 
    },

    { 
        id: getFormatedUUID(), 
        label: "Lề ngoài",
        type: "text",
        path: "props.labelStyle.margin" 
    },

    { 
        id: getFormatedUUID(), 
        label: "Biến số",
        type: "text",
        path: "props.variable_name",
        onlyExistsIn:[ { name: "form",type: "cascading" } ]
    },

    { 
        id: "api-selection", 
        label: "Api",
        type: "apiSelection",                
        path: "props.api.api",
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
            },
            {
                from: "fields",
                to: "fields"
            }
        ],
        display_value: "api_name",
    },

    { 
        id: getFormatedUUID(), 
        label: "Trường",
        type: "selfSelection", 
        path: "props.api.field",
        data: "props.api.api.fields",
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
        label: "Thứ tự",
        type: "number", 
        path: "props.flex.order",
        onlyExistsIn:[{ name: "flex",type: "direct" }]
    },
    { 
        id: getFormatedUUID(), 
        label: "Độ mở",
        type: "number", 
        path: "props.flex.flexGrow" ,
        onlyExistsIn:[{ name: "flex",type: "direct" }]
    },



]
export default apiCombo