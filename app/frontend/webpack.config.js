const path = require('path');
const webpack = require('webpack');

let env = {}
Object.keys(process.env).forEach(key=>{
    env[key] = JSON.stringify(process.env[key])
})
console.log(env.BASE_URL)
module.exports = {
    mode: 'none',
    entry: {
        app: path.join(__dirname, 'src', 'index.js')
    },
    target: 'web',
    resolve: {
        extensions: ['.jsx', '.js']
    },
    module: {
        rules: [
            { // config for es6 jsx
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },

            { // config for images
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images',
                        }
                    }
                ],
            },
        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": env
        }),
    ],
}