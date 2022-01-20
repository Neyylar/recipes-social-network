const Sequelize = require('sequelize'),
    sequelize = require('../database'),
    file = require('./File');

class Hashtag extends Sequelize.Model {}
Hashtag.init({
    name: {
        type: Sequelize.STRING(50),
        allowNull: false
    }
}, {
    sequelize
});
exports.Hashtag = Hashtag;


class Utensil extends Sequelize.Model {}
Utensil.init({
    name: {
        type: Sequelize.STRING(50),
        allowNull: false
    }
}, {
    sequelize
});
exports.Utensil = Utensil;


class Category extends Sequelize.Model {}
Category.init({
    name: {
        type: Sequelize.STRING(50),
        allowNull: false
    }
}, {
    sequelize
});
exports.Category = Category;


class Measure extends Sequelize.Model {}
Measure.init({
    name: {
        type: Sequelize.STRING(50),
        allowNull: false
    }
}, {
    sequelize
});
exports.Measure = Measure;


class Product extends Sequelize.Model {}
Product.init({
    name: {
        type: Sequelize.STRING(50),
        allowNull: false
    }
}, {
    sequelize,
    timestamps: true,
    defaultScope: {
        include: [
            {
                model: Measure,
                as: 'defaultMeasure',
                required: false
            }
        ]
    },
    scopes: {
        initialRecipe: {},
        minimal: {
            include: []
        }
    }
});
Product.belongsTo(Measure, {
    as: 'defaultMeasure',
    foreignKey: 'defaultMeasureId'
});
exports.Product = Product;


class Recipe extends Sequelize.Model {
}
Recipe.init({
    name: {
        type: Sequelize.STRING(80),
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: ''
    },
    steps: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    preparationTime: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: '00:00'
    },
    portions: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'active',
        validate: {
            customValidator: (value) => {
                const enums = ['active', 'inactive']
                if (!enums.includes(value)) {
                    throw new Error('not a valid option')
                }
            }
        }
    },
}, {
    sequelize,
    timestamps: true,
    defaultScope: {
        include: []
    },
    scopes: {
        initialRecipe: {},
        minimal: {
            include: []
        }
    }
});
exports.Recipe = Recipe;

class RecipeFile extends Sequelize.Model {
}
RecipeFile.init({}, {
    sequelize,
    timestamps: true,
    defaultScope: {
        include: [{
            model: file.File,
            as: 'file',
            required: true
        }]
    }
});
RecipeFile.belongsTo(Recipe, {
    as: 'recipe',
    foreignKey: 'recipeId'
});
RecipeFile.belongsTo(file.File, {
    as: 'file',
    foreignKey: 'fileId'
});
exports.RecipeFile = RecipeFile;


class RecipeHashtag extends Sequelize.Model {
}
RecipeHashtag.init({}, {
    sequelize,
    timestamps: true,
    defaultScope: {
        include: [{
            model: Hashtag,
            as: 'hashtag',
            required: true
        }]
    }
});
RecipeHashtag.belongsTo(Recipe, {
    as: 'recipe',
    foreignKey: 'recipeId'
});
RecipeHashtag.belongsTo(Hashtag, {
    as: 'hashtag',
    foreignKey: 'hashtagId'
});
exports.RecipeHashtag = RecipeHashtag;


class RecipeUtensil extends Sequelize.Model {
}
RecipeUtensil.init({}, {
    sequelize,
    timestamps: true,
    defaultScope: {
        include: [{
            model: Utensil,
            as: 'utensil',
            required: true
        }]
    }
});
RecipeUtensil.belongsTo(Recipe, {
    as: 'recipe',
    foreignKey: 'recipeId'
});
RecipeUtensil.belongsTo(Utensil, {
    as: 'utensil',
    foreignKey: 'utensilId'
});
exports.RecipeUtensil = RecipeUtensil;


class RecipeCategory extends Sequelize.Model {
}
RecipeCategory.init({}, {
    sequelize,
    timestamps: true,
    defaultScope: {
        include: [{
            model: Category,
            as: 'category',
            required: true
        }]
    }
});
RecipeCategory.belongsTo(Recipe, {
    as: 'recipe',
    foreignKey: 'recipeId'
});
RecipeCategory.belongsTo(Category, {
    as: 'category',
    foreignKey: 'categoryId'
});
exports.RecipeCategory = RecipeCategory;

class RecipeProduct extends Sequelize.Model {
}
RecipeProduct.init({
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
}, {
    sequelize,
    timestamps: true,
    defaultScope: {
        include: [
            {
                model: Product,
                as: 'product',
                required: true
            },
            {
                model: Measure,
                as: 'measure',
                required: true
            },
        ]
    }
});
RecipeProduct.belongsTo(Recipe, {
    as: 'recipe',
    foreignKey: 'recipeId'
});
RecipeProduct.belongsTo(Product, {
    as: 'product',
    foreignKey: 'productId'
});
RecipeProduct.belongsTo(Measure, {
    as: 'measure',
    foreignKey: 'measureId'
});
exports.RecipeProduct = RecipeProduct;

exports.sync = async (options = {force: false, alter: true}) => {
    console.log('recipe SYNC');
    await Hashtag.sync(options);
    await Utensil.sync(options);
    await Category.sync(options);
    await Measure.sync(options);
    await Product.sync(options);
    await Recipe.sync(options);
    await RecipeFile.sync(options);
    await RecipeHashtag.sync(options);
    await RecipeUtensil.sync(options);
    await RecipeCategory.sync(options);
    await RecipeProduct.sync(options);
};