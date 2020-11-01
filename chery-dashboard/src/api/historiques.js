import api from "./base";

export const getAllHistory = async (limit, skip) => {

	const res = await api.get(`/getAllHistory?limit=${limit}&skip=${skip}`);
	return res.data;
};
export const getNombreHistory = async () => {

	const res = await api.get(`/getNombreHistory`);
	return res.data;
};

export const getHistoryByUser = async (id_user) => {

	const res = await api.get(`/getHistoryByUser/${id_user}`);
	return res.data;
};

export const getHistoryByClient = async (id_client) => {

	const res = await api.get(`/getHistoryByClient/${id_client}`);
	return res.data;
};

export const getHistoryEtat = async (id_etat) => {

	const res = await api.get(`/getHistoryEtat/${id_etat}`);
	return res.data;
};

export const getHistoryByDossier = async (id_dossier, limit, skip) => {
	const res = await api.get(`/getHistoryByDossier/${id_dossier}?limit=${limit}&skip=${skip}`);
	return res.data;
};

export const getNombreHistoryByDossier = async (id_dossier) => {

	const res = await api.get(`/getNombreHistoryByDossier/${id_dossier}`);
	return res.data;
};