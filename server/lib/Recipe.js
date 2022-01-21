const modelFile = require('../models/File'),
    model = require('../models/Recipe');
const {FileStatus} = require("../models/File");
const faker = require("@faker-js/faker");

class Recipe {

    static fullFetch = async (data) => data ? ({
            ...data,
            files: await this.getFiles(data.id),
            hashtags: await this.getHashtags(data.id),
            utensils: await this.getUtensils(data.id),
            categories: await this.getCategories(data.id),
            products: await this.getProducts(data.id),
        }) : null;

    static fullFetchList = async (data) => {
        for (let x in data) data[x] = await this.fullFetch(data[x]);
        return data;
    };

    static getById = async (id) => {
        try {
            let data = await model.Recipe.findOne({
                where: {id},
            });
            if (data) data = data.get({plain: true});
            return await this.fullFetch(data);
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
            return await this.fullFetchList(data);
        } catch (error) {
            console.error(`IDFMPKX7 - ${error}`);
        }
    };

    static create = async (input) => {
        try {
            if (input.id) {
                const prev = await this.getById(input.id);
                if (prev) throw new Error(`La receta ${input.id} ya existe, use otro ID`);
            }
            const newRecipe = await model.Recipe.create(input);
            if (input.files && input.files.length > 0) await this.setFiles(newRecipe.id, input.files);
            if (input.categories && input.categories.length > 0) await this.setCategories(newRecipe.id, input.categories);
            //TODO setFiles
            //TODO setHashtags
            //TODO setCategories
            //TODO setUtensils
            //TODO setProducts
            return newRecipe;
        } catch (error) {
            console.error(`0MHRXHMP - ${error}`);
        }
    };

    static update = async (input) => {
        try {
            if (!input.id) throw new Error(`No se encontró el ID de receta`);
            if (!input.status) input.status = 'active';
            const prev = await this.getById(input.id);
            if (!prev) throw new Error(`La receta ${input.id} no existe`);
            await model.Recipe.update(input, {where: {id: input.id}});
            const data = await this.getById(input.id);
            //TODO setHashtags
            //TODO setCategories
            //TODO setUtensils
            //TODO setProducts
            return data;
        } catch (error) {
            console.error(`EYY2UT22 - ${error}`);
        }
    };

    static delete = async (id) => {
        try {
            const prev = await this.getById(id);
            if (!prev) return false;
            await model.Recipe.destroy({where: {id}});
            return true;
        } catch (error) {
            console.error(`45M8UD5R - ${error}`);
        }
    };

    static setFiles = async (recipeId, files) => {
        try {
            const prev = (await this.getFiles(recipeId)).map(item => item.name);
            const toAdd = files.filter(item => !prev.includes(item)),
                toRemove = prev.filter(item => !files.includes(item));
            if (toAdd.length === 0 && toRemove.length === 0) return false;
            for (let x in toAdd) await this.addFile(recipeId, toAdd[x]);
            for (let x in toRemove) await this.removeFile(recipeId, toRemove[x]);
            return true;
        } catch (error) {
            console.error(`PCR20C3C - ${error}`);
        }
    }

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

    static addFile = async (recipeId, file) => {
        try {
            if (!recipeId || !file) return false;
            const okStatus = await modelFile.FileStatus.findOne({where: {name: 'Ok'}});
            const newFile = await modelFile.File.create({
                name: file,
                url: file,
                size: 100,
                statusId: okStatus.id,
            });
            await model.RecipeFile.create({
                recipeId, fileId: newFile.id
            });
            return true;
        } catch (error) {
            console.error(`TXYP4URG - ${error}`);
        }
    };

    static removeFile = async (recipeId, file) => {
        try {
            if (!recipeId || !file) return false;
            // await model.RecipeFile.destroy({
            //     where: {recipeId, file}
            // });
            return true;
        } catch (error) {
            console.error(`8DCUXMC3 - ${error}`);
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

    static setFiles = async (recipeId, files) => {
        try {
            const prev = (await this.getFiles(recipeId)).map(item => item.name);
            const toAdd = files.filter(item => !prev.includes(item)),
                toRemove = prev.filter(item => !files.includes(item));
            if (toAdd.length === 0 && toRemove.length === 0) return false;
            for (let x in toAdd) await this.addFile(recipeId, toAdd[x]);
            for (let x in toRemove) await this.removeFile(recipeId, toRemove[x]);
            return true;
        } catch (error) {
            console.error(`PCR20C3C - ${error}`);
        }
    }

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

class Hashtag {

    static getById = async (id) => {
        try {
            let data = await model.Hashtag.findOne({
                where: {id},
            });
            if (data) data = data.get({plain: true});
            return data;
        } catch (error) {
            console.error(`W4D4T4D8 - ${error}`);
        }
    };

    static count = async (filter = {}) => {
        try {
            return await model.Hashtag.count({});
        } catch (error) {
            console.error(`PU38U55Y - ${error}`);
        }
    };

    static list = async (filter = {}, options = {}) => {
        try {
            let data = await model.Recipe.findAll({});
            data = data.map(x => x.get({plain: true}));
            return data ? data : [];
        } catch (error) {
            console.error(`ID1MPKX7 - ${error}`);
        }
    };
}

class Utensil {

    static getById = async (id) => {
        try {
            let data = await model.Utensil.findOne({
                where: {id},
            });
            if (data) data = data.get({plain: true});
            return data;
        } catch (error) {
            console.error(`WYD4T3D8 - ${error}`);
        }
    };

    static count = async (filter = {}) => {
        try {
            return await model.Utensil.count({});
        } catch (error) {
            console.error(`PU58455Y - ${error}`);
        }
    };

    static list = async (filter = {}, options = {}) => {
        try {
            let data = await model.Utensil.findAll({});
            data = data.map(x => x.get({plain: true}));
            return data ? data : [];
        } catch (error) {
            console.error(`IDFMPK77 - ${error}`);
        }
    };
}

class Category {

    static getById = async (id) => {
        try {
            let data = await model.Category.findOne({
                where: {id},
            });
            if (data) data = data.get({plain: true});
            return data;
        } catch (error) {
            console.error(`QYD4T4D8 - ${error}`);
        }
    };

    static count = async (filter = {}) => {
        try {
            return await model.Category.count({});
        } catch (error) {
            console.error(`AU58U55Y - ${error}`);
        }
    };

    static list = async (filter = {}, options = {}) => {
        try {
            let data = await model.Category.findAll({});
            data = data.map(x => x.get({plain: true}));
            return data ? data : [];
        } catch (error) {
            console.error(`ZDFMPKX7 - ${error}`);
        }
    };
}

class Measure {

    static getById = async (id) => {
        try {
            let data = await model.Measure.findOne({
                where: {id},
            });
            if (data) data = data.get({plain: true});
            return data;
        } catch (error) {
            console.error(`WWD4T4D8 - ${error}`);
        }
    };

    static count = async (filter = {}) => {
        try {
            return await model.Measure.count({});
        } catch (error) {
            console.error(`PD58U55Y - ${error}`);
        }
    };

    static list = async (filter = {}, options = {}) => {
        try {
            let data = await model.Measure.findAll({});
            data = data.map(x => x.get({plain: true}));
            return data ? data : [];
        } catch (error) {
            console.error(`IVFMPKX7 - ${error}`);
        }
    };
}

class Product {

    static getById = async (id) => {
        try {
            let data = await model.Product.findOne({
                where: {id},
            });
            if (data) data = data.get({plain: true});
            return data;
        } catch (error) {
            console.error(`WYD6T4D8 - ${error}`);
        }
    };

    static count = async (filter = {}) => {
        try {
            return await model.Product.count({});
        } catch (error) {
            console.error(`PU78U55Y - ${error}`);
        }
    };

    static list = async (filter = {}, options = {}) => {
        try {
            let data = await model.Product.findAll({});
            data = data.map(x => x.get({plain: true}));
            return data ? data : [];
        } catch (error) {
            console.error(`IDF8PKX7 - ${error}`);
        }
    };
}

module.exports = {
    Recipe,
    Hashtag,
    Utensil,
    Category,
    Measure,
    Product
}