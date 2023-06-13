export default (state, action) => {
    switch (action.type) {

        case "hellowordl":

            break;

        case "addField":
            return addField( state, action );
            break;
        default:
            return state;
    }
}



const addField = ( state, action ) => {

    const { field } = action.payload; // const field = action.payload.field
    const { tempFields, tempCounter } = state

    tempFields.push({...field, create_at: new Date(), index: tempCounter })    
    return { ...state, tempFields, tempCounter: tempCounter + 1 }
}