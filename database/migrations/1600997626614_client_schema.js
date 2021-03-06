'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClientSchema extends Schema {
  up () {
    this.create('clients', (table) => {
      table.increments()
      table.timestamps()
      table.string('nom')
      table.string('prenom')
      table.string('adresse')
      table.string('email')
      
    })
  }

  down () {
    this.drop('clients')
  }
}

module.exports = ClientSchema
