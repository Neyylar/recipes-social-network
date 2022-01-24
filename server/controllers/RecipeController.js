const recipe = require('../lib/Recipe');

module.exports = {
    async recipes(req, res) {
        const filter = req.query ? req.query : {};
        const recipes = await recipe.Recipe.list(filter);
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
        const filter = req.query ? req.query : {};
        const categories = await recipe.Category.list(filter);
        res.json(categories);
    },
    async createCategory(req, res) {
        const category = await recipe.Category.create(req.body);
        res.json(category);
    },
    async updateCategory(req, res) {
        const input = {...req.body, id: req.params.id};
        const updatedRecipe = await recipe.Category.update(input);
        res.json(updatedRecipe);
    },
    async deleteCategory(req, res) {
        const response = await recipe.Category.delete(req.params.id);
        res.json(response);
    },
    async hashtags(req, res) {
        const filter = req.query ? req.query : {};
        const hashtags = await recipe.Hashtag.list(filter);
        res.json(hashtags);
    },
    async createHashtag(req, res) {
        const newHashtag = await recipe.Hashtag.create(req.body);
        res.json(newHashtag);
    },
    async updateHashtag(req, res) {
        const input = {...req.body, id: req.params.id};
        const updatedRecipe = await recipe.Hashtag.update(input);
        res.json(updatedRecipe);
    },
    async deleteHashtag(req, res) {
        const response = await recipe.Hashtag.delete(req.params.id);
        res.json(response);
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