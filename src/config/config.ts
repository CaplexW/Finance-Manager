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

function getApiEndpoint():string {
  return `http://${URL}:${PORT}/api/`;
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

type connectionConfig = {
  API_ENDPOINT: string;
  PORT: number;
  MONGO_SERVER: string;
  URL: string;
};

export default config;

// regex:
// ^http:\/\/((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.( 
//   25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.( 
//   25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.( 
//   25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?))|(localhost):[1-9][0-9]{0,4}/api/$