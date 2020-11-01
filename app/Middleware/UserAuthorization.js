'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const jwt_decode = use('jwt-decode')
const User = use('App/Models/User')
class UserAuthorization {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, auth }, next) {
    // call next to advance the request
    //console.log(request.request.headers.authorization)
    var token = request.request.headers.authorization.slice(7, request.request.headers.authorization.length)
    var decoded = jwt_decode(token);
    // console.log(decoded);
    const user = await User.find(decoded.uid)
    if (!user) return response.status(401).send({ error: "Unauthorized user" })
    auth.authenticatorInstance._config.model = 'App/Models/User'
    console.log(auth.authenticatorInstance._config.model)
    await next()
  }
}

module.exports = UserAuthorization
