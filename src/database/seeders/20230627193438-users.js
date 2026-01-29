'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'db_usuarios',
      [
        {
          nombres: 'User',
          apellido_paterno: 'Example',
          usuario: 'user-example',
          contrasenia: 'password-example',
          correo: 'email@example.mx',
          telefono: '+52999999999',
          genero: 'No definido',
          estado_civil: 'Soltero'
        }
      ],
      {}
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('db_usuarios', null, {})
  }
}
