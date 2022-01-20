const { Recipe } = require('../models/Recipe');

module.exports = {

    async all(req, res) {
        let recipes = await Recipe.findAll({
            // attributes: ['street'],
            // include: {
            //     association: 'residente',
            //     attributes: ['name']
            // }
        });

        res.json(recipes);
    }

}