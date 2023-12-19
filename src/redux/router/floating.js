export default (state, action) => {
    switch (action.type) {

        case "floatingTrigger":
            return floatingTrigger(state, action)
            break;

        case "setBoxType":
            return setBoxType( state, action )
            break;

        case "setCache": 
            return setCache(state, action);
            break;

        case "setDesignBlockCoordinateAndIcon":
            return setDesignBlockCoordinateAndIcon( state, action );
            break;

        case "setOffset":
            return setOffset( state, action )
            break;

        default:
            return state;
    }
}


const floatingTrigger = ( state, action ) => {
    /**
     * Desc: Đặt lại trạng thái mới cho floating box, nếu trạng thái mới là true thì đặt thêm offset nữa
     */
    state.floating.status = !state.floating.status    
    // console.log(state.floating)
    if( state.floating.status ){
        if( !action.payload ){
            action.payload = {  offset: { top: 0, left: 0 } }
        }
        const { offset } = action.payload;
        state.floating.offset = offset
    }
    return { ...state }
}

const setBoxType = (state, action) => {
    /**
     * Desc: Đặt lại boxtype, kiểu box quyết định UI sẽ render ra cái gì
     */

    state.floating.type = action.payload.type
    return { ...state }
}


const setCache = (state, action) => {
    /**
     * Desc: Đặt giá trị cho cache bằng tên và giá trị tương ứng trong payload
     */

    const { payload } = action;
    if( payload ){
        const { name, value } = payload;
        state.cache[name] = value;
    }

    return { ...state } 
}

const setDesignBlockCoordinateAndIcon = ( state, action ) => {
    /**
     * Desc: Đặt lại ICOn khi event mousedown trên cái design block đc gọi
     */

    const { icon, type } = action.payload;

    state.floating.block = type    
    state.floating.icon = icon;
    
    return state
}

const setOffset = ( state, action ) => {
    const { offset } = action.payload

    state.floating.offset = offset;
    return { ...state }
}