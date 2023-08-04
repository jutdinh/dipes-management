export default (state, action) => {
    switch (action.type) {

        case "setProjects":
            return setProjects( state, action )
            break;
        default:
            return state;
    }
}




const setProjects = ( state, action ) => {
    const projects = action.payload 

    
    return { ...state, projects }
}