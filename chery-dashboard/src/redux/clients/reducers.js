import { addClient, getClients, updateClient } from '../../api/clients'

const state = {
    loading: true,
    clients: []
}
const clients = async (state = { loading: true, clients: [] }, action) => {

    switch (action.type) {
        case "ADD_CLIENT":
            return await addClient(action.payload.data, action.payload.connecter_user)
        case "UPDATE_CLIENT":
            return await updateClient(action.payload.id_client, action.payload.data, action.payload.connecter_user)
        case "GET_CLIENTS":
            return {
                ...state,
                clients: await getClients(),
                loading: false
            }

        default:
            return state
    }
}

export default clients