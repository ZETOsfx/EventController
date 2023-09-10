'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Program extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Program.hasMany(models.Event, {
                sourceKey: 'id',
                foreignKey: 'programId',
                as: 'events',
            });

            Program.belongsTo(models.Compose, {
                foreignKey: 'composeId',
                targetKey: 'id',
                as: 'compose',
            });

            Program.belongsTo(models.User, {
                foreignKey: 'authorName',
                targetKey: 'name',
                as: 'author',
            });
        }
    }

    Program.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
        name: DataTypes.STRING(30),
        authorName: {
            field: 'author',
            type: DataTypes.STRING(16),
            references: {
                model: 'User',
                key: 'name',
            },
        },
        isPrivate: {
            type: DataTypes.BOOLEAN,
            field: 'is_private',
        },
        canView: {
            type: DataTypes.BOOLEAN,
            field: 'can_view',
        },
        lastEdit: {
            type: DataTypes.STRING(20),
            field: 'last_edit',
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
        time_to_swap: DataTypes.TIME,

    }, {
        sequelize,
        modelName: 'Program',
        tableName: 'programs',
        timestamps: false,
        underscored: true,
    });

    return Program;
};