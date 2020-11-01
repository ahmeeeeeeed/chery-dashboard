import api from "./base";
/* import axios from 'axios'
import { Api} from '../config/constants' 
 */
export const listDossiers = async (limit, skip) => {
	const res = await api.get(`/listDossiers?limit=${limit}&skip=${skip}`);
	// return await axios.get(`${Api.baseURL}/listDossiers`,{headers : {Authorization : `Bearer ${jwt.token}`}})
	return res.data;
};

export const addDossier = async (connecter_user, data) => {

	const res = await api.post(`/addDossier/${connecter_user._id}`, data);
	return res.data;
};

export const getDossier = async (id_dossier) => {

	const res = await api.get(`/getDossier/${id_dossier}`);
	return res.data;
};

export const getNomberDossier = async () => {

	const res = await api.get(`/getNomberDossier`);
	return res.data;
};
export const getDossiersInfoParEtat = async () => {
	const res = await api.get("/getDossiersInfoParEtat");
	return res.data;
};

export const updateDossier = async (id_dossier, connecter_user, data) => {

	const res = await api.put(`/updateDossier/${id_dossier}/${connecter_user._id}`, data);
	return res.data;
};

export const deleteDossier = async (id_dossier, connecter_user) => {

	const res = await api.put(`/deleteDossier/${id_dossier}/${connecter_user._id}`);
	return res.data;
};

export const changerEtatDossier = async (id_dossier, id_etat, connecter_user, data) => {

	const res = await api.put(`/changerEtatDossier/${id_dossier}/${id_etat}/${connecter_user._id}`, data);
	return res.data;
};

export const changerEtatEnsembleDossiers = async (connecter_user, data) => {

	const res = await api.put(`/changerEtatEnsembleDossiers/${connecter_user._id}`, data);
	return res.data;
};

export const getDossiersMemeEtat = async (id_etat) => {

	const res = await api.get(`/getDossiersMemeEtat/${id_etat}`);
	return res.data;
};

