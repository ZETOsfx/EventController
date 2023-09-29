'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) =>
{
    class Request extends Model
    {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models)
        {
            // define association here
            Request.belongsTo(models.Compose, {
                as: 'compose',
                foreignKey: 'composeId',
            });

            Request.belongsTo(models.User, {
                foreignKey: { name: 'approved', allowNull: true, },
                targetKey: 'name',
            });
        }
    }

    Request.init({
        id: {
            type: DataTypes.UUID,
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