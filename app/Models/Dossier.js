'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Dossier extends Model {
    //static get objectIds (){return ['_id','client']}
    client() {
        return this.belongsTo('App/Models/Client', 'client', '_id')
    }
    /*  etat_actuel(){
         return this.belongsTo('App/Models/Etat' , 'etat_actuel' ,'_id')
     } */
    /*  signe(){
         return this.belongsTo('App/Models/Dossier' , 'etat_actuel.signe')
     } */

}

module.exports = Dossier
