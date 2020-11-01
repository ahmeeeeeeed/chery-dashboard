'use strict'

const Historique = use('App/Models/Historique')
const SmsApi = use('App/Models/SmsApi')
const axios = use('axios')

const Env = use('Env')


const addHistorique = async (desc, user, client, dossier, etat, sms) => {
    return await Historique.create({
        desc: desc,
        user: user,
        client: client,
        dossier: dossier,
        etat: etat,
        sms: sms
    })
}

class SmsApiController {

    async addSms({ request, response, auth, params }) {
        try {
            const sms = await SmsApi.create(request.all())

            return response.json(sms)
        }
        catch (err) {
            console.log(err)
            return response.send(err)
        }

    }

    async getSms({ request, response, auth, params }) {
        try {
            const { type } = request.all()
            if (type === "ouverture" || type === "cloture")
                return response.json(await SmsApi.findBy('type', type))
            else return response.json(await SmsApi.all())
        } catch (error) {
            console.log(err)
            return response.send(err)
        }
    }
    async sendSms({ request, response, auth, params }) {
        try {
            const { type, mobile, id_dossier, id_etat, prenom, nom, cin, num } = request.all()
            const api_url = Env.get('API_SMS')
            const sms = await SmsApi.findBy('type', type)

            var chars = { '{nom_prenom}': nom + ' ' + prenom, '{cin}': cin, '{num_dossier}': num };
            sms.description = sms.description.replace(/{nom_prenom}/g, m => chars[m]);
            sms.description = sms.description.replace(/{cin}/g, m => chars[m]);
            sms.description = sms.description.replace(/{num_dossier}/g, m => chars[m]);
            //sms.description = sms.description.replace(/é/g, '%C3%A9');//%C3%A0
            // console.log(sms.description)

            let txt = encodeURIComponent(sms.description)
            let results = await axios.get(`${api_url}&SC=Chery&TEXT=${txt}&MOBILE=${mobile}`)
                .then(() => {
                    let desc = type === "ouverture" ? "Un sms de création du compte vient d'être envoyé" :
                        "Un sms de finalisation du processus vient d'être envoyé"
                    addHistorique(desc, null, null, id_dossier, id_etat, sms.toJSON()._id)
                }).catch((error) => {
                    console.log(error)
                    return response.send(error)
                })

            return response.json(results.data)
        } catch (error) {
            console.log(err)
            return response.send(err)
        }
    }
    async updateSms({ request, response, auth, params }) {
        try {
            const content = request.all()
            const sms = await SmsApi.findBy('type', content.type)
            sms.description = content.description
            sms.save()
            return response.json(sms)
        } catch (error) {
            console.log(err)
            return response.send(err)
        }
    }



}

module.exports = SmsApiController
