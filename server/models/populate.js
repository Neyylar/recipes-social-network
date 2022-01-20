const {FileStatus, File} = require('./File'),
    {User} = require('./User'),
    {Hashtag, Category, Utensil, RecipeFile, Measure, Product, Recipe} = require('./Recipe'),
    recipeBook = require('./RecipeBook');

const populateAll = async () => {
};

populateAll()
    .then(() => console.log('All table populated'))
    .catch(error => console.error(error))
    .finally(() => process.exit(0))