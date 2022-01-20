const { Recipe, RecipeFile} = require('../models/Recipe');

module.exports = {
    async all(req, res) {
        let recipes = await Recipe.findAll({});
        let files = await RecipeFile
        res.json(recipes);
    }

}