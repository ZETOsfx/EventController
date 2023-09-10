'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Compose extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Compose.hasMany(models.Program, {
                sourceKey: 'id',
                foreignKey: 'composeId',
                as: 'programs',
            });

            Compose.hasOne(models.Request, {
                sourceKey: 'id',
                foreignKey: 'composeId',
                as: 'request',
            });

            Compose.belongsTo(models.User, {
                foreignKey: 'authorName',
                targetKey: 'name',
                as: 'author',
            });
        }
    }

    Compose.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
        name: DataTypes.STRING(30),
        comment: DataTypes.TEXT,
        date: DataTypes.STRING(10),
        isSpecial: {
            type: DataTypes.BOOLEAN,
            field: 'is_special',
        },
        authorName: {
            field: 'author',
            type: DataTypes.STRING(16),
            references: {
                model: 'User',
                key: 'name',
            },
        },
        screen: DataTypes.INTEGER,
        lesson: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
        breaktime: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
        lunch: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        message: DataTypes.TEXT,

    }, {
        sequelize,
        modelName: 'Compose',
        tableName: 'composes',
        timestamps: false,
        underscored: true,
    });

    return Compose;
};