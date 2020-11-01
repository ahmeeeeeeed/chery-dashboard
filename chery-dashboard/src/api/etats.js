import api from "./base";

export const listEtats = async () => {

	const res = await api.get("/listEtats");
	//console.log(res.data)
	return res.data;
};

export const listEtatsSupprimes = async (limit, skip) => {

	const res = await api.get(`/listEtatsSupprimes?limit=${limit}&skip=${skip}`);
	//console.log(res.data)
	return res.data;
};
export const listEtatsSupprimesEtNonSupprimes = async () => {

	const res = await api.get("/listEtatsSupprimesEtNonSupprimes");
	//console.log(res.data)
	return res.data;
};

export const addEtat = async (data, connecter_user) => {

	const res = await api.post(`/addEtat/${connecter_user._id}`, data);
	return res.data;
};

export const getNomberEtat = async () => {

	const res = await api.get(`/getNomberEtat`);
	return res.data;
};

export const getNomberEtatSupprimes = async () => {

	const res = await api.get(`/getNomberEtatSupprimes`);
	return res.data;
};

export const getEtatById = async (id_etat) => {

	const res = await api.get(`/getEtatById/${id_etat}`);
	return res.data;
};

export const getEtatByName = async (nom) => {

	const res = await api.get(`/getEtatByName/${nom}`);
	return res.data;
};

export const getEtatByOrdre = async (ordre) => {

	const res = await api.get(`/getEtatByOrdre/${ordre}`);
	return res.data[0];
};

export const getEtatsPrecByOrdre = async (id_etat) => {

	const res = await api.get(`/getEtatsPrecByOrdre/${id_etat}`);
	return res.data;
};

export const updateEtat = async (id_etat, connecter_user, data) => {

	const res = await api.put(`/updateEtat/${id_etat}/${connecter_user._id}`, data);
	return res.data;
};
export const deleteEtat = async (id_etat, connecter_user) => {

	const res = await api.put(`/deleteEtat/${id_etat}/${connecter_user._id}`);
	return res.data;
};

export const changerOrdreEtat = async (connecter_user, data) => {

	const res = await api.put(`/changerOrdreEtat/${connecter_user._id}`, data);
	return res.data;
};

