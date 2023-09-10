'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Subscribe extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Subscribe.belongsToMany(models.User, {
                through: 'User_Subscribe',
            });
        }
    }

    Subscribe.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
        name: DataTypes.STRING(30),

    }, {
        sequelize,
        modelName: 'Subscribe',
        tableName: 'subscribes',
        timestamps: false,
        underscored: true,
    });

    return Subscribe;
};