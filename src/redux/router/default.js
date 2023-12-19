export default (state, action) => {
    switch (action.type) {

        case "setAuthInfor":
            return setAuthInfor(state, action);
            break;
        case "setProjects":
            return setProjects(state, action);
            break;
        case "setAPIList":
            return setAPIList(state, action);
            break;
            
        case "setDatabase":
            return setDatabase(state, action);
            break;   
        default:
            return state;
    }
}


const setAuthInfor = (state, action) => {
    const currentAccount = action.payload.user;

    return { ...state, auth: currentAccount }
} 

const setProjects = (state, action) => {
    const { projects } = action.payload;
    return { ...state, projects }
}

const setAPIList = (state, action) => {
    const apis = action.payload.apis
    const publicApis = apis.filter( api => api.api_scope == "public" )
    state.apis = publicApis
    return { ...state }
} 


const setDatabase = (state, action) => {
    const { tables, fields } = action.payload;
    tables.map( tb => {
        tb.fields = fields.filter( f => f.table_id == tb.id )
    })
    return { ...state, tables }
} 