const model = require('../models/Recipe');

class Recipe {

    static fullFetch = async (data) => data ? ({
            ...data,
            files: await this.getFiles(data.id),
            hashtags: await this.getHashtags(data.id),
            utensils: await this.getUtensils(data.id),
            categories: await this.getCategories(data.id),
            products: await this.getProducts(data.id),
        }) : null;

    static getById = async (id) => {
        try {
            let data = await model.Recipe.findOne({
                where: {id},
            });
            if (data) data = data.get({plain: true});
            return data;
        } catch (error) {
            console.error(`WYD4T4D8 - ${error}`);
        }
    };

    static count = async (filter = {}) => {
        try {
            return await model.Recipe.count({});
        } catch (error) {
            console.error(`PU58U55Y - ${error}`);
        }
    };

    static list = async (filter = {}, options = {}) => {
        try {
            let data = await model.Recipe.findAll({});
            data = data.map(x => x.get({plain: true}));
            return await this.fullFetch(data);
        } catch (error) {
            console.error(`IDFMPKX7 - ${error}`);
        }
    };

    static getFiles = async (recipeId) => {
        try {
            let data = await model.RecipeFile.findAll({
                where: {recipeId},
            });
            data = data.map(row => row.get({plain: true}).file);
            return data;
        } catch (error) {
            console.error(`TXUCD5D0 - ${error}`);
        }
    };

    static getHashtags = async (recipeId) => {
        try {
            let data = await model.RecipeHashtag.findAll({
                where: {recipeId},
            });
            data = data.map(row => row.get({plain: true}).hashtag);
            return data;
        } catch (error) {
            console.error(`TXUCD510 - ${error}`);
        }
    };

    static getUtensils = async (recipeId) => {
        try {
            let data = await model.RecipeUtensil.findAll({
                where: {recipeId},
            });
            data = data.map(row => row.get({plain: true}).utensil);
            return data;
        } catch (error) {
            console.error(`TXUCD512 - ${error}`);
        }
    };

    static getCategories = async (recipeId) => {
        try {
            let data = await model.RecipeCategory.findAll({
                where: {recipeId},
            });
            data = data.map(row => row.get({plain: true}).category);
            return data;
        } catch (error) {
            console.error(`TXUCD513 - ${error}`);
        }
    };

    static getProducts = async (recipeId) => {
        try {
            let data = await model.RecipeProduct.findAll({
                where: {recipeId},
            });
            data = data.map(row => row.get({plain: true}));
            return data;
        } catch (error) {
            console.error(`TXUCD514 - ${error}`);
        }
    };
}

module.exports = {
    Recipe
}