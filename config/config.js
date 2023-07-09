import 'dotenv/config';
import { configureLogger, beginLogging } from '@sndwrks/lumberjack';

const {
  NODE_ENV, LOCAL_PORT, LOCAL_ADDRESS, REMOTE_PORT, REMOTE_ADDRESS, SERVICE_NAME,
} = process.env;

const config = {
  global: {
    NODE_ENV,
  },
  logger: {
    logToConsole: NODE_ENV !== 'production',
    logToFiles: false,
    logLevel: NODE_ENV === 'production' ? 'http' : 'silly',
    service: SERVICE_NAME || 'eos-osc-mock',
    lokiConfig: {
      sendLogs: false,
      apiKey: null,
      host: null,
      username: null,
      logCacheLimit: 10,
    },
  },
  server: {
    LOCAL_PORT: LOCAL_PORT || 57121,
    LOCAL_ADDRESS: LOCAL_ADDRESS || '0.0.0.0',
    REMOTE_PORT: REMOTE_PORT || 53001,
    REMOTE_ADDRESS: REMOTE_ADDRESS || '0.0.0.0',
  },
};

configureLogger(config.logger);

const logger = beginLogging({ name: 'config.js' });

logger.info({ config });

export default config;
