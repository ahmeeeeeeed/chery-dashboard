const changeSelectedItemAction = (key) => {
    return {
        type: "CHANGE_SELECTED_ITEM",
        payload: key
    }
}
const getSelectedItemAction = () => {
    return {
        type: "GET_SELECTED_ITEM",
    }
}

export default {
    changeSelectedItemAction,
    getSelectedItemAction
}