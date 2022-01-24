const {Op} = require("sequelize"),
    //Op = Sequelize.Op,
    modelFile = require('../models/File'),
    model = require('../models/Recipe');

class Recipe {

    static fullFetch = async (data, scope = 'simple') => data ? scope === 'simple' ? ({
            ...data,
            files: await this.getFiles(data.id),
        }) : ({
        ...data,
        files: await this.getFiles(data.id),
        hashtags: await this.getHashtags(data.id),
        utensils: await this.getUtensils(data.id),
        categories: await this.getCategories(data.id),
        products: await this.getProducts(data.id),
    }) : null;

    static fullFetchList = async (data, scope = 'simple') => {
        for (let x in data) data[x] = await this.fullFetch(data[x], scope);
        return data;
    };

    static getById = async (id) => {
        try {
            let data = await model.Recipe.findOne({
                where: {id},
            });
            if (data) data = data.get({plain: true});
            return await this.fullFetch(data, 'full');
        } catch (error) {
            console.error(`WYD4T4D8 - ${error}`);
        }
    };

    static processFilter(filter) {
        let where = {};
        for (let x in filter) switch (x) {
            case 'query':
                where = {
                    ...where,
                    [Op.and]: filter.query.trim().split(' ').map(query => ({
                        [Op.or]: [
                            {
                                name: {
                                    [Op.like]: `%${query}%`
                                }
                            }
                        ]
                    }))
                };
                break;
            case 'id':
                if (filter.id) if (filter.id.length) where.id = {[Op.in]: filter.id};
                break;
        }
        return where;
    }

    static count = async (filter = {}) => {
        try {
            return await model.Recipe.count({where: this.processFilter(filter)});
        } catch (error) {
            console.error(`PU58U55Y - ${error}`);
        }
    };

    static list = async (filter = {}, options = {}) => {
        try {
            let data = await model.Recipe.findAll({where: this.processFilter(filter)});
            data = data.map(x => x.get({plain: true}));
            // TODO optimize filter methods
            if (filter.categories && filter.categories.length > 0) {
                const where = {categoryId: {[Op.in]: Array.isArray(filter.categories) ? filter.categories : [filter.categories]}};
                let categoriesRecipes = await model.RecipeCategory.findAll({
                    where,
                });
                categoriesRecipes = categoriesRecipes.map(x => x.get({plain: true}).recipeId);
                data = data.filter(recipe => categoriesRecipes.includes(recipe.id));
            }
            if (filter.hashtags && filter.hashtags.length > 0) {
                const where = {hashtagId: {[Op.in]: Array.isArray(filter.hashtags) ? filter.hashtags : [filter.hashtags]}};
                let hashtagsRecipes = await model.RecipeHashtag.findAll({
                    where
                });
                hashtagsRecipes = hashtagsRecipes.map(x => x.get({plain: true}).recipeId);
                data = data.filter(recipe => hashtagsRecipes.includes(recipe.id));
            }
            return await this.fullFetchList(data);
        } catch (error) {
            console.error(`IDFMPKX7 - ${error}`);
        }
    };

    static create = async (input) => {
        try {
            if (input.id) {
                const prev = await this.getById(input.id);
                if (prev) throw new Error(`Recipe ${input.id} already exist, use another ID`);
            }
            const newRecipe = await model.Recipe.create(input);
            if (input.files && input.files.length > 0) await this.setFiles(newRecipe.id, input.files);
            if (input.categories && input.categories.length > 0) await this.setCategories(newRecipe.id, input.categories);
            if (input.hashtags && input.hashtags.length > 0) await this.setHashtags(newRecipe.id, input.hashtags);
            if (input.utensils && input.utensils.length > 0) await this.setUtensils(newRecipe.id, input.utensils);
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

    /* FILES */
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
            const prev = await modelFile.File.findOne({where: {name: file}});
            if (!prev) return false;
            await model.RecipeFile.destroy({
                where: {recipeId, fileId: prev.id}
            });
            return true;
        } catch (error) {
            console.error(`8DCUXMC3 - ${error}`);
        }
    };

    /* HASHTAGS */
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

    static setHashtags = async (recipeId, hashtagIds) => {
        try {
            const prev = (await this.getHashtags(recipeId)).map(item => item.id);
            const toAdd = hashtagIds.filter(item => !prev.includes(item)),
                toRemove = prev.filter(item => !hashtagIds.includes(item));
            if (toAdd.length === 0 && toRemove.length === 0) return false;
            for (let x in toAdd) await this.addHashtag(recipeId, toAdd[x]);
            for (let x in toRemove) await this.removeHashtag(recipeId, toRemove[x]);
            return true;
        } catch (error) {
            console.error(`PCR20C34 - ${error}`);
        }
    }

    static addHashtag = async (recipeId, hashtagId) => {
        try {
            if (!recipeId || !hashtagId) return false;
            await model.RecipeHashtag.create({
                recipeId, hashtagId
            });
            return true;
        } catch (error) {
            console.error(`TXYP4UR2 - ${error}`);
        }
    };

    static removeHashtag = async (recipeId, hashtagId) => {
        try {
            if (!recipeId || !hashtagId) return false;
            await model.RecipeHashtag.destroy({
                where: {recipeId, hashtagId}
            });
            return true;
        } catch (error) {
            console.error(`8DCUXMC5 - ${error}`);
        }
    };

    /* UTENSILS */
    static getUtensils = async (recipeId) => {
        try {
            let data = await model.RecipeUtensil.findAll({
                where: {recipeId},
            });
            data = data.map(row => row.get({plain: true}).utensil);
            return data;
        } catch (error) {
            console.error(`TXUCD532 - ${error}`);
        }
    };

    static setUtensils = async (recipeId, utensilIds) => {
        try {
            const prev = (await this.getUtensils(recipeId)).map(item => item.id);
            const toAdd = utensilIds.filter(item => !prev.includes(item)),
                toRemove = prev.filter(item => !utensilIds.includes(item));
            if (toAdd.length === 0 && toRemove.length === 0) return false;
            for (let x in toAdd) await this.addUtensil(recipeId, toAdd[x]);
            for (let x in toRemove) await this.removeUtensil(recipeId, toRemove[x]);
            return true;
        } catch (error) {
            console.error(`PCR21C34 - ${error}`);
        }
    }

    static addUtensil = async (recipeId, utensilId) => {
        try {
            if (!recipeId || !utensilId) return false;
            await model.RecipeUtensil.create({
                recipeId, utensilId
            });
            return true;
        } catch (error) {
            console.error(`1XYP4UR2 - ${error}`);
        }
    };

    static removeUtensil = async (recipeId, utensilId) => {
        try {
            if (!recipeId || !utensilId) return false;
            await model.RecipeUtensil.destroy({
                where: {recipeId, utensilId}
            });
            return true;
        } catch (error) {
            console.error(`8DCUX5C5 - ${error}`);
        }
    };

    /* CATEGORIES */
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

    static setCategories = async (recipeId, categoryIds) => {
        try {
            const prev = (await this.getCategories(recipeId)).map(item => item.id);
            const toAdd = categoryIds.filter(item => !prev.includes(item)),
                toRemove = prev.filter(item => !categoryIds.includes(item));
            if (toAdd.length === 0 && toRemove.length === 0) return false;
            for (let x in toAdd) await this.addCategory(recipeId, toAdd[x]);
            for (let x in toRemove) await this.removeCategory(recipeId, toRemove[x]);
            return true;
        } catch (error) {
            console.error(`PCR20C3C - ${error}`);
        }
    }

    static addCategory = async (recipeId, categoryId) => {
        try {
            if (!recipeId || !categoryId) return false;
            await model.RecipeCategory.create({
                recipeId, categoryId
            });
            return true;
        } catch (error) {
            console.error(`TXYP4URR - ${error}`);
        }
    };

    static removeCategory = async (recipeId, categoryId) => {
        try {
            if (!recipeId || !categoryId) return false;
            await model.RecipeCategory.destroy({
                where: {recipeId, categoryId}
            });
            return true;
        } catch (error) {
            console.error(`8DCUXMC3 - ${error}`);
        }
    };

    /* PRODUCTS */
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

    static processFilter(filter) {
        let where = {};
        for (let x in filter) switch (x) {
            case 'query':
                where = {
                    ...where,
                    [Op.and]: filter.query.trim().split(' ').map(query => ({
                        [Op.or]: [
                            {
                                name: {
                                    [Op.like]: `%${query}%`
                                }
                            }
                        ]
                    }))
                };
                break;
            case 'id':
                if (filter.id) if (filter.id.length) where.id = {[Op.in]: filter.id};
                break;
        }
        return where;
    }

    static count = async (filter = {}) => {
        try {
            return await model.Hashtag.count({where: this.processFilter(filter)});
        } catch (error) {
            console.error(`PU38U55Y - ${error}`);
        }
    };

    static list = async (filter = {}, options = {}) => {
        try {
            let data = await model.Hashtag.findAll({where: this.processFilter(filter)});
            data = data.map(x => x.get({plain: true}));
            return data ? data : [];
        } catch (error) {
            console.error(`ID1MPKX7 - ${error}`);
        }
    };

    static create = async (input) => {
        try {
            if (input.id) {
                const prev = await this.getById(input.id);
                if (prev) throw new Error(`Hashtag ${input.id} already exist, use another ID`);
            }
            return await model.Hashtag.create(input);
        } catch (error) {
            console.error(`0MH4XHMP - ${error}`);
        }
    };

    static update = async (input) => {
        try {
            if (!input.id) throw new Error(`No se encontró el ID de hashtag`);
            const prev = await this.getById(input.id);
            if (!prev) throw new Error(`La receta ${input.id} no existe`);
            await model.Hashtag.update(input, {where: {id: input.id}});
            const data = await this.getById(input.id);
            return data;
        } catch (error) {
            console.error(`E4Y2UT22 - ${error}`);
        }
    };

    static delete = async (id) => {
        try {
            const prev = await this.getById(id);
            if (!prev) return false;
            await model.Hashtag.destroy({where: {id}});
            return true;
        } catch (error) {
            console.error(`45M86D5R - ${error}`);
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

    static processFilter(filter) {
        let where = {};
        for (let x in filter) switch (x) {
            case 'query':
                where = {
                    ...where,
                    [Op.and]: filter.query.trim().split(' ').map(query => ({
                        [Op.or]: [
                            {
                                name: {
                                    [Op.like]: `%${query}%`
                                }
                            }
                        ]
                    }))
                };
                break;
            case 'id':
                if (filter.id) if (filter.id.length) where.id = {[Op.in]: filter.id};
                break;
        }
        return where;
    }

    static count = async (filter = {}) => {
        try {
            return await model.Utensil.count({where: this.processFilter(filter)});
        } catch (error) {
            console.error(`PU58455Y - ${error}`);
        }
    };

    static list = async (filter = {}, options = {}) => {
        try {
            let data = await model.Utensil.findAll({where: this.processFilter(filter)});
            data = data.map(x => x.get({plain: true}));
            return data ? data : [];
        } catch (error) {
            console.error(`IDFMPK77 - ${error}`);
        }
    };

    static create = async (input) => {
        try {
            if (input.id) {
                const prev = await this.getById(input.id);
                if (prev) throw new Error(`utensil ${input.id} already exist, use another ID`);
            }
            return await model.Utensil.create(input);
        } catch (error) {
            console.error(`0MH48HMP - ${error}`);
        }
    };

    static update = async (input) => {
        try {
            if (!input.id) throw new Error(`No se encontró el ID de utensil`);
            const prev = await this.getById(input.id);
            if (!prev) throw new Error(`utensil ${input.id} no existe`);
            await model.Utensil.update(input, {where: {id: input.id}});
            const data = await this.getById(input.id);
            return data;
        } catch (error) {
            console.error(`E4Y7UT22 - ${error}`);
        }
    };

    static delete = async (id) => {
        try {
            const prev = await this.getById(id);
            if (!prev) return false;
            await model.Utensil.destroy({where: {id}});
            return true;
        } catch (error) {
            console.error(`45M96D5R - ${error}`);
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

    static processFilter(filter) {
        let where = {};
        for (let x in filter) switch (x) {
            case 'query':
                where = {
                    ...where,
                    [Op.and]: filter.query.trim().split(' ').map(query => ({
                        [Op.or]: [
                            {
                                name: {
                                    [Op.like]: `%${query}%`
                                }
                            }
                        ]
                    }))
                };
                break;
            case 'id':
                if (filter.id) if (filter.id.length) where.id = {[Op.in]: filter.id};
                break;
        }
        return where;
    }

    static count = async (filter = {}) => {
        try {
            return await model.Category.count({where: this.processFilter(filter)});
        } catch (error) {
            console.error(`AU58U55Y - ${error}`);
        }
    };

    static list = async (filter = {}, options = {}) => {
        try {
            let data = await model.Category.findAll({where: this.processFilter(filter)});
            data = data.map(x => x.get({plain: true}));
            return data ? data : [];
        } catch (error) {
            console.error(`ZDFMPKX7 - ${error}`);
        }
    };

    static create = async (input) => {
        try {
            if (input.id) {
                const prev = await this.getById(input.id);
                if (prev) throw new Error(`category ${input.id} already exist, use another ID`);
            }
            return await model.Category.create(input);
        } catch (error) {
            console.error(`0MH45HMP - ${error}`);
        }
    };

    static update = async (input) => {
        try {
            if (!input.id) throw new Error(`No se encontró el ID de category`);
            const prev = await this.getById(input.id);
            if (!prev) throw new Error(`category ${input.id} doesnt exist`);
            await model.Category.update(input, {where: {id: input.id}});
            const data = await this.getById(input.id);
            return data;
        } catch (error) {
            console.error(`E4Y8UT22 - ${error}`);
        }
    };

    static delete = async (id) => {
        try {
            const prev = await this.getById(id);
            if (!prev) return false;
            await model.Category.destroy({where: {id}});
            return true;
        } catch (error) {
            console.error(`45M96D54 - ${error}`);
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