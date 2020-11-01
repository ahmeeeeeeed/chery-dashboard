'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Client extends Model {
    dossiers() {
        return this.hasMany('App/Models/Dossier', 'dossiers', '_id')
    }
    /**
 * A relationship on tokens is required for auth to
 * work. Since features like `refreshTokens` or
 * `rememberToken` will be saved inside the
 * tokens table.
 *
 * @method tokens
 *
 * @return {Object}
 */
    tokens() {
        return this.hasMany('App/Models/Token')
    }

}

module.exports = Client
