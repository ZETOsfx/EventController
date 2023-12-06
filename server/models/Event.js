'use strict';

const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
        static associate({ Program }) {
            Event.belongsTo(Program, {
                foreignKey: 'programId',
                targetKey: 'id',
                as: 'program',
            });
        }
    }

    Event.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: DataTypes.STRING(50),
            src: DataTypes.TEXT,
            isActive: {
                field: 'is_active',
                type: 'boolean',
            },
            type: DataTypes.STRING(7),
            time: DataTypes.INTEGER,
            order: DataTypes.INTEGER,
            programId: {
                field: 'program_id',
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Program',
                    key: 'id',
                },
            },
        },
        {
            sequelize,
            modelName: 'Event',
            tableName: 'events',
            timestamps: false,
            underscored: true,
        }
    );

    return Event;
};
