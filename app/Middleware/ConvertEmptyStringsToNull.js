'use strict'

class ConvertEmptyStringsToNull {
  async handle({ request, response }, next) {
    //console.log("into the middleware")
    //return response.status(401).send({ error: "bad crendentials" })

    if (Object.keys(request.body).length) {
      request.body = Object.assign(
        ...Object.keys(request.body).map(key => ({
          [key]: request.body[key] !== '' ? request.body[key] : null
        }))
      )
    }

    await next()
  }
}

module.exports = ConvertEmptyStringsToNull
