'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User_Note extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    User_Note.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'user_id',
            references: {
                model: 'User',
                key: 'id',
            },
        },
        noteId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'note_id',
            references: {
                model: 'Note',
                key: 'id',
            },
        },

    }, {
        sequelize,
        modelName: 'User_Note',
        tableName: 'user_note',
        timestamps: false,
        underscored: true,
    });
    return User_Note;
};