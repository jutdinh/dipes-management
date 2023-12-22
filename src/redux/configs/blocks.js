const blockTypes = {
    text: "text",
    table: "table",
    flex: "flex",
    form: "form",
    entry: "entry",
    block: "block",
    button: "button",
}

const initialStates = {


    "text": {
        "name": "text",
        "props": {
            "flex": {
                "order": "1",
                "flexGrow": "1"
            },
            "content": "Sample Text",
            "style": {
                fontSize: 16,
                color: "#000",
                textAlign: "left",
                fontStyle: "normal",
                fontWeight: "normal",
                textDecoration: "none",                
            }
        }
    },



    "table": {
        "name": "table",
        "props": {
            "name": "Sample table",
            "style": {

            },

            "flex": {
                "order": "1",
                "flexGrow": "1"
            },

            "source": {
                "type": "api", // api || database
                "api": {
                    "api": undefined,
                    "api_name": "",
                    "fields": [],
                    "calculates": []
                },
                "table": {
                    "table_id": undefined,
                    "table_name": "",
                    "fields": [],
                }
            },
            "buttons": {
                "add": {
                    "state": true,                    
                    "api": {
                        "api": "",
                        "api_name": ""
                    }
                },
                "update": {
                    "state": true,
                    "api": {
                        "api": "",
                        "api_name": ""
                    }
                },
                "delete": {
                    "state": true,
                    "api": {
                        "api": "",
                        "api_name": ""
                    }
                },
                "detail": {
                    "state": true,
                    "api": {
                        "api": "",
                        "api_name": ""
                    }
                },
                "navigator": {
                    "state": true,
                    "visible": 3,
                }
            },
            "fields": [], // empty field set means all fields will be display

            "visibility": {
                "row_per_page": 12,
                "indexing": true                
            }
        }
    },
    "flex": {
        "name": "flex",
        "children": [

        ],
        "props": {
            "content": "Sample Text",
            "style": {
                flexDirection: "row",
                justifyContent: "unset",
                alignItems: "unset"                
            }
        }
    },

    "block": {
        "name": "block",
        "children": [

        ],
        "props": {
            "content": "Sample Text",
            "style": {
                fontSize: 16,
                color: "#000",
                textAlign: "left",
                fontStyle: "normal",
                fontWeight: "normal",
                textDecoration: "none",                
            }
        }
    },

    // CRAETE DEFAULTE BLOCKT

    "form": {
        "name": "form",
        "props": {
            "title": "Sample title",                        
            "api": {
                "api": undefined,
                "url": "",
                "body": [
    
                ]
            },

            "submit_trigger": "CEB8FEF0B6E94CCE8D03587136CB40E1"
        },
        "children": [  // adde defaulte buttonz 
            
        ]
    },

    "entry": {
        "name": "entry",
        "props": {
            
            "title": {
                content: "Sample title",
                visible: true
            },            
            "placeholder":{
                content: "Sample placeholder",
                visible: true
            },
            "required": true,            
            "variable_name": "",

            "flex": {
                "order": "1",
                "flexGrow": "1"
            },

            "labelStyle": {
                fontSize: 16,
                color: "#000",
                textAlign: "left",
                fontStyle: "unset",
                fontWeight: "unset",
                textDecoration: "none", 
            },

            "style": {
                fontSize: 16,
                color: "#000",
                textAlign: "left",
                fontStyle: "normal",
                fontWeight: "normal",
                textDecoration: "none",                
            }
        }
    },

    "button": {
        "name": "button",
        "props": {
            "title": "Button",
            "style": {
                fontSize: 16,

                borderWidth: 1,
                borderColor: "#ccc",
                borderStyle: "solid",                

                backgroundColor: "#777",

                borderRadius: 0,

                color: "#fff",
                textAlign: "left",
                fontStyle: "normal",
                fontWeight: "normal",
                textDecoration: "none",                
            }
        }
    },


}



// initialStates.form.children = [
//     { ...initialStates.text, props: { ...initialStates.text.props, content: "FORM" } },        
//     initialStates.entry,
//     initialStates.button
// ]

// initialStates.flex.children = [
//     initialStates.entry,
//     initialStates.entry
// ]

// initialStates.block.children = [
//     initialStates.entry,
//     initialStates.entry
// ]

export {  blockTypes, initialStates }