const Sequelize = require('sequelize'),
    sequelize = require('../database'),
    user = require('./User'),
    recipe = require('./Recipe');

class RecipeBook extends Sequelize.Model {
}
RecipeBook.init({
    name: {
        type: Sequelize.STRING(40),
        allowNull: false
    },
}, {
    sequelize,
    timestamps: true,
    defaultScope: {
        include: [
            {
                model: user.User,
                as: 'owner',
                required: false
            },
        ]
    },
    scopes: {
        initialRecipe: {},
        minimal: {
            include: []
        }
    }
});
RecipeBook.belongsTo(user.User, {
    as: 'owner',
    foreignKey: {
        name: 'ownerId',
        allowNull: true
    }
});
exports.RecipeBook = RecipeBook;

class RecipeBookRecipe extends Sequelize.Model {
}
RecipeBookRecipe.init({}, {
    sequelize,
    timestamps: true,
    defaultScope: {
        include: [{
            model: recipe.Recipe,
            as: 'recipe',
            required: true
        }]
    }
});
RecipeBookRecipe.belongsTo(RecipeBook, {
    as: 'recipeBook',
    foreignKey: 'recipeBookId'
});
RecipeBookRecipe.belongsTo(recipe.Recipe, {
    as: 'recipe',
    foreignKey: 'recipeId'
});
exports.RecipeBookRecipe = RecipeBookRecipe;

exports.sync = async (options = {force: false, alter: true}) => {
    console.log('user SYNC');
    await RecipeBook.sync(options);
    await RecipeBookRecipe.sync(options);
};