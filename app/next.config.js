const withPlugins = require('next-compose-plugins'),
    webpack = require('webpack'),
    //sass = require('@zeit/next-sass'),
    //css = require('@zeit/next-css'),
    // images = require('next-images'),
    withAssetsImport = require('next-assets-import');

module.exports = withPlugins([
    [{
        distDir: '_next',
        pageExtensions: ['jsx', 'js'],
        generateBuildId: async () => process.env.BUILD_ID ? process.env.BUILD_ID : `${new Date().getTime()}`,
        plugins: ["add-react-displayname"]
    }],
    //[css],
    //[sass],
    [withAssetsImport],
]);
