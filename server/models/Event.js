'use strict';

const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Event.belongsTo(models.Program, {
                foreignKey: 'programId',
                targetKey: 'id',
                as: 'program',
            });
        }
    }

    Event.init({
        id: {
            type: DataTypes.UUID,
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

    }, {
        sequelize,
        modelName: 'Event',
        tableName: 'events',
        timestamps: false,
        underscored: true,
    });

    return Event;
};