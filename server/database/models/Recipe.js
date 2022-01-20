const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Recipe extends Model {}
Recipe.init({
    name: DataTypes.STRING
}, {
    sequelize,
    modelName: "recipe"
});

module.exports = Recipe;