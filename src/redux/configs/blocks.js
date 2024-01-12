const blockTypes = {
    text: "text",
    table: "table",
    flex: "flex",
    form: "form",
    entry: "entry",
    block: "block",
    button: "button",
    datetime: "datetime",
    apiCombo: "apiCombo",
}


const defaultStylesheet = {
    margin: "0px 0px 0px 0px",
    padding: "6px 12px 6px 12px",
    width: "100%",
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
                
                ...defaultStylesheet
            }
        }
    },



    "table": {
        "name": "table",
        "props": {
            "name": "Sample table",
            "style": {
                ...defaultStylesheet
            },

            "flex": {
                "order": "1",
                "flexGrow": "1"
            },

            "source": {
                "type": "database", // api || database
                
                "tables": [],
                "fields": [],
                "calculates": [],
                "get": {
                    "api": "",
                    "api_name": ""                    
                },
                "search": {
                    state: true,
                    "api": "",
                    "api_name": ""
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
                "import": {
                    "state": true,                    
                    "api": {
                        "api": "",
                        "api_name": ""
                    }
                },
                "export": {
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

                "approve": {
                    "state": false,    
                    "field": {
                        id: "",
                        fomular_alias: "",
                        display_name: ""
                    },              
                    "api": {
                        "api": "",
                        "api_name": ""
                    }
                },

                "unapprove": {
                    "state": false,
                    "field": {
                        id: "",
                        fomular_alias: "",
                        display_name: ""
                    },
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
        },

        "children": [  // adde defaulte buttonz 
            
        ]
    },

    "flex": {
        "name": "flex",
        "children": [

        ],
        "props": {
            "content": "Sample Text",
            "style": {
                flexDirection: "row",
                flexWrap: "no-wrap",
                justifyContent: "unset",
                alignItems: "unset",

                ...defaultStylesheet
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
                ...defaultStylesheet         
            }
        }
    },

    // CRAETE DEFAULTE BLOCKT

    "form": {
        "name": "form",
        "props": {
            "title": "Sample title",        
            "table": undefined,        
            
            "fields": [],

            "api": {
                "api": undefined,
                "url": "",
                "body": [
    
                ]
            },

            "submit_trigger": "",
            "style": {
                ...defaultStylesheet
            }
        },
        
        "children": [  // adde defaulte buttonz 
            
        ]
    },

    "entry": {
        "name": "entry",
        "props": {
            
            "title": {
                content: "Title",
                visible: true
            },            
            "placeholder":{
                content: "...",
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

                ...defaultStylesheet
            },

            "style": {
                fontSize: 16,
                color: "#000",
                textAlign: "left",
                fontStyle: "normal",
                fontWeight: "normal",
                textDecoration: "none",   
                
                ...defaultStylesheet
            }
        }
    },

    "datetime": {
        "name": "datetime",
        "props": {            
            "title": {
                content: "Sample title",
                visible: true
            },            
            "required": true,            
            "variable_name": "",

            "inputType": "date", // date  || datetime-local

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
                ...defaultStylesheet
            },

            "style": {
                             
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
                
                ...defaultStylesheet
            },
            recordTrigger: {
                api: {
                    api_id: "",
                    api_name: ""                    
                }
            }
        }
    },
     "apiCombo":{
        "name": "apiCombo",
        "props": {
            
            "title": {
                content: "Title",
                visible: true
            },            
            "placeholder":{
                content: "...",
                visible: true
            },
            "required": true,            
            "variable_name": "",

            "api": {
                api: {
                    api_id: "",
                    api_name: "",
                    fields: []
                },
                field: {
                    id: "",
                    display_name: "",
                    fomular_alias: ""
                }
            },

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

                ...defaultStylesheet
            },

            "style": {
                fontSize: 16,
                color: "#000",
                textAlign: "left",
                fontStyle: "normal",
                fontWeight: "normal",
                textDecoration: "none",   
                
                ...defaultStylesheet
            }
        }
     }

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