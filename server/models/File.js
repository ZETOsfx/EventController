'use strict';

const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class File extends Model {
        static associate({ User }) {
            File.belongsTo(User, {
                foreignKey: 'authorId',
                targetKey: 'id',
                as: 'author',
            });
        }
    }

    File.init(
        {
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
            resolution: DataTypes.STRING(11),
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
        },
        {
            sequelize,
            modelName: 'File',
            tableName: 'files',
            timestamps: false,
            underscored: true,
        }
    );

    return File;
};
