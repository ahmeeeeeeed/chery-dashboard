'use strict'

const Dossier = use('App/Models/Dossier')
const Client = use('App/Models/Client')
const Etat = use('App/Models/Etat')
const Historique = use('App/Models/Historique')

const jwt_decode = use('jwt-decode')


const addHistorique = async (desc, user, client, dossier, etat) => {
  console.log(dossier)
  return await Historique.create({
    desc: desc,
    user: user,
    client: client,
    dossier: dossier,
    etat: etat
  })
}

class DossierController {

  async addDossier({ request, response, auth, params }) {
    try {
      const dossier = request.all()
      const dossier2 = await Dossier.create(dossier)
      await Client.where({ _id: dossier2.toJSON().client }).update({ $push: { dossiers: dossier2.toJSON()._id } })

      if (dossier2) {
        addHistorique("Le dossier vient d'être créé",
          params.connecter_user,
          dossier.client,
          dossier2.toJSON()._id,
          dossier2.etat_actuel.etatId)

        return response.json(dossier2)
      }

      else
        return response.status(204).send("no content")
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }

  }

  async listDossiers({ response, request, auth }) {
    await auth.authenticator('client_jwt')

    try {

      let { limit, skip } = request.all()

      limit = limit ? parseInt(limit, 10) : 0
      skip = skip ? parseInt(skip, 10) : 0
      const x = await Dossier.where({ num: { $gte: 1 } })
        .limit(limit)
        .skip(skip)
        .sort({ created_at: 1 }).fetch()
      // const x = await Dossier.with('client').first()

      const list = []
      //to display all folders with eager loading the clients
      for (let index = 0; index < x.toJSON().length; index++) {
        //const doss = await Dossier.with('client').where({ _id: x.toJSON()[index]._id }).first()
        const et = await Etat.where({ _id: x.toJSON()[index].etat_actuel.etatId }).first()
        const cl = await Client.where({ _id: x.toJSON()[index].client }).first()
        const doss = x.toJSON()[index]
        //console.log(x.toJSON()[index])
        doss.etat_actuel.etatId = et;
        doss.client = cl
        list.push(doss)
      }
      if (x.rows.length)
        return response.json(list.reverse())
      else response.status(204).send("no content")
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }

  }


  async getDossier({ response, request, params }) {
    try {
      // return response.json(await Dossier.find(params.id_dossier))
      /* const dossier = await Dossier
        //.with('client')
        //.with('etat_actuel')
        .where({ _id: params.id_dossier }).first() */
      //console.log(request.request.headers)

      /*  var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1Zjc0ZDU1NTdhMjY1MjA5NjgwMjcxN2UiLCJpYXQiOjE2MDM4MDQ4NDB9.g-M0VGo4NWE8LqB6Kb-IDEsnDSPT7eMQ-CVn_bM85hc"
       var decoded = jwt_decode(token);
       console.log(decoded); */

      const dossier = await Dossier.find(params.id_dossier)
      dossier.etat_actuel.etatId = await Etat.find(dossier.etat_actuel.etatId)
      dossier.client = await Client.find(dossier.toJSON().client)
      //console.log(dossier.client)

      return response.json(dossier)
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }

  }
  async getNomberDossier({ response, request, params }) {
    try {
      return response.json(await Dossier.where({ num: { $gte: 1 } }).sort({ created_at: 1 }).count())
    } catch (error) {
      console.log(error)
      return response.send(err)
    }
  }

  async getDossiersInfoParEtat({ request, response, params }) {

    try {
      const etats = await Etat.where({ ordre: { $gte: 1 } }).sort({ ordre: 1 }).fetch()
      const dossiers = await Dossier.all()
      const list = []

      for (let indexetats = 0; indexetats < etats.toJSON().length; indexetats++) {
        let nbr_dossiers_total = 0;
        let dossiers_valide = 0;
        let dossiers_refuse = 0;
        for (let indexdossiers = 0; indexdossiers < dossiers.toJSON().length; indexdossiers++) {
          if (dossiers.toJSON()[indexdossiers].etat_actuel.etatId === etats.toJSON()[indexetats]._id) {
            nbr_dossiers_total++;
            if (dossiers.toJSON()[indexdossiers].etat_actuel.signe === "positif")
              dossiers_valide++
            else if (dossiers.toJSON()[indexdossiers].etat_actuel.signe === "negatif")
              dossiers_refuse++

          }

        }
        list.push({
          etat: etats.toJSON()[indexetats].nom,
          stat: {
            nbr_dossiers_total: nbr_dossiers_total,
            dossiers_valide: dossiers_valide,
            dossiers_refuse: dossiers_refuse
          }
        })
      }
      if (etats.rows.length)
        return response.json(list)
      else response.status(204).send("no content")

    } catch (error) {
      console.log(err)
      return response.send(err)
    }
  }

  async updateDossier({ response, request, params }) {
    try {
      const data = request.only(['remarques'/* ,'etat_actuel','etats_prec' */])
      const dossier = await Dossier.find(params.id_dossier)
      const old_remarques = dossier.toJSON().Remarques
      dossier.Remarques = data.remarques;
      /*  dossier.etat_actuel = data.etat_actuel;
       dossier.etats_prec = data.etats_prec */
      dossier.save()
      //console.log(  dossier.toJSON().client)
      addHistorique(`Changement de description du dossier vers : "${data.remarques}"`,
        params.connecter_user,
        dossier.toJSON().client,
        dossier.toJSON()._id,
        dossier.etat_actuel.etatId)

      return response.json(dossier)
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }

  }

  async deleteDossier({ request, params, response }) {
    try {
      const dossier = await Dossier.find(params.id_dossier)
      // console.log(dossier)
      let change = null

      if (dossier.deleted_at == null) {
        change = new Date()
        try {
          await Dossier.where({ _id: params.id_dossier }).update({ deleted_at: change })

          await Client.where({ _id: dossier.client }).update({ $pull: { dossiers: dossier._id } })

          addHistorique("Un dossier d'un client ayant cet etat a été supprimé",
            params.connecter_user,
            dossier.toJSON().client,
            dossier.toJSON()._id,
            dossier.etat_actuel.etatId)
          return response.json("folder deleted also from the list of into his client collection")
        }
        catch (err) {
          console.log(err)
          return response.send(err)
        }

      }
      else
        return response.status(406).send("folder is already deleted !!")

    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }
  }

  async changerEtatDossier({ request, response, params }) {

    try {
      const { remarques, signe } = request.only(['remarques', 'signe'])
      const dossier = await Dossier.find(params.id_dossier)

      const old_etat = await Etat.find(dossier.etat_actuel.etatId)
      const new_etat = await Etat.find(params.id_etat)

      const etat_actuel = { etatId: params.id_etat, signe: signe }
      const etats_prec = { etat: dossier.etat_actuel.etatId, remarques: dossier.Remarques, updated_at: new Date() }

      if (old_etat.toJSON()._id === new_etat.toJSON()._id) {
        if (dossier.etat_actuel.signe != signe) {
          addHistorique(`Changement de signe du dossier de l'état "${old_etat.toJSON().nom}" de "${dossier.etat_actuel.signe}" vers "${signe}"`,
            params.connecter_user,
            dossier.toJSON().client,
            dossier.toJSON()._id,
            params.id_etat)
        }
        else {
          addHistorique(`Changement de la description du dossier au niveau de l'état "${old_etat.toJSON().nom}" de "${dossier.Remarques}" vers "${remarques}"`,
            params.connecter_user,
            dossier.toJSON().client,
            dossier.toJSON()._id,
            params.id_etat)
        }

        return response.json(await Dossier.where({ _id: params.id_dossier })
          .update({
            etat_actuel: etat_actuel,
            Remarques: remarques
          })
        )
      }
      else {
        addHistorique(`Changement d'état du dossier de "${old_etat.toJSON().nom}" vers "${new_etat.toJSON().nom}"`,
          params.connecter_user,
          dossier.toJSON().client,
          dossier.toJSON()._id,
          params.id_etat)

        return response.json(await Dossier.where({ _id: params.id_dossier })
          .update({
            $push: { etats_prec: etats_prec },
            etat_actuel: etat_actuel,
            Remarques: remarques
          })
        )
      }



      /* return response.json(await Dossier.where({ _id: params.id_dossier })
        .update({
          $push: { etats_prec: etats_prec },
          etat_actuel: etat_actuel,
          Remarques: remarques
        })
      ) */
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }
  }

  async changerEtatEnsembleDossiers({ request, response, params }) {

    try {

      //to convert json object to array
      const tab = Object.values(request.all())
      for (let index = 0; index < tab.length; index++) {
        // console.log(tab[index])
        const dossier = await Dossier.find(tab[index].dossier)

        const old_etat = await Etat.find(dossier.etat_actuel.etatId)
        const new_etat = await Etat.find(tab[index].etat)

        const etat_actuel = { etatId: tab[index].etat, signe: tab[index].signe }
        const etats_prec = { etat: dossier.etat_actuel.etatId, remarques: dossier.Remarques, updated_at: new Date() }

        if (old_etat.toJSON()._id === new_etat.toJSON()._id) {
          if (dossier.etat_actuel.signe != tab[index].signe) {
            addHistorique(`Changement de signe du dossier de l'état "${old_etat.toJSON().nom}" de "${dossier.etat_actuel.signe}" vers "${tab[index].signe}"`,
              params.connecter_user,
              dossier.toJSON().client,
              dossier.toJSON()._id,
              tab[index].etat)
          }
          else {
            addHistorique(`Changement de la description du dossier au niveau de l'état "${old_etat.toJSON().nom}" de "${dossier.Remarques}" vers "${tab[index].remarques}"`,
              params.connecter_user,
              dossier.toJSON().client,
              dossier.toJSON()._id,
              tab[index].etat)
          }

          await Dossier.where({ _id: tab[index].dossier })
            .update({
              etat_actuel: etat_actuel,
              Remarques: tab[index].remarques
            })

        }
        else {
          addHistorique(`Changement d'état du dossier de "${old_etat.toJSON().nom}" vers "${new_etat.toJSON().nom}"`,
            params.connecter_user,
            dossier.toJSON().client,
            dossier.toJSON()._id,
            tab[index].etat)

          await Dossier.where({ _id: tab[index].dossier })
            .update({
              $push: { etats_prec: etats_prec },
              etat_actuel: etat_actuel,
              Remarques: tab[index].remarques
            })

        }
        /*  addHistorique(`Changement d'état du dossier de "${old_etat.toJSON().nom}" vers "${new_etat.toJSON().nom}"`,
           params.connecter_user,
           dossier.toJSON().client,
           dossier._id,
           tab[index].etat)
 
         await Dossier.where({ _id: tab[index].dossier })
           .update({
             $push: { etats_prec: etats_prec },
             etat_actuel: etat_actuel,
             Remarques: tab[index].remarques
           }) */


      }
      return response.status(200).send("etats des dossiers ont ete changé avec succés !")

    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }
  }

  async getDossiersMemeEtat({ request, response, params }) {

    try {

      const x = await Dossier.where({ 'etat_actuel.etatId': params.id_etat, num: { $gte: 1 } }).fetch()
      const list = []
      //to display all folders with eager loading the clients
      for (let index = 0; index < x.toJSON().length; index++) {
        const d = await Dossier.find(x.toJSON()[index]._id)
        d.etat_actuel.etatId = await Etat.find(params.id_etat)
        d.client = await Client.find(d.client)
        list.push(d)
      }

      if (x.rows.length)
        return response.json(list)
      else response.status(204).send("no content")
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }
  }
}

module.exports = DossierController
