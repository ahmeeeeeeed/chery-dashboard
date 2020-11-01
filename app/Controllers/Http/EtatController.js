'use strict'

const Etat = use('App/Models/Etat')
const Historique = use('App/Models/Historique')

const addHistorique = async (desc, user, client, dossier, etat) => {
    //console.log(dossier)
    return await Historique.create({
        desc: desc,
        user: user,
        client: client,
        dossier: dossier,
        etat: etat
    })
}

class EtatController {

    async addEtat({ request, response, params }) {
        try {
            const etat = request.all() //await Etat.create(request.all())
            const listetats = await Etat.where({ ordre: { $gte: etat.ordre } }).sort({ ordre: 1 }).fetch()

            for (let index = 0; index < listetats.toJSON().length; index++) {
                await Etat.where({ _id: listetats.toJSON()[index]._id }).update({ ordre: listetats.toJSON()[index].ordre + 1 })
            }

            //console.log(listetats)
            const new_etat = await Etat.create(etat)
            addHistorique("L'état vient d'être créé",
                params.connecter_user,
                null,
                null,
                new_etat._id)
            return response.json(new_etat)
        }
        catch (err) {
            console.log(err)
            return response.send(err)
        }
    }

    async listEtats({ response }) {
        try {
            const x = await Etat.where({ ordre: { $gte: 1 } }).sort({ ordre: 1 }).fetch()
            if (x.rows.length)
                return response.json(x)
            else response.status(204).send("no content")
        }
        catch (err) {
            console.log(err)
            return response.send(err)
        }

    }
    async listEtatsSupprimes({ response }) {
        try {
            const x = await Etat.where({ ordre: 0 }).sort({ deleted_at: -1 }).fetch()
            if (x.rows.length)
                return response.json(x)
            else response.status(204).send("no content")
        }
        catch (err) {
            console.log(err)
            return response.send(err)
        }

    }
    async listEtatsSupprimesEtNonSupprimes({ response }) {
        try {
            const x = await Etat.where({ _id: { $gte: 1 } }).sort({ ordre: 1 }).fetch()
            if (x.rows.length)
                return response.json(x)
            else response.status(204).send("no content")
        }
        catch (err) {
            console.log(err)
            return response.send(err)
        }

    }
    async getNomberEtat({ response, request, params }) {
        try {
            return response.json(await Etat.where({ ordre: { $gte: 1 } }).count())
        } catch (error) {
            console.log(error)
            return response.send(err)
        }
    }

    async getNomberEtatSupprimes({ response, request, params }) {
        try {
            return response.json(await Etat.where({ ordre: 0 }).count())
        } catch (error) {
            console.log(error)
            return response.send(err)
        }
    }


    async getEtatById({ response, request, params }) {
        try {

            return response.json(await Etat.find(params.id_etat))
        }
        catch (err) {
            console.log(err)
            return response.send(err)
        }

    }

    async getEtatByName({ response, request, params }) {
        try {
            return response.json(await Etat.where({ nom: params.nom }).fetch())
        }
        catch (err) {
            console.log(err)
            return response.send(err)
        }

    }

    async getEtatByOrdre({ response, request, params }) {
        try {
            return response.json(await Etat.where({ ordre: parseInt(params.ordre, 10) }).fetch())
        }
        catch (err) {
            console.log(err)
            return response.send(err)
        }

    }

    async updateEtat({ response, request, params }) {
        try {
            const data = request.only(['nom', 'titre', 'signes'])
            const etat = await Etat.find(params.id_etat)
            const olde_nom = etat.toJSON().nom
            const old_titre = etat.toJSON().titre
            etat.nom = data.nom;
            etat.titre = data.titre;
            etat.signes = data.signes

            etat.save()
            let description = "Changement des descriptions des signes de cet état"
            if (olde_nom != etat.toJSON().nom) {
                description = `Changement du nom d'état de "${olde_nom}" vers "${etat.nom}"`
            }
            if (old_titre != etat.toJSON().titre) {
                description = `Changement du titre d'état de "${old_titre}" vers "${etat.titre}"`
            }
            if (olde_nom != etat.toJSON().nom && old_titre != etat.toJSON().titre) {
                description = `Changement du nom d'état de "${olde_nom}" vers "${etat.nom}" et de titre de "${old_titre}" vers "${etat.titre}"`
            }

            addHistorique(description,
                params.connecter_user,
                null,
                null,
                etat._id)
            return response.json(etat)
        }
        catch (err) {
            console.log(err)
            return response.send(err)
        }

    }
    async deleteEtat({ request, params, response }) {
        try {
            const etat = await Etat.find(params.id_etat)

            /// changer isfinal et isfirst
            if (etat.toJSON().isFinal === true) {
                const e = await Etat.where({ ordre: { $lt: etat.toJSON().ordre } }).sort({ ordre: -1 }).first()
                e.isFinal = true;
                e.isFirst = false;
                //e.save()
            }
            if (etat.toJSON().isFirst === true) {
                const e = await Etat.where({ ordre: { $gt: etat.toJSON().ordre } }).sort({ ordre: 1 }).first()
                e.isFinal = false;
                e.isFirst = true;
                //e.save()
            }
            const tab = []
            //changer l'lordre de chaque etat
            const listetats = await Etat.where({ ordre: { $gt: etat.toJSON().ordre } }).sort({ ordre: 1 }).fetch()
            for (let index = 0; index < listetats.toJSON().length; index++) {
                await Etat.where({ _id: listetats.toJSON()[index]._id }).update({ ordre: listetats.toJSON()[index].ordre - 1 })
                // tab.push({ ordre_to_change: listetats.toJSON()[index].ordre - 1, etat: listetats.toJSON()[index] })
            }

            //supprimer l'état
            let change = new Date()
            addHistorique("L'état vient d'être supprimé",
                params.connecter_user,
                null,
                null,
                params.id_etat)
            return response.json(await Etat.where({ _id: params.id_etat }).update({ deleted_at: change, ordre: 0 }))
        }
        catch (err) {
            console.log(err)
            return response.send(err)
        }
    }

    async getEtatsPrecByOrdre({ request, response, params }) {
        try {
            const etat = await Etat.find(params.id_etat)
            const etats = await Etat.where({ ordre: { $lt: etat.ordre } }).sort({ ordre: 1 }).fetch()

            return response.json(etats)
        }
        catch (err) {
            console.log(err)
            return response.send(err)
        }
    }

    async changerOrdreEtat({ request, response, params }) {
        try {
            const ordred_etats = Object.values(request.all())

            for (let index = 0; index < ordred_etats.length; index++) {
                //console.log(ordred_etats[index].fullEtat._id)
                await Etat.where({ _id: ordred_etats[index].fullEtat._id }).
                    update({
                        ordre: index + 1,
                        isFinal: index === ordred_etats.length - 1 ? true : false,
                        isFirst: index === 0 ? true : false
                    })
            }

            addHistorique("Un ordre d'état a été changé",
                params.connecter_user,
                null,
                null,
                null)

            return response.json(await Etat.all())
        }
        catch (err) {
            console.log(err)
            return response.send(err)
        }
    }


}

module.exports = EtatController
