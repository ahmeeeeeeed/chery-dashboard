import { getUser } from "../api/conseillers";


export const controleCIN = (listclients, cin) => {
    let exists = false
    listclients.forEach(element => {
        if (element.CIN === cin || parseInt(cin) <= 0) {
            exists = true
        }
    });

    return exists
}

export const controleNumDossier = (listdossiers, num) => {
    let exists = false
    listdossiers.forEach(element => {
        if (element.full_dossier.num + '' === num || num <= 0) {
            exists = true
        }
    });

    return exists
}

export const controleDisponibilitéConseiller = (id_user) => {
    const resultat = getUser(id_user)
    console.log(resultat)
    if (resultat && !resultat.delete_at) return false
    return true

}