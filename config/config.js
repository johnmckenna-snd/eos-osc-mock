import 'dotenv/config';
import { configureLogger } from '@sndwrks/lumberjack';

const {
  NODE_ENV, LOCAL_PORT, REMOTE_PORT, SERVICE_NAME,
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
    REMOTE_PORT: REMOTE_PORT || 53001,
  },
};

configureLogger(config.logger);

export default config;
