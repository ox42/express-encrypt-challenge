var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class RetrievalLog extends Sequelize.Model {

        static associate(models) {
            models.RetrievalLog.belongsTo(models.DataItem, { foreignKey: {allowNull: false} });
        }
    }

    RetrievalLog.init({

        info: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true
        },

        occurredOn: {
            type: DataTypes.DATE,
            allowNull: false
        }

    }, {
        indexes: [
            {
                name: 'data_item_id_index',
                using: 'BTREE',
                fields: ['DataItemId']
            }
        ], sequelize});

    return RetrievalLog;
};
