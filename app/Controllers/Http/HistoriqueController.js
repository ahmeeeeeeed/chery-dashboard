'use strict'

const Dossier = use('App/Models/Dossier')
const Client = use('App/Models/Client')
const Etat = use('App/Models/Etat')
const Historique = use('App/Models/Historique')
const User = use('App/Models/User')



class HistoriqueController {

  /*   async getHistory(histTab) {
  
      const user = await User.where({ _id: histTab.user }).first()
      const client = await Client.where({ _id: histTab.client }).first()
      const etat = await Etat.where({ _id: histTab.etat }).first()
      const dossier = await Dossier.where({ _id: histTab.dossier }).first()
  
      const hist = await Historique.where({ _id: histTab._id }).first()
      hist.user = user
      hist.client = client
      hist.etat = etat
      hist.dossier = dossier
      return hist;
    } */

  async getAllHistory({ response, request, params }) {
    try {
      //this.getHistory()
      let { limit, skip } = request.all()

      limit = limit ? parseInt(limit, 10) : 0
      skip = skip ? parseInt(skip, 10) : 0
      const x = await Historique.where({ sms: null, mail: null })
        .limit(limit)
        .skip(skip)
        .sort({ created_at: -1 }).fetch()
      //const x = await Historique.where({ _id: { $gte: 1 } }).sort({ created_at: -1 }).fetch()
      const list = []
      //to display all clients with eager loading the folders
      for (let index = 0; index < x.toJSON().length; index++) {
        const user = await User.where({ _id: x.toJSON()[index].user }).first()
        const client = await Client.where({ _id: x.toJSON()[index].client, $expr: { $gt: [{ $strLenCP: "$CIN" }, 2] } }).first()
        const etat = await Etat.where({ _id: x.toJSON()[index].etat }).first()
        const dossier = await Dossier.where({ _id: x.toJSON()[index].dossier, num: { $gte: 1 } }).first()

        const hist = await Historique.where({ _id: x.toJSON()[index]._id }).first()
        hist.user = user
        hist.client = client
        hist.etat = etat
        hist.dossier = dossier


        list.push(hist)

        /*  list.push(await Historique.with('user').with('client').with('dossier').with('etat')
           .where({ _id: x.toJSON()[index]._id }).first()) */
      }
      if (x.rows.length)
        return response.json(list/*x*/)
      else response.status(204).send("no content")
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }
  }

  async getNombreHistory({ response, request, params }) {
    try {
      return response.json(await Historique.where({ sms: null, mail: null }).count())

    } catch (err) {
      console.log(err)
      return response.send(err)
    }
  }
  async getHistoryByUser({ response, request, params }) {
    try {
      const x = await Historique.where({ user: params.id_user }).fetch()


      if (x.rows.length)
        return response.json(x)
      else response.status(204).send("no content")
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }
  }
  async getHistoryByClient({ response, request, params }) {
    try {
      const x = await Historique.where({ client: params.id_client, $expr: { $gt: [{ $strLenCP: "$CIN" }, 2] } }).fetch()


      if (x.rows.length)
        return response.json(x)
      else response.status(204).send("no content")
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }
  }
  async getHistoryByEtat({ response, request, params }) {
    try {
      const x = await Historique.where({ etat: params.id_etat }).fetch()


      if (x.rows.length)
        return response.json(x)
      else response.status(204).send("no content")
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }
  }
  async getHistoryByDossier({ response, request, params }) {
    try {
      let { limit, skip } = request.all()

      limit = limit ? parseInt(limit, 10) : 0
      skip = skip ? parseInt(skip, 10) : 0
      const x = await Historique.where({ dossier: params.id_dossier/* , sms: null, mail: null */ })
        .limit(limit)
        .skip(skip)
        .sort({ created_at: -1 }).fetch()

      const list = []
      //to display all clients with eager loading the folders
      for (let index = 0; index < x.toJSON().length; index++) {
        const user = await User.where({ _id: x.toJSON()[index].user }).first()
        const client = await Client.where({ _id: x.toJSON()[index].client }).first()
        const etat = await Etat.where({ _id: x.toJSON()[index].etat }).first()
        const dossier = await Dossier.where({ _id: x.toJSON()[index].dossier }).first()

        const hist = await Historique.where({ _id: x.toJSON()[index]._id }).first()
        hist.user = user
        hist.client = client
        hist.etat = etat
        hist.dossier = dossier


        list.push(hist)
        /* list.push(await Historique.with('user').with('client').with('dossier').with('etat')
          .where({ _id: x.toJSON()[index]._id }).first()) */
      }

      if (x.rows.length)
        return response.json(list/*x*/)
      else response.status(204).send("no content")
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }
  }

  async getNombreHistoryByDossier({ response, request, params }) {
    try {
      return response.json(await Historique.where({ dossier: params.id_dossier }).count())

    } catch (err) {
      console.log(err)
      return response.send(err)
    }
  }

}

module.exports = HistoriqueController
