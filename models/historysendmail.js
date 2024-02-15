'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HistorySendMail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HistorySendMail.belongsTo(models.User, { 
        foreignKey: 'id',
        as: "users",
       });
    }
  }
  HistorySendMail.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    to_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content:  {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status:  {
      type: DataTypes.STRING,
      defaultValue: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    token_expiration: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'HistorySendMail',
    tableName: "history_send_mails",
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return HistorySendMail;
};