import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import http from 'http';
import https from 'https';
import cors from 'cors';
import nocache from 'nocache';
import fs from 'fs';

import config from './config';
import JWTMiddleware from './helpers/middlewares/jwt';
import Router from './routes';

const app = express();
const server = config.HTTPS===true ? new https.Server({
    key: fs.readFileSync(config.HTTPSKEY),
    cert: fs.readFileSync(config.HTTPSCERT),
    ca: fs.readFileSync(config.HTTPSCA)
}, app) : http.Server(app);
const port = config.APP_PORT;


app.use(nocache());
app.use(compression());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({
    limit: 1024 * 1024 * 5,
    type: 'application/json'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: 1024 * 1024 * 5,
    type: 'application/x-www-form-urlencoding'
}));
app.use(cors());
const Routes = Router(express, JWTMiddleware);
app.use('/', Routes);

server.listen(config.APP_PORT, () => {
    console.log('Server started on port %d', port)
});

exports.server = server;