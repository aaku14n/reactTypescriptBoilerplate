const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const offlinePlugin = require("offline-plugin");
const { HashedModuleIdsPlugin } = require("webpack");
const { PRODUCTION } = require("../constants/index");
module.exports = require("./webpack.base")({
    mode: PRODUCTION,
    entry: [path.join(process.cwd(), "src/index.tsx")],
    output: {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].chunk.js',
    },
    optimization: {
        minimize: true,
        nodeEnv: PRODUCTION,
        sideEffects: true,
        concatenateModules: true,
        splitChunks: { chunks: "all" },
        runtimeChunk: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "public/index.html",
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            inject: true
        }),
        // implementing offline.js 
        new offlinePlugin({
            relativePaths: false,
            publicPath: "/",
            appShell: "/",
            caches: {
                main: [":rest:"],
                addition: ["*.chunk.js"],
            },
            safeToUseOptionalCaches: true,
        }),
        new WebpackPwaManifest({
            name: "React Boilerplate",
            short_name: "React",
            description: "Simple boilerplate for react in ts",
            background_color: "#0E0E70",

        }),
        new HashedModuleIdsPlugin({
            hashFunction: "sha256",
            hashDigest: "hex",
            hashDigestLength: 20,
        }),
    ],
    performance: {
        assetFilter: assetFilename =>
            !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
    }
})
