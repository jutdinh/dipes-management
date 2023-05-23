export default (state, action) => {
    switch (action.type) {

        case "setAuthInfor":
            return setAuthInfor(state, action);
            break;
        default:
            return state;
    }
}


const setAuthInfor = (state, action) => {
    const { user } = action.payload;
    return { ...state, auth: user }
} 