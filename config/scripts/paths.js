const path = require("path");
const fs = require("fs");
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

// config after eject: we're in ./config/
module.exports = {
    dotenv: resolveApp(".env"),
    appBuild: resolveApp("build"),
    appPublic: resolveApp("public"),
    appHtml: resolveApp("public/index.html"),
    appSrc: resolveApp("src"),
    appNodeModules: resolveApp("node_modules"),
  };