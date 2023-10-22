'use strict';

const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) =>
{
    class Program extends Model
    {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models)
        {
            Program.hasMany(models.Event, {
                foreignKey: 'programId',
                as: 'events',
            });

            Program.belongsTo(models.Compose, {
                foreignKey: 'composeId',
                as: 'compose',
            });

            Program.belongsTo(models.User, {
                foreignKey: 'authorId',
                targetKey: 'id',
                as: 'author',
            });
        }
    }

    Program.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: DataTypes.STRING(30),
        authorId: {
            field: 'author_id',
            type: DataTypes.STRING(16),
            references: {
                model: 'User',
                key: 'id',
            },
            allowNull: false,
        },
        composeId: {
            field: 'compose_id',
            type: DataTypes.UUID,
            references: {
                model: 'Compose',
                key: 'id',
            },
            allowNull: true,
        },
        isActive: {
            field: "is_active",
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        timeToSwap: {
            field: "time_to_swap",
            type: DataTypes.TIME,
            allowNull: true,
        },
        createdAt: {
            type: Sequelize.DATE,
            field: 'created_at',
        },
    }, {
        sequelize,
        modelName: 'Program',
        tableName: 'programs',
        timestamps: false,
        underscored: true,
    });

    return Program;
};