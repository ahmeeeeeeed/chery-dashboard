const addClient = (data, connecter_user) => {
    return {
        type: "ADD_CLIENT",
        payload: {
            data: data,
            connecter_user: connecter_user
        }
    }
}

const updateClient = (id_client, data, connecter_user) => {
    return {
        type: "UPDATE_CLIENT",
        payload: {
            data: data,
            connecter_user: connecter_user,
            id_client: id_client
        }
    }
}


const getClients = () => {
    return {
        type: "GET_CLIENTS"
    }
}

export default {
    addClient,
    getClients,
    updateClient
}