'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model
    {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ Role, Subscribe, Note })
        {
            // define association here
            User.belongsTo(Role, {
                foreignKey: 'roleId',
                targetKey: 'id',
                as: 'role',
            });

            User.belongsToMany(Subscribe, {
                through: 'User_Subscribe',
                as: 'subscribes',
            });

            User.belongsToMany(Note, {
                through: 'User_Note',
                as: 'reads',
            });
        }
    }

    User.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
        name: DataTypes.STRING(16),
        roleId: {
            type: DataTypes.UUID,
            field: 'role_id',
            references: {
                model: 'Role',
                key: 'id',
            },
        },
        passHash: {
            type: DataTypes.STRING,
            field: 'pass_hash',
        },
        login: DataTypes.STRING(20),
        email: DataTypes.STRING(100),

    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false,
        underscored: true,
    });

    return User;
};