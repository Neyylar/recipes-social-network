const faker = require('@faker-js/faker'),
    {FileStatus, File} = require('./File'),
    {User} = require('./User'),
    {Hashtag, Category, Utensil, RecipeFile, Measure, Product, Recipe} = require('./Recipe'),
    recipeBook = require('./RecipeBook');

const populateAll = async () => {
    await FileStatus.create({name: 'Ok'});
    await FileStatus.create({name: 'Processing'});
    await FileStatus.create({name: 'Error'});
    const okStatus = await FileStatus.findOne({where: {name: 'Ok'}});
    const files = new Array(10).fill({
        name: faker.image.food(),
        url: faker.image.food(),
        size: 100,
        statusId: okStatus.id,
    });
    await File.bulkCreate(files);


};

populateAll()
    .then(() => console.log('All table populated'))
    .catch(error => console.error(error))
    .finally(() => process.exit(0))