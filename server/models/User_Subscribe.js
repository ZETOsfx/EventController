'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) =>
{
    class User_Subscribe extends Model
    {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models)
        {
            // define association here
        }
    }

    User_Subscribe.init({
        id: {
            type: DataTypes.UUID,
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