import api from "./base";
import axios from 'axios'

/***********************************sms************************************************** */
export const getSms = async (type) => {
    const res = await api.get(`/getSms?type=${type}`);
    return res.data;
};

/* export const sendSms = async (type, tel, dossier) => {
    const res = await api.get(`/sendSms?mobile=${tel}&type=${type}&id_dossier=${dossier._id}&id_etat=${dossier.etat_actuel.etatId}`);
    console.log(res.data)
    return res.data;
}; */
export const sendSms = async (type, client, dossier, id_etat) => {
    const res = await api.get(`/sendSms?mobile=216${client.tel}&type=${type}&id_dossier=${dossier._id}&id_etat=${id_etat}&prenom=${client.prenom}&nom=${client.nom}&cin=${client.CIN}&num=${dossier.num}`);
    console.log(res.data)
    return res.data;
};

export const updateSms = async (data) => {
    const res = await api.put("/updateSms", data);
    return res.data;
};
/***********************************email************************************************** */
export const addMail = async (data) => {
    const res = await api.post("/addMail", data);
    return res.data;
};

export const getMails = async () => {
    const res = await api.get("/getMails");
    return res.data;
};

export const getMailByEtat = async (id_etat) => {
    const res = await api.get(`/getMailByEtat/${id_etat}`);
    return res.data;
};

export const getMailById = async (id_mail) => {
    const res = await api.get(`/getMailById/${id_mail}`);
    return res.data;
};

export const sendMail = async (client, subject, id_etat, dossier) => {
    console.log({ client, subject, id_etat, dossier })
    const res = await api.get(`/sendMail?email=${client.email}&subject=${subject}&id_etat=${id_etat}&id_dossier=${dossier._id}&prenom=${client.prenom}&nom=${client.nom}&cin=${client.CIN}&num=${dossier.num}`);
    console.log(res)
    return res.data;
};

export const updateMail = async (id_mail, data) => {
    const res = await api.put(`/updateMail/${id_mail}`, data);
    return res.data;
};
