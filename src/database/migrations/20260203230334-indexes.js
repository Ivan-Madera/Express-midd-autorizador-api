'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    await Promise.all([
      queryInterface.addIndex('sessions', ['user_id'], { name: 'idx_user' }),
      queryInterface.addIndex('sessions', ['refresh_token_hash'], { name: 'idx_refresh' }),
      queryInterface.addIndex('sessions', ['revoked_at'], { name: 'idx_revoked' }),
      queryInterface.addIndex('sessions', ['expires_at'], { name: 'idx_exp' })
    ]);
  },

  async down(queryInterface, _Sequelize) {
    await Promise.all([
      queryInterface.removeIndex('sessions', 'idx_user'),
      queryInterface.removeIndex('sessions', 'idx_refresh'),
      queryInterface.removeIndex('sessions', 'idx_revoked'),
      queryInterface.removeIndex('sessions', 'idx_exp')
    ]);
  }
};
