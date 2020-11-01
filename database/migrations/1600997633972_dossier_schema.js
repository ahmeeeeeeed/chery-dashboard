'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DossierSchema extends Schema {
  up () {
    this.create('dossiers', (table) => {
      table.increments()
      table.timestamps()
      //table.string('client')
     // table.foreign('client').references('clients._id')
    })
  }

  down () {
    this.drop('dossiers')
  }
}

module.exports = DossierSchema
