'use strict'

const User = use('App/Models/User')
const Token = use('App/Models/Token');
const Encryption = use('Encryption');

const Dossier = use('App/Models/Dossier')
const Client = use('App/Models/Client')
const Etat = use('App/Models/Etat')

const jwt_decode = use('jwt-decode')




class AuthController {

  async login({ auth, request, response }) {
    //auth.authenticatorInstance._config.model = 'App/Models/User'
    console.log(auth.authenticatorInstance._config.model)

    const { email, password } = request.all();
    //if(cin ) console.log(email,cin)

    //const {email, password} = request.only(['email','password'])

    try {
      if (await auth.attempt(email, password)) {
        let user = await User.findBy('email', email)
        // console.log(user.role)
        if (user.role === "conseiller" && user.deleted_at)
          return response.status(403).send({ error: "Access forbidden" })
        let accessToken = await auth.withRefreshToken().attempt(email, password);//await auth.generate(user)
        //let accessToken = await auth.authenticator('jwt').generate(user)
        if (user && accessToken) {
          return response.json({ "user": user, "access_token": accessToken })
        }
        else return response.status(401).send({ error: "bad crendentials" })
      }

    }
    catch (e) {
      console.log(e)
      return response.status(401).send({ error: "bad crendentials" })
    }
  }

  async loginClient({ auth, request, response }) {///////////////useless
    const { num, CIN, } = request.all();
    let exists = false
    //auth.authenticatorInstance._config.model = 'App/Models/Client'
    //console.log(auth.authenticatorInstance._config.model)
    //auth.authenticatorInstance._config.model = 'App/Models/User'

    //console.log(auth.authenticatorInstance._config.model)

    try {
      let client = await Client.findBy('CIN', CIN)
      let email = client.toJSON().email
      let password = client.toJSON().password
      if (client) {
        //set all folders in client object
        const listDossiers = []
        for (let index = 0; index < client.toJSON().dossiers.length; index++) {
          listDossiers.push(await Dossier.find(client.toJSON().dossiers[index]))
        }

        //check the number of the folder exists
        for (let index = 0; index < client.toJSON().dossiers.length; index++) {
          let d = await Dossier.find(client.toJSON().dossiers[index])
          if (d.toJSON().num == num) {
            exists = true;
            client.dossiers = listDossiers
            break;
          }
        }
        if (exists) {

          // let accessToken = /* await auth.attempt(email, password) */ await auth.generate(client)
          //auth.authenticatorInstance._config.model = 'App/Models/User'
          let accessToken = await auth.authenticator('client_jwt').generate(client)

          Token.create({ token: accessToken.token, type: "jwt_refresh_token", is_revoked: false, user_id: client._id })

          return response.json({ "client": client, "access_token": accessToken })
        }

        else return response.status(401).send({ error: "bad crendentials" })
      }
      else return response.status(401).send({ error: "bad crendentials" })

    }
    catch (e) {
      console.log(e)
      return response.send({ error: e })
    }
  }

  async clientAuth({ auth, request, response }) {
    const { num, CIN } = request.all();
    let exists = false

    try {
      let client = await Client.findBy('CIN', CIN)
      if (client) {
        //set all folders in client object
        const listDossiers = []
        for (let index = 0; index < client.toJSON().dossiers.length; index++) {
          listDossiers.push(await Dossier.find(client.toJSON().dossiers[index]))
        }

        //check the number of the folder exists
        for (let index = 0; index < client.toJSON().dossiers.length; index++) {
          let d = await Dossier.find(client.toJSON().dossiers[index])
          if (d.toJSON().num == num) {
            exists = true;
            client.dossiers = listDossiers
            break;
          }
        }
        if (exists) {
          let accessToken = await auth.generate(client)
          Token.create({ token: accessToken.token, type: "jwt_refresh_token", is_revoked: false, user_id: client._id })

          return response.json(accessToken)
        }

        else return response.status(401).send({ error: "bad crendentials" })
      }
      else return response.status(401).send({ error: "bad crendentials" })

    }
    catch (e) {
      console.log(e)
      return response.send({ error: e })
    }
  }

  async getClientAfterAuth({ auth, request, response, params }) {
    //const { num, CIN } = request.all();



    try {
      var token = request.request.headers.authorization.slice(7, request.request.headers.authorization.length)
      var decoded = jwt_decode(token);
      const clientFromToken = await Client.find(decoded.uid)

      let exists = false
      let client = await Client.findBy('CIN', params.demande)

      ////test if the id of token is the same of id client from entries (cin,num)
      if (clientFromToken.toJSON()._id === client.toJSON()._id) {

        if (client) {

          let doss;
          let cl;
          for (let index = 0; index < client.toJSON().dossiers.length; index++) {
            let d = await Dossier.find(client.toJSON().dossiers[index])
            if (d.toJSON().num == params.num) {
              exists = true
              doss = {
                _id: d.toJSON()._id,
                num: d.toJSON().num,
                client: d.toJSON().client,
                Remarques: d.toJSON().Remarques,
                etat_actuel: d.toJSON().etat_actuel,
                deleted_at: d.toJSON().deleted_at,
                created_at: d.toJSON().created_at,
                updated_at: d.toJSON().updated_at,

              }
              const x = await Etat.where({ ordre: { $gte: 1 } }).sort({ ordre: 1 }).fetch()

              cl = {
                _id: client._id,
                nom: client.nom,
                prenom: client.prenom,
                adresse: client.adresse,
                email: client.email,
                tel: client.tel,
                CIN: client.CIN,
                dossiers: doss,
                deleted_at: client.deleted_at,
                created_at: client.created_at,
                updated_at: client.updated_at,
                listEtats: x,

              }
              //  client.dossiers = doss
              // client.listEtats = x
              break;
            }
          }
          if (exists)
            return response.json(cl)
          else return response.status(404).send({ error: "folder not found" })


        }
        else return response.status(404).send({ error: "client not found" })

      }
      return response.status(401).send({ error: "Unauthorized client" })


    }
    catch (e) {
      console.log(e)
      return response.send({ error: e })
    }
  }

  async refreshToken({ request, response, auth }) {
    const { refresh_token } = request.only(['refresh_token']);

    try {
      return await auth.newRefreshToken().generateForRefreshToken(refresh_token);
    } catch (err) {
      console.log(err)
      response.status(401).send({ error: 'Invalid refresh token' });
    }
  }



  async logout({ request, response, auth }) {

    const { refresh_token } = request.only(['refresh_token']);
    const decrypted = Encryption.decrypt(refresh_token);
    try {
      const refreshToken = await Token.findBy('token', decrypted);
      // console.log(refreshToken)
      if (refreshToken) {
        refreshToken.delete();
        response.status(200).send({ status: 'ok' });
      } else {
        response.status(401).send({ error: 'Invalid refresh token' });
      }
    } catch (err) {
      response.status(401).send({ error: 'something went wrong' });
    }

  }

  async clientLogout({ request, response, auth }) {


    try {
      var token = request.request.headers.authorization.slice(7, request.request.headers.authorization.length)
      const clientToken = await Token.findBy('token', token);
      // console.log(refreshToken)
      if (clientToken) {
        clientToken.delete();
        response.status(200).send({ status: 'ok' });
      } else {
        response.status(401).send({ error: 'Invalid token' });
      }
    } catch (err) {
      response.status(401).send({ error: 'something went wrong' });
    }

  }

}

module.exports = AuthController
