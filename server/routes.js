const express = require('express');
const router = express.Router();

// Importar controladores
const RecipeController = require('./controllers/RecipeController');

// Home
router.get('/', (req, res) => res.json({ foo: "bar" }));

// recipes
router.get('/recipes', RecipeController.recipes);
router.get('/recipes/:id', RecipeController.recipe);
router.post('/recipes/:id', RecipeController.createRecipe);
router.patch('/recipes/:id', RecipeController.updateRecipe);
router.delete('/recipes/:id', RecipeController.deleteRecipe);
router.get('/categories', RecipeController.categories);
router.get('/hashtags', RecipeController.hashtags);
router.get('/utensils', RecipeController.utensils);
router.get('/measures', RecipeController.measures);
router.get('/products', RecipeController.products);

module.exports = router;