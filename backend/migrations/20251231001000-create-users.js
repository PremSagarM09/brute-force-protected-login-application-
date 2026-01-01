'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      first_name: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      last_name: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      mobile: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true
      },
      block_15: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
      },
      max_attempts: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 5
      },
      max_ip_attempts: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 100
      },
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  }
};
