'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sessions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      refresh_token_hash: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      device_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      device_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      ip: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_agent: {
        type: Sequelize.STRING,
        allowNull: true
      },
      replaced_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'sessions',
          key: 'id'
        }
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      revoked_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        allowNull: false
      }
    })

    await queryInterface.addIndex('sessions', ['user_id'])
    await queryInterface.addIndex('sessions', ['refresh_token_hash'])
    await queryInterface.addIndex('sessions', ['expires_at'])
  },

  down: async (queryInterface) => {
    await queryInterface.removeIndex('sessions', ['user_id'])
    await queryInterface.removeIndex('sessions', ['refresh_token_hash'])
    await queryInterface.removeIndex('sessions', ['expires_at'])
    await queryInterface.dropTable('sessions')
  }
}
