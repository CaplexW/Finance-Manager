const isProd = (process.env.NODE_ENV === 'production');
const externalUrl: string = 'localhost';
const localUrl: string = 'localhost';

const URL: string = getUrl();
const PORT: number = getPort();
const MONGO_SERVER: string = getMongoServer();
const PROTOCOL: string = getProtocol();
const API_ENDPOINT: string = getApiEndpoint();
const ACCESS_KEY: string = "It's@$ecrETK€";
const REFRESH_KEY: string = "It's@Refr€SHkEY";

const config: connectionConfig = {
  API_ENDPOINT,
  PORT,
  MONGO_SERVER,
  URL,
  IN_PRODUCTION: isProd,
  ACCESS_KEY,
  REFRESH_KEY,
};

function getApiEndpoint(): string {
  return `${PROTOCOL}://${URL}:${PORT}/api/`;
}
function getPort(): number {
  return isProd ? 80 : 80;
}
function getMongoServer(): string {
  return `mongodb://${URL}:27017/FinanceManager`;
}
function getUrl(): string {
  return isProd ? externalUrl : localUrl;
}
function getProtocol(): string {
  return 'http';
}

type connectionConfig = {
  API_ENDPOINT: string; // TODO сделать типизацию через regex
  PORT: number;
  MONGO_SERVER: string;
  URL: string;
  IN_PRODUCTION: boolean;
  ACCESS_KEY: string,
  REFRESH_KEY: string,
};

export default config;

// regex для API_ENDPOINT:
// ^http:\/\/((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(
//   25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(
//   25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(
//   25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?))|(localhost):[1-9][0-9]{0,4}/api/$