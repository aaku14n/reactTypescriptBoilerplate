const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
function createWebpackMiddleware(compiler, publicPath) {
    return webpackDevMiddleware(compiler, {
        logLevel: 'warn',
        publicPath,
        silent: true,
        stats: 'errors-only'
    });
}
module.exports = function addDevMiddlewares(app, webpackConfig) {
    const compiler = webpack(webpackConfig);
  console.log(webpackConfig.output)
    const middleware = createWebpackMiddleware(
        compiler,
        webpackConfig.output.publicPath,
    );
    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));

    const fs = middleware.fileSystem;
    app.get("*", (requestAnimationFrame, res) => {
        console.log(compiler.outputPath)
        fs.readFile(path.join(compiler.outputPath, "index.html"), (err, file) => {
            console.log(err)
            if (err) { res.sendStatus(404); }
            else {
                res.send(file.toSting())
            }
        })
    })
}