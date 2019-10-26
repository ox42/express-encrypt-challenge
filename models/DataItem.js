var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class DataItem extends Sequelize.Model {
        static associate(models) {
            models.DataItem.hasMany(models.RetrievalLog, { foreignKey: {allowNull: false} });
        }
    }

    DataItem.init({
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
            validate: {notEmpty: { msg: 'Specify a valid id for the data item.'} }
        },

        value: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
            validate: {notEmpty: { msg: 'Specify valid JSON data as a value.'} }
        }

    }, {
        indexes: [
            {
                unique: true,
                name: 'key_index',
                using: 'BTREE',
                fields: ['key']
            }
        ], sequelize});

    return DataItem;
};
