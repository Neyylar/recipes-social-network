const recipe = require('../lib/Recipe');

module.exports = {
    async recipes(req, res) {
        const recipes = await recipe.Recipe.list();
        res.json(recipes);
    },
    async recipe(req, res) {
        const recipeFetched = await recipe.Recipe.getById(req.params.id);
        res.json(recipeFetched);
    },
    async createRecipe(req, res) {
        const newRecipe = await recipe.Recipe.create(req.body);
        res.json(newRecipe);
    },
    async updateRecipe(req, res) {
        const input = {...req.body, id: req.params.id};
        const updatedRecipe = await recipe.Recipe.update(input);
        res.json(updatedRecipe);
    },
    async deleteRecipe(req, res) {
        const response = await recipe.Recipe.delete(req.params.id);
        res.json(response);
    },
    async categories(req, res) {
        const categories = await recipe.Category.list();
        res.json(categories);
    },
    async hashtags(req, res) {
        const hashtags = await recipe.Hashtag.list();
        res.json(hashtags);
    },
    async utensils(req, res) {
        const utensils = await recipe.Utensil.list();
        res.json(utensils);
    },
    async measures(req, res) {
        const measures = await recipe.Measure.list();
        res.json(measures);
    },
    async products(req, res) {
        const products = await recipe.Product.list();
        res.json(products);
    },
}