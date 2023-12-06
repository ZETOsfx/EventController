'use strict';

const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User_Note extends Model {
        static associate(models) {
            // define association here
        }
    }

    User_Note.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
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
        },
        {
            sequelize,
            modelName: 'User_Note',
            tableName: 'user_note',
            timestamps: false,
            underscored: true,
        }
    );
    return User_Note;
};
