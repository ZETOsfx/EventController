'use strict';

const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate({ User }) {
            Role.hasMany(User, {
                sourceKey: 'id',
                foreignKey: 'roleId',
            });
        }
    }

    Role.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING(10),
                unique: true,
            },
        },
        {
            sequelize,
            modelName: 'Role',
            tableName: 'roles',
            timestamps: false,
            underscored: true,
        }
    );

    return Role;
};
