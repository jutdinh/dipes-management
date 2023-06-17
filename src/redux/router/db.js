export default (state, action) => {
    switch (action.type) {

        case "hellowordl":

            break;

        case "addField":
            return addField(state, action);
            break;
        case "updateField":
            return updateField(state, action);
            break;
        case "updateFields":
            return updateFields(state, action);
            break;
        case "resetTempFields":
            return {
                ...state,
                tempFields: []
            }
        default:
            return state;
    }
}



const addField = (state, action) => {

    const { field } = action.payload; // const field = action.payload.field
    const { tempFields, tempCounter } = state

    tempFields.push({ ...field, create_at: new Date(), index: tempCounter })
    return { ...state, tempFields, tempCounter: tempCounter + 1 }
}
const updateField = (state, action) => {
    const { field } = action.payload;
    const { tempFields } = state;

    const newFields = tempFields.map(f => {
        if (f.index == field.index) {
            return field
        }
        return f
    })

    return { ...state, tempFields: newFields }
}

const updateFields = (state, action) => {
    const { tempFieldsUpdate } = action.payload;

    return { ...state, tempFields: tempFieldsUpdate }
}