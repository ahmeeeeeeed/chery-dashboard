'use strict'

const User = use('App/Models/User')
const Historique = use('App/Models/Historique')

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
class UserController {

  async register({ request, response, auth }) {
    try {
      const user = await User.create(
        request.all()
      )
      // let accessToken = await auth.generate(user)
      addHistorique(`Un ${user.role} a été ajouté par l'admin`,
        user.toJSON()._id,
        null,
        null,
        null)
      return response.json(user)
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }

  }


  async getUser({ response, params }) {
    try {
      const users = await User.find(params.id_user)
      console.log(users)
      return response.json(users)
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }
  }

  async listusers({ response }) {
    try {
      const x = await User.all()
      if (x.rows.length)
        return response.json(x)
      else response.status(204).send("no content")
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }

  }

  async listadmins({ response, request }) {
    try {
      const x = await User.where({ role: "admin" }).fetch()
      if (x.rows.length)
        return response.json(x)
      else response.status(204).send("no content")
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }

  }

  async listconseillers({ response, request }) {
    try {
      let { limit, skip } = request.all()

      limit = limit ? parseInt(limit, 10) : 0
      skip = skip ? parseInt(skip, 10) : 0
      const x = await User.where({ role: "conseiller" })
        .limit(limit)
        .skip(skip)
        .sort({ created_at: -1 }).fetch()

      if (x.rows.length)
        return response.json(x)
      else response.status(204).send("no content")
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }

  }
  async getNomberConseillers({ response, request, params }) {
    try {
      return response.json(await User.where({ role: "conseiller" }).count())
    } catch (error) {
      console.log(error)
      return response.send(err)
    }
  }
  /*  async listclients({ response, request }) {
     try {
       const x = await User.where({ role: "client" }).fetch()
       if (x.rows.length)
         return response.json(x)
       else response.status(204).send("no content")
     }
     catch (err) {
       console.log(err)
       return response.send(err)
     }
   } */
  async updateUser({ response, request, params }) {
    try {//////////////////////////////////////////////////////
      const { username, role, password, email } = request.all()
      const user = await User.find(params.id_user)
      user.username = username;
      user.password = password;
      user.email = email;
      user.role = role;
      user.save()
      addHistorique(`Un ${user.role} a été modifié par l'admin`,
        user._id,
        null,
        null,
        null)

      return response.json(user)
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }

  }
  async changeConseillerGrants({ response, request, params }) {
    try {
      const grants = request.only(['grants'])
      const user = await User.find(params.id_user)
      user.grants = grants;
      user.save()

      addHistorique(`Les priviléges de ce conceillera été modifié par l'admin`,
        user._id,
        null,
        null,
        null)

      return response.json(user)
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }
  }

  async deleteUser({ request, params, response }) {
    try {
      const user = await User.find(params.id_user)
      let change = null

      if (user.deleted_at == null) {
        change = new Date()
        addHistorique(`Un ${user.role} a été supprimé par l'admin`,
          user._id,
          null,
          null,
          null)
      }
      else {
        addHistorique(`Un ${user.role} a été rajouté par l'admin`,
          user._id,
          null,
          null,
          null)
      }


      return response.json(await User.where({ _id: params.id_user }).update({ deleted_at: change }))
    }
    catch (err) {
      console.log(err)
      return response.send(err)
    }
  }

}

module.exports = UserController
