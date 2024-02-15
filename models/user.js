'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.HistorySendMail, {
        foreignKey: "user_id",
        as: "history_send_mails"
      });
      User.hasMany(models.ShortenedLink, {
        foreignKey: "user_id",
        as: "shortened_links"
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.NOW,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: "users",
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  return User;
};