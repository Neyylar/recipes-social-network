const express = require('express');
const app = express();
const sequelize = require('./database/db');
const Recipe = require('./database/models/Recipe');

// Setting
const PORT = process.env.PORT || 3000;

// routes
app.get('/', function (req, res) {

    // User.create({
    //     name: "Pepe",
    //     birthday: new Date(1999, 4, 6)
    // }).then(user => {
    //     res.json(user);
    // });

    Recipe.findAll().then(recipes => {
        res.json(recipes);
    });

});

app.listen(PORT, function () {
    console.log(`Server running on http://localhost:${PORT}`);

    // Connect to database
    // Force true: DROP TABLES
    sequelize.sync({ force: false }).then(() => {
        console.log("DB connected...");
    }).catch(error => {
        console.log('Error on DB connection!', error);
    })
});