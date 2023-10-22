'use strict';

const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) =>
{
    class Note extends Model
    {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models)
        {
            Note.belongsTo(models.User, {
                foreignKey: 'authorId',
                targetKey: 'id',
                as: 'author',
            });

            Note.belongsToMany(models.User, {
                through: 'User_Subscribe',
                as: 'read',
            });
        }
    }

    Note.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: DataTypes.STRING(100),
        comment: DataTypes.TEXT,
        expires: DataTypes.STRING(10),
        authorId: {
            field: 'author_id',
            type: DataTypes.STRING(16),
            references: {
                model: 'User',
                key: 'id',
            },
        },
        onBroadcast: {
            field: 'on_broadcast',
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        addressedTo: {
            field: 'addressed_to',
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        createdAt: {
            type: Sequelize.DATE,
            field: 'created_at',
        },

    }, {
        sequelize,
        modelName: 'Note',
        tableName: 'notes',
        timestamps: false,
        underscored: true,
    });

    return Note;
};