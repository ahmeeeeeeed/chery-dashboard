'use strict'

const Client = use('App/Models/Client')
const Dossier = use('App/Models/Dossier')
const Historique = use('App/Models/Historique')
const User = use('App/Models/User')



const addHistorique = async (desc, user, client, dossier, etat) => {
  return await Historique.create({
    desc: desc,
    user: user,
    client: client,
    dossier: dossier,
    etat: etat
  })
}

class ClientController {

  async addClient({ request, response, auth, params }) {
    try {
      const client = await Client.create(request.all())

      addHistorique("Le client vient d'être créé", params.connecter_user, client._id, null, null)

      return response.json(client)
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }

  }


  async clients({ response, request }) {
    try {
      let { limit, skip } = request.all()

      limit = limit ? parseInt(limit, 10) : 0
      skip = skip ? parseInt(skip, 10) : 0
      const x = await Client.where({ CIN: { $exists: true }, $expr: { $gt: [{ $strLenCP: "$CIN" }, 2] } })
        .limit(limit)
        .skip(skip)
        .sort({ created_at: -1 }).fetch()
      // const x = await Client.with('dossiers').first()
      const list = []
      for (let index = 0; index < x.toJSON().length; index++) {
        const listDossiers = []
        for (let indexx = 0; indexx < x.toJSON()[index].dossiers.length; indexx++) {
          listDossiers.push(await Dossier.find(x.toJSON()[index].dossiers[indexx]))
        }
        const cl = await Client.where({ _id: x.toJSON()[index]._id }).first()
        cl.dossiers = listDossiers
        list.push(cl)
        // list.push(await Client.with('dossiers').where({ _id: x.toJSON()[index]._id }).first())
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




  async getClient({ response, request, params }) {
    try {
      const client = await Client.find(params.id_client)
      const listDossiers = []
      //to display all clients with eager loading the folders
      for (let index = 0; index < client.toJSON().dossiers.length; index++) {
        listDossiers.push(await Dossier.find(client.toJSON().dossiers[index]))
      }
      client.dossiers = listDossiers
      return response.json(client);
      //return response.json(await Client.find(params.id_client))
      //return response.json(await Client.with('dossiers').where({ _id: params.id_client }).first())

    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }

  }

  async getNomberClient({ response, request, params }) {
    try {
      return response.json(await Client.where({ CIN: { $exists: true }, $expr: { $gt: [{ $strLenCP: "$CIN" }, 2] } })
        .count())
    } catch (error) {
      console.log(error)
      return response.send(err)
    }
  }

  async updateClient({ response, request, params }) {
    try {
      const new_client = request.all()
      var client = await Client.find(params.id_client)

      client.nom = new_client.nom
      client.prenom = new_client.prenom
      client.email = new_client.email
      client.adresse = new_client.adresse
      client.tel = new_client.tel
      client.CIN = new_client.CIN
      client.VIP = new_client.VIP
      //    client.dossiers = new_client.dossiers
      //    client.deleted_at = new_client.deleted_at

      client.save()

      addHistorique("Un client a été modifié", params.connecter_user, client.toJSON()._id, null, null)

      return response.json(client)
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }

  }

  async deleteClient({ request, params, response }) {
    try {
      const client = await Client.find(params.id_client)
      const user = await User.find(params.connecter_user)

      let change = null

      if (client.deleted_at == null) {
        change = new Date()
        //addHistorique("Un client a été supprimé par l'admin", params.connecter_user, client.toJSON()._id, null, null)
        addHistorique("Un client a été supprimé par un " + user.toJSON().role, user.toJSON()._id, params.id_client, null, null)

      }
      else {
        addHistorique("Un client a été rajouté par un " + user.toJSON().role, user.toJSON()._id, params.id_client, null, null)
      }


      const c = await Client.where({ _id: params.id_client }).update({ deleted_at: change })

      for (let index = 0; index < client.toJSON().dossiers.length; index++) {
        await Dossier.where({ _id: client.toJSON().dossiers[index] }).update({ deleted_at: change })
      }


      return response.json(c)
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }
  }

  async deleteDeffClient({ request, params, response }) {
    try {
      const client = await Client.find(params.id_client)
      const user = await User.find(params.connecter_user)

      addHistorique("Un client a été supprimé définitivement par un " + user.toJSON().role, user.toJSON()._id, params.id_client, null, null)
      //console.log(client.toJSON())
      const c = await Client.where({ _id: params.id_client }).update({ deleted_at: new Date(), CIN: "-1" })

      for (let index = 0; index < client.toJSON().dossiers.length; index++) {
        //console.log(client.toJSON().dossiers[index])
        await Dossier.where({ _id: client.toJSON().dossiers[index] }).update({ deleted_at: new Date(), num: -1 })
      }


      return response.json(c)
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }
  }
}

module.exports = ClientController
