'use strict';

const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) =>
{
    class File extends Model
    {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models)
        {
            File.belongsTo(models.User, {
                foreignKey: 'authorId',
                targetKey: 'id',
                as: 'author',
            });
        }
    }

    File.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: DataTypes.TEXT,
        src: DataTypes.TEXT,
        type: DataTypes.STRING(5),
        weight: DataTypes.STRING(10),
        authorId: {
            field: 'author_id',
            type: DataTypes.STRING(16),
            references: {
                model: 'User',
                key: 'id',
            },
        },
        expires: DataTypes.DATE,
        isUnlimited: {
            field: 'is_unlimited',
            type: DataTypes.BOOLEAN,
        },
        format: DataTypes.STRING(6),

        createdAt: {
            type: Sequelize.DATE,
            field: 'created_at',
        },

    }, {
        sequelize,
        modelName: 'File',
        tableName: 'files',
        timestamps: true,
        underscored: true,
    });

    return File;
};