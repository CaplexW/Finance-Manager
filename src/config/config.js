"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

var isProd = (process.env.NODE_ENV === 'production');
var externalUrl = '192.144.14.101';
var localUrl = 'localhost';
var URL = getUrl();
var PORT = getPort();
var MONGO_SERVER = getMongoServer();
var config = {
    API_ENDPOINT: getApiEndpoint(),
    PORT: PORT,
    MONGO_SERVER: MONGO_SERVER,
    URL: URL,
};
function getApiEndpoint() {
    return "http://".concat(URL, ":").concat(PORT, "/api/");
}
function getPort() {
    return isProd ? 80 : 80;
}
function getMongoServer() {
    return "mongodb://".concat(URL, ":27017/FinanceManager");
}
function getUrl() {
    return isProd ? externalUrl : localUrl;
}
exports.default = config;
