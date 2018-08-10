const path = require("path");
const fs = require("fs");
const glob = require("glob");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const CircularDependencyPlugin = require("add-asset-html-webpack-plugin");

const logger = require("../../server/logger")

const pkg = require(path.resolve(process.cwd(),"package.json") );
const { dllPlugin } = pkg;
const { DEVELOPMENT } = require("../constants/index");

const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
        inject: true,
        template: "app/index.html"
    }),
    new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: false,
    })
];

if (dllPlugin) {
    glob.sync(`${dllPlugin.path}/*.dll.js`).forEach(dllPath => {
        plugins.push(new AddAssetHtmlPlugin({
            filepath: dllPath,
            includesSourcemap: false
        }));
    });
}

module.exports = require("./webpack.base")({
    mode: DEVELOPMENT,
    entry: [
        "eventsource-polyfill", // for HMR
        "webpack-hot-middleware/client?reload=true",
        path.join(process.cwd(), "src/App.tsx"),

    ],
    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
    },
    optimization: {
        minimize: false,
    },
    plugins: dependencyHandlers().concat(plugins),
    devtool: "eval-source-map",
    performance: {
        hints: false
    }
});


function dependencyHandlers() {
    if (process.env.BUILDING_DLL) {
        return [];
    }
    if (!dllPlugin) {
        return [];
    }
    const dllPath = path.resolve(
        process.cwd(),
        dllPlugin.path || "mode_modules/react-boilerplate-dlls",
    );
    if (!dllPlugin.dlls) {
        const manifestPath = path.resolve(dllPath, "reactBoilerplateDeps.json");
        if (!fs.existsSync(manifestPath)) {
            logger.error("The Dll manifest is missing. please run build:dll")
            process.exit(0);
        }
        return [new webpack.DllReferencePlugin({
            context: process.cwd(),
            manifest: require(manifestPath),
        })]
    }
    const dllManifests = Object.keys(dllPlugin.dlls).map(name => path.join(dllPath, `/${name}.json`));
    return dllManifests.map(manifestPath => {
        if (!fs.existsSync(path)) {
            if (!fs.existsSync(manifestPath)) {
                logger.error(`The following webpack DLL manifest is missing : ${path.basename(manifestPath)}`);
                logger.error(`Expected to find it in ${dllPath}`);
                logger.error('Please run mpm run build:dll');
                process.exit(0)
            }
        }
        return new webpack.DllReferencePlugin({
            context: process.cwd(),
            manifest: require(manifestPath)
        })
    })
}