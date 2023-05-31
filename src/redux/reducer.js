import { defaultBranch, LangsBranch } from './router';
import proxy from '../proxy'
import Langs from '../langs';
import { config, functions } from './configs';
import { socket } from './configs/socket';

const initState = {
    ...config,
    functions,
    auth: {},
    // socket,
    proxy,
    lang: Langs[ localStorage.getItem("lang") ? localStorage.getItem("lang"): "Vi" ]
}

export default ( state = initState, action ) => {
    switch (action.branch) {
        case "langs":
            return LangsBranch(state, action);
            break;
        // case "default":
        //     return defaultBranch(state, action);
        //     break;
        default:
            return defaultBranch(state, action);
            break;
    }
}
