const isProd:boolean = (process.env.NODE_ENV === 'production');
const externalUrl:string = '192.168.1.101';
const localUrl:string = 'localhost';

const URL:string = getUrl();
const PORT:number = getPort();
const MONGO_SERVER:string = getMongoServer();
const PROTOCOL:string = getProtocol();

const config:connectionConfig = {
  API_ENDPOINT: getApiEndpoint(),
  PORT,
  MONGO_SERVER,
  URL,
  IN_PRODUCTION: isProd,
};

function getApiEndpoint():string {
  return `${PROTOCOL}://${URL}:${PORT}/api/`;
}
function getPort():number {
  return isProd ? 80 : 80;
}
function getMongoServer():string {
  return `mongodb://${URL}:27017/FinanceManager`;
}
function getUrl():string {
  return isProd ? externalUrl : localUrl;
}
function getProtocol():string {
  return 'http';
}

type connectionConfig = {
  API_ENDPOINT: string;
  PORT: number;
  MONGO_SERVER: string;
  URL: string;
  IN_PRODUCTION: boolean;
};

export default config;

// regex:
// ^http:\/\/((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.( 
//   25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.( 
//   25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.( 
//   25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?))|(localhost):[1-9][0-9]{0,4}/api/$