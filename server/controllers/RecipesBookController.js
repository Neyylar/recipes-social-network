const recipesBook = require('../lib/RecipesBook');
const recipe = require("../lib/Recipe");

module.exports = {
    async recipesBooks(req, res) {
        const data = await recipesBook.RecipesBook.list();
        if (data && data.recipes && data.recipes.length > 0) {
            data.recipes = await recipe.Recipe.fullFetchList(data.recipes);
        }
        res.json(data);
    },
    async recipesBook(req, res) {
        const data = await recipesBook.RecipesBook.getById(req.params.id);
        if (data && data.recipes && data.recipes.length > 0) {
            data.recipes = await recipe.Recipe.fullFetchList(data.recipes);
        }
        res.json(data);
    },
    async createRecipesBook(req, res) {
        const newRecipe = await recipesBook.RecipesBook.create(req.body);
        res.json(newRecipe);
    },
    async updateRecipesBook(req, res) {
        const input = {...req.body, id: req.params.id};
        const updatedRecipe = await recipesBook.RecipesBook.update(input);
        res.json(updatedRecipe);
    },
    async deleteRecipesBook(req, res) {
        const response = await recipesBook.RecipesBook.delete(req.params.id);
        res.json(response);
    },
}