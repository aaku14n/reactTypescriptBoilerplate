const path = require("path");
const webpack = require("webpack");

process.noDeprecation = true;
module.exports = options => ({
  mode: options.mode,
  entry: options.entry,
  output: Object.assign({
    // compile into js/build.js
    path: path.resolve(process.cwd(), "build"),
    publicPath: '/',
  },
    options.output),
  optimization: options.optimization,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: ["react-hot-loader/babel", "transform-runtime"]
            }
          },
          "ts-loader"
        ].filter(Boolean),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          require.resolve("style-loader"),
          {
            loader: require.resolve("css-loader"),
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: "[name]__[local]___[hash:base64:5]"
            }
          },
          {
            loader: require.resolve("postcss-loader"),
            options: {
              ident: "postcss",
              plugins: () => [
                require("postcss-flexbugs-fixes"),
                autoprefixer({
                  browsers: [
                    ">1%",
                    "last 4 versions",
                    "Firefox ESR",
                    "not ie < 9" // React doesn't support IE8 anyway
                  ],
                  flexbox: "no-2009"
                })
              ]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    modules: ['node_modules', 'src']
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
  plugins: options.plugins.concat([
    new webpack.NamedModulesPlugin(),
    new webpack.ProvidePlugin({
      React: "react",
      "react-dom": "ReactDOM",
      // make fetch available
      fetch: 'exports-loader?self.fetch!whatwg-fetch',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ]),
})