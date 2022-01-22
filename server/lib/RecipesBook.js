const model = require('../models/RecipeBook');

class RecipesBook {
    static fullFetch = async (data) => data ? ({
        ...data,
        recipes: await this.getRecipes(data.id),
    }) : null;

    static fullFetchList = async (data) => {
        for (let x in data) data[x] = await this.fullFetch(data[x]);
        return data;
    };

    static getById = async (id) => {
        try {
            let data = await model.RecipeBook.findOne({
                where: {id},
            });
            if (data) data = data.get({plain: true});
            return await this.fullFetch(data);
        } catch (error) {
            console.error(`WYD4T4D1 - ${error}`);
        }
    };

    static count = async (filter = {}) => {
        try {
            return await model.RecipeBook.count({});
        } catch (error) {
            console.error(`PU58U552 - ${error}`);
        }
    };

    static list = async (filter = {}, options = {}) => {
        try {
            let data = await model.RecipeBook.findAll({});
            data = data.map(x => x.get({plain: true}));
            return await this.fullFetchList(data);
        } catch (error) {
            console.error(`IDFMPKX3 - ${error}`);
        }
    };

    static create = async (input) => {
        try {
            if (input.id) {
                const prev = await this.getById(input.id);
                if (prev) throw new Error(`Recipes book ${input.id} already exists, use another ID`);
            }
            const newRecipesBook = await model.RecipeBook.create(input);
            if (input.recipes && input.recipes.length > 0) await this.setRecipes(newRecipesBook.id, input.recipes);
            return newRecipesBook;
        } catch (error) {
            console.error(`0MHRXHM4 - ${error}`);
        }
    };

    static update = async (input) => {
        try {
            if (!input.id) throw new Error(`ID recipesBook not found.`);
            const prev = await this.getById(input.id);
            if (!prev) throw new Error(`La receta ${input.id} no existe`);
            await model.RecipeBook.update(input, {where: {id: input.id}});
            const data = await this.getById(input.id);
            if (input.recipes && input.recipes.length > 0) await this.setRecipes(data.id, input.recipes);
            return data;
        } catch (error) {
            console.error(`EYY2UT25 - ${error}`);
        }
    };

    static delete = async (id) => {
        try {
            const prev = await this.getById(id);
            if (!prev) return false;
            await model.RecipeBook.destroy({where: {id}});
            return true;
        } catch (error) {
            console.error(`45M8UD56 - ${error}`);
        }
    };

    /* RECIPES */
    static getRecipes = async (recipeBookId) => {
        try {
            let data = await model.RecipeBookRecipe.findAll({
                where: {recipeBookId},
            });
            data = data.map(row => row.get({plain: true}).recipe);
            return data;
        } catch (error) {
            console.error(`TXUCD5D7 - ${error}`);
        }
    };

    static setRecipes = async (recipeBookId, recipes) => {
        try {
            const prev = (await this.getRecipes(recipeBookId)).map(item => item.id);
            const toAdd = recipes.filter(item => !prev.includes(item)),
                toRemove = prev.filter(item => !recipes.includes(item));
            if (toAdd.length === 0 && toRemove.length === 0) return false;
            for (let x in toAdd) await this.addRecipe(recipeBookId, toAdd[x]);
            for (let x in toRemove) await this.removeRecipe(recipeBookId, toRemove[x]);
            return true;
        } catch (error) {
            console.error(`PCR20C38 - ${error}`);
        }
    }

    static addRecipe = async (recipeBookId, recipeId) => {
        try {
            if (!recipeBookId || !recipeId) return false;
            await model.RecipeBookRecipe.create({
                recipeBookId, recipeId
            });
            return true;
        } catch (error) {
            console.error(`TXYP4UR9 - ${error}`);
        }
    };

    static removeRecipe = async (recipeBookId, recipeId) => {
        try {
            if (!recipeBookId || !recipeId) return false;
            await model.RecipeBookRecipe.destroy({
                where: {recipeBookId, recipeId}
            });
            return true;
        } catch (error) {
            console.error(`8DCUXM10 - ${error}`);
        }
    };
}

module.exports = {
    RecipesBook
}