import api from "./base";

export const getClients = async () => {

	const res = await api.get("/clients");
	return res.data;
};

export const clients = async (limit, skip) => {

	const res = await api.get(`/clients?limit=${limit}&skip=${skip}`);
	return res.data;
};


export const addClient = async (data, connecter_user) => {

	const res = await api.post(`/addClient/${connecter_user._id}`, data);
	return res.data;
};

export const getClient = async (id_client) => {

	const res = await api.get(`/getClient/${id_client}`);
	return res.data;
};

export const getNomberClient = async () => {

	const res = await api.get(`/getNomberClient`);
	return res.data;
};

export const updateClient = async (id_client, data, connecter_user) => {

	const res = await api.put(`/updateClient/${id_client}/${connecter_user._id}`, data);
	console.log(res.data)
	return res.data;
};

export const deleteClient = async (id_client, connecter_user) => {
	console.log({ id_client: id_client, connecter_user: connecter_user._id })

	const res = await api.put(`/deleteClient/${id_client}/${connecter_user._id}`);
	console.log(res.data)
	return res.data;
};

export const deleteDeffClient = async (id_client, connecter_user) => {
	//console.log({ id_client: id_client, connecter_user: connecter_user._id })

	const res = await api.put(`/deleteDeffClient/${id_client}/${connecter_user._id}`);
	console.log(res.data)
	return res.data;
};