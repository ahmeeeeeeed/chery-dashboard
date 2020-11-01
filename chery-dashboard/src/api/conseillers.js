import api from "./base";

export const clients = async () => {

	const res = await api.get("/clients");
	return res.data;
};

export const register = async (data) => {

	const res = await api.post(`/register`, data);
	return res.data;
};

export const getUser = async (id_user) => {

	const res = await api.get(`/getUser/${id_user}`);
	return res.data;
};

export const listusers = async () => {

	const res = await api.get(`/listusers`);
	return res.data;
};

export const listconseillers = async (limit, skip) => {

	const res = await api.get(`/listconseillers?limit=${limit}&skip=${skip}`);
	return res.data;
};

export const listadmins = async () => {

	const res = await api.get(`/listadmins`);
	return res.data;
};

export const getNomberConseillers = async () => {

	const res = await api.get(`/getNomberConseillers`);
	return res.data;
};

export const updateUser = async (data, id_user) => {

	const res = await api.put(`/updateUser/${id_user}`, data);
	return res.data;
};

export const changeConseillerGrants = async (data, id_user) => {

	const res = await api.put(`/changeConseillerGrants/${id_user}`, data);
	return res.data;
};

export const deleteUser = async (id_user) => {

	const res = await api.put(`/deleteUser/${id_user}`);
	return res.data;
};

