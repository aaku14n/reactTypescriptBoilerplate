const { join } = require("path")
const defaults = require("lodash.defaultsdeep");
const webpack = require("webpack")
const pkg = require(join(process.cwd(), "package.json"))
const { dllPlugin } = require("../config")
const { DEVELOPMENT } = require("../constants/index")
if (!pkg.dllPlugin) {
    process.exit(0);
}
const dllConfig = defaults(pkg.dllPlugin, dllPlugin.defaults);
const outputPath = join(process.cwd(), dllConfig.path);
module.exports = require("./webpack.base")({
    mode: DEVELOPMENT,
    context: process.cwd(),
    entry: dllConfig.dlls ? dllConfig.dlls : dllConfig.entry(pkg),
    optimization: {
        minimize: false,
    },
    devtool: "eval",
    output: {
        filename: '[name].dll.js',
        path: outputPath,
        library: '[name]',
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',
            path: join(outputPath, '[name].json'),
        }),
    ],
    performance: {
        hints: false
    }
})