#! /usr/local/bin/node
const file = require('./File'),
    user = require('./User'),
    recipe = require('./Recipe'),
    recipeBook = require('./RecipeBook');

const syncAll = async () => {
    await file.sync();
    await user.sync();
    await recipe.sync();
    await recipeBook.sync();
};

syncAll()
    .then(() => console.log('All table sync'))
    .catch(error => console.error(error))
    .finally(() => process.exit(0))
