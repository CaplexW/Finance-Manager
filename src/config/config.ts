const isProd:boolean = (process.env.NODE_ENV === 'production');
const externalUrl:string = '192.144.14.101';
const localUrl:string = 'localhost';

const URL:string = getUrl();
const PORT:number = getPort();
const MONGO_SERVER:string = getMongoServer();

const config:connectionConfig = {
  API_ENDPOINT: getApiEndpoint(),
  PORT,
  MONGO_SERVER,
  URL,
};

function getApiEndpoint() {
  return `http://${URL}:${PORT}/api/`;
}
function getPort() {
  return isProd ? 80 : 80;
}
function getMongoServer() {
  return `mongodb://${URL}:27017/FinanceManager`;
}
function getUrl() {
  return isProd ? externalUrl : localUrl;
}

type connectionConfig = {
  API_ENDPOINT: string;
  PORT: number;
  MONGO_SERVER: string;
  URL: string;
};

export default config;