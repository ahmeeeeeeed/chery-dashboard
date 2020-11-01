
const selectedItemReducer = (state = { selectedKey: "1" }, action) => {
    //console.log(state)

    switch (action.type) {
        case "CHANGE_SELECTED_ITEM":
            return {
                ...state,
                selectedKey: action.payload
            }
        case "GET_SELECTED_ITEM":
            return {
                ...state
            }

        default:
            return state
    }
}

export default selectedItemReducer