'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Historique extends Model {
    user(){
        return this.belongsTo('App/Models/User' ,'user','_id' )
    }
    client(){
        return this.belongsTo('App/Models/Client' ,'client','_id' )
    }
    dossier(){
        return this.belongsTo('App/Models/Dossier' ,'dossier','_id' )
    }
    etat(){
        return this.belongsTo('App/Models/Etat' ,'etat','_id' )
    }
}

module.exports = Historique
