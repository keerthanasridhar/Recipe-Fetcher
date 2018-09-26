// const path = require('path');

// const HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports = {
//     //Export the configuration obejct
// entry: ['babel-polyfill','./src/js/index.js'], //. means current folder
// output: {
//     path: path.resolve(__dirname, 'dist'), //join the path from the abosulte directory(forkify) to the dis directory
//     filename: 'js/bundle.js'
//     },
// devServer: {
//     contentBase: './dist'
// },
// //Plugins takes all the array of plugin
// plugins: [
//  new HtmlWebpackPlugin({
//      filename: 'index.html',
//      template: './src/index.html'
//      })
// ],
// //Loaders
// module: {
//     rules: [
//         {
//             test: /\.js$/,
//             exclude: /node_modules/,
//             use: {
//                 loader: 'babel-loader'
//             }
//         }
//     ]
// }

// };

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};
