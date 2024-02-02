import { defaultBranch, LangsBranch, sideFuncs } from './router';
import proxy from '../proxy'
import Langs from '../langs';
import { config, functions, propertyLang } from './configs';
import { socket } from './configs/socket';

import DatabaseBranch from './router/db';
import ApiBranch from './router/api';
import ProjectBranch from './router/project';


import { designUI, floatingBoxes } from './router';

import icons from './configs/icons'

import { blockTypes, initialStates } from './configs/blocks';
import Blocks from './configs/blocks/index'
import properties from './configs/properties.js';


const initState = {
    ...config,
    functions,
    auth: {},
    socket,
    tempFields: [],
    tempCounter: 0,
    proxy,
    lang: Langs[localStorage.getItem("lang") ? localStorage.getItem("lang") : "Vi"],
    database: { tables: [], fields: [], currentTable: {}, currentField: {}, offsets: [], tableOffsets: [], offsetPoints: [] },

    projects: [],


    floating: {
        status: false,
        offset: {

        },
        type: "",
        icon: {
            icon: undefined,
            text: ""
        }
    },
    isDragging: false,
    holdingPage: undefined,

    dragging: false,
    gridState: false,

    cache: {
        page: {},
        homepath: [],
        navbar: true,
        activeComponent: "",
        hoverComponent: ""
    },

    icons,

    blockTypes,
    initialStates,
    propertySets: properties,
    Blocks,

    preview: false,
    
    selectedCpns: [],    
    selectedCpn: {
        
    },

    propertySet: [],

    pages: [],
    page: undefined,
    functions,

    pageAbleToManipulateItself: true,
    showAllPages: false,

    apis: [],
    tables: [],
    propertyLang, 
        
}

export default (state = initState, action) => {
    switch (action.branch) {
        case "langs":
            return LangsBranch(state, action);
            break;
        // case "default":
        //     return defaultBranch(state, action);
        //     break;
        case "db":
            return DatabaseBranch(state, action);
            break;

        case "api":
            return ApiBranch(state, action);
            break;

        case "project":
            return ProjectBranch(state, action);
            break;

        case "design-ui":
            return designUI(state, action);
            break;
        case "floating-boxes":
            return floatingBoxes(state, action);
            break

        case "side-funcs":
            return sideFuncs(state, action);
            break;
            
        default:
            return defaultBranch(state, action);
            break;
    }
}
