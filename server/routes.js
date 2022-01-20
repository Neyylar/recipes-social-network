const express = require('express');
const router = express.Router();

// Importar controladores
const RecipeController = require('./controllers/RecipeController');

// Home
router.get('/', (req, res) => res.json({ foo: "bar" }));

// recipes
router.get('/recipes', RecipeController.all);

module.exports = router;