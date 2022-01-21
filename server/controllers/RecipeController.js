const recipe = require('../lib/Recipe');

module.exports = {
    async all(req, res) {
        const recipes = recipe.Recipe.list();
        res.json(recipes);
    }

}