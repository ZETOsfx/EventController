'use strict';

const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Subscribe extends Model {
        static associate({ User }) {
            Subscribe.belongsToMany(User, {
                through: 'User_Subscribe',
            });
        }
    }

    Subscribe.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: DataTypes.STRING(30),
        },
        {
            sequelize,
            modelName: 'Subscribe',
            tableName: 'subscribes',
            timestamps: false,
            underscored: true,
        }
    );

    return Subscribe;
};
