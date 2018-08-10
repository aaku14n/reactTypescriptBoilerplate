// eslint consistent-return-0

const express = require('express');
const logger = require("./logger");
const port = require('./port');
const argv = require("./argv");
const setup = require('./middlewares/frontendMiddleware');
const { PRODUCTION } = require('../config/constants/index')
const isDev = process.env.NODE_ENV !== PRODUCTION;
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const { resolve } = require("path");
const app = express();

// for middleware

setup(app, {
    outputPath: resolve(process.cwd(), 'build'),
    publicPath: '/',
});

const customHost = argv.host || process.env.HOST;
const host = customHost || null;
const prettyHost = customHost || "localhost";
app.listen(port, host, async err => {
    if (err) return logger.error(err.message);
    if (ngrok) {
        let url;
        try {
            url = await ngrok.connect(port);
        } catch (e) {
            return logger.error(e);
        }
        logger.appStarted(port, prettyHost, url);
    } else {
        logger.appStarted(port, prettyHost)
    }
})