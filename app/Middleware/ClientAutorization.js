'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const jwt_decode = use('jwt-decode')
const Client = use('App/Models/Client')
const Token = use('App/Models/Token');



class ClientAutorization {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response, auth }, next) {

    var token = request.request.headers.authorization.slice(7, request.request.headers.authorization.length)
    var decoded = jwt_decode(token);
    const client = await Client.find(decoded.uid)
    const clientToken = await Token.findBy('token', token);

    if (!client)
      return response.status(401).send({ error: "Unauthorized user" })
    if (!clientToken)
      return response.status(401).send({ error: "Invalid token" })
    // auth.authenticatorInstance._config.model = 'App/Models/Client'
    // console.log(await auth.authenticator('client_jwt')._config.model)

    // console.log(auth.authenticatorInstance._config.model)
    await next()
  }
}

module.exports = ClientAutorization
