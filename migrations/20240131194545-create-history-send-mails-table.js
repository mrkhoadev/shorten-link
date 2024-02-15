'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('history_send_mails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      to_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content:  {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status:  {
        type: Sequelize.STRING,
        defaultValue: false,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      token_expiration: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "users"
          },
          key: "id",
        }
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('history_send_mails');
  }
};