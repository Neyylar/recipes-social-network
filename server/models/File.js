const Sequelize = require('sequelize'),
    sequelize = require('../database');

class FileStatus extends Sequelize.Model {}
FileStatus.init({
    name: {
        type: Sequelize.STRING(100),
        allowNull: false
    }
}, {
    sequelize
});
exports.FileStatus = FileStatus;

class File extends Sequelize.Model {
}
File.init({
    name: {
        type: Sequelize.STRING(250),
        allowNull: true,
        defaultValue: null,
    },
    url: {
        type: Sequelize.STRING(1024),
        allowNull: false
    },
    size: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, {
    sequelize,
    timestamps: true,
    defaultScope: {
        include: [
            {
                model: FileStatus,
                as: 'status',
                required: true
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
File.belongsTo(FileStatus, {
    as: 'status',
    foreignKey: 'statusId'
});
exports.File = File;

exports.sync = async (options = {force: false, alter: true}) => {
    console.log('file SYNC');
    await FileStatus.sync(options);
    await File.sync(options);
};