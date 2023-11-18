'use strict';

const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) =>
{
    class Request extends Model
    {
        static associate({ Compose, User })
        {
            Request.belongsTo(Compose, {
                as: 'compose',
                foreignKey: 'composeId',
            });
            Request.belongsTo(User, {
                foreignKey: { name: 'approved', allowNull: true, },
                targetKey: 'name',
            });
        }
    }

    Request.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        composeId: {
            field: 'compose_id',
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Compose',
                key: 'id',
            },
        },
        isAccepted: {
            field: 'is_accepted',
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        approved: {
            type: DataTypes.STRING(16),
            allowNull: true,
        },
        changer: {
            type: DataTypes.STRING(16),
            allowNull: true,
        },
        isActive: {
            field: 'is_active',
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        inProcessing: {
            field: 'in_processing',
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },

    }, {
        sequelize,
        modelName: 'Request',
        tableName: 'requests',
        timestamps: false,
        underscored: true,
    });

    return Request;
};