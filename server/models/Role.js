'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role extends Model
    {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ User })
        {
            // define association here
            Role.hasMany(User, {
                sourceKey: 'id',
                foreignKey: 'roleId',
            });
        }
    }

    Role.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING(10),
            unique: true,
        },

    }, {
        sequelize,
        modelName: 'Role',
        tableName: 'roles',
        timestamps: false,
        underscored: true,
    });

    return Role;
};