'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) =>
{
    class User_Subscribe extends Model
    {
        static associate(models)
        {
            // define association here
        }
    }

    User_Subscribe.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'user_id',
            references: {
                model: 'User',
                key: 'id',
            },
        },
        subscribeId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'subscribe_id',
            references: {
                model: 'Subscribe',
                key: 'id',
            },
        },

    }, {
        sequelize,
        modelName: 'User_Subscribe',
        tableName: 'user_subscribe',
        timestamps: false,
        underscored: true,
    });
    return User_Subscribe;
};