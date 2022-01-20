const Sequelize = require('sequelize'),
    sequelize = require('../database'),
    file = require('./File');

class User extends Sequelize.Model {
}
User.init({
    fullName: {
        type: Sequelize.STRING(40),
        allowNull: false
    },
    username: {
        type: Sequelize.STRING(40),
        allowNull: true
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'user',
        validate: {
            customValidator: (value) => {
                const enums = ['admin', 'user']
                if (!enums.includes(value)) {
                    throw new Error('not a valid option')
                }
            }
        }
    },
    email: {
        type: Sequelize.STRING(128),
        allowNull: true,
        defaultValue: null,
        //unique: true
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
}, {
    sequelize,
    timestamps: true,
    defaultScope: {
        include: [
            {
                model: file.File,
                as: 'picture',
                required: false
            },
        ]
    },
    scopes: {
        initialRecipe: {},
        minimal: {
            include: []
        }
    }
});
User.belongsTo(file.File, {
    as: 'picture',
    foreignKey: {
        name: 'pictureId',
        allowNull: true
    }
});
exports.User = User;

exports.sync = async (options = {force: false, alter: true}) => {
    console.log('user SYNC');
    await User.sync(options);
};