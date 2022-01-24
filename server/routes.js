const express = require('express');
const router = express.Router();

// Importar controladores
const RecipeController = require('./controllers/RecipeController');
const RecipesBookController = require('./controllers/RecipesBookController');

// Home
router.get('/', (req, res) => res.json({ foo: "bar" }));

// recipes
router.get('/recipes', RecipeController.recipes);
router.get('/recipes/:id', RecipeController.recipe);
router.post('/recipes', RecipeController.createRecipe);
router.patch('/recipes/:id', RecipeController.updateRecipe);
router.delete('/recipes/:id', RecipeController.deleteRecipe);

router.get('/categories', RecipeController.categories);
router.post('/categories', RecipeController.createCategory);
router.patch('/categories/:id', RecipeController.updateCategory);
router.delete('/categories/:id', RecipeController.deleteCategory);

router.get('/hashtags', RecipeController.hashtags);
router.post('/hashtags', RecipeController.createHashtag);
router.patch('/hashtags/:id', RecipeController.updateHashtag);
router.delete('/hashtags/:id', RecipeController.deleteHashtag);

router.get('/utensils', RecipeController.utensils);
router.post('/utensils', RecipeController.createUtensil);
router.patch('/utensils/:id', RecipeController.updateUtensil);
router.delete('/utensils/:id', RecipeController.deleteUtensil);

router.get('/measures', RecipeController.measures);
router.get('/products', RecipeController.products);

// recipesBook
router.get('/recipes-books', RecipesBookController.recipesBooks);
router.get('/recipes-books/:id', RecipesBookController.recipesBook);
router.post('/recipes-books', RecipesBookController.createRecipesBook);
router.patch('/recipes-books/:id', RecipesBookController.updateRecipesBook);
router.delete('/recipes-books/:id', RecipesBookController.deleteRecipesBook);

module.exports = router;