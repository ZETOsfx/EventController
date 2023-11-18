'use strict';

const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) =>
{
    class Compose extends Model
    {
        static associate({ Program, Request, User })
        {
            Compose.hasMany(Program, {
                as: 'programs',
                foreignKey: 'composeId',
            });
            Compose.hasOne(Request, {
                as: 'request',
                foreignKey: 'composeId',
            });
            Compose.belongsTo(User, {
                foreignKey: 'authorId',
                targetKey: 'id',
                as: 'author',
            });
        }
    }

    Compose.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        comment: DataTypes.TEXT,
        date: DataTypes.STRING(10),
        isSpecial: {
            type: DataTypes.BOOLEAN,
            field: 'is_special',
            allowNull: false,
        },
        authorId: {
            field: 'author_id',
            type: DataTypes.STRING(16),
            references: {
                model: 'User',
                key: 'id',
            },
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        message: DataTypes.TEXT,
        createdAt: {
            type: Sequelize.DATE,
            field: 'created_at',
        },

    }, {
        sequelize,
        modelName: 'Compose',
        tableName: 'composes',
        timestamps: false,
        underscored: true,
    });

    return Compose;
};