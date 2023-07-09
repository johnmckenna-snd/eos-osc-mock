import osc from 'osc';
import { networkInterfaces } from 'node:os';
import { beginLogging } from '@sndwrks/lumberjack';

import config from '../config/config.js';
import { messageParser } from './message-parsers/index.js';

const { LOCAL_PORT, REMOTE_PORT } = config.server;

const logger = beginLogging({ name: 'oscServer.js' });

const currentNetworkInterfaces = networkInterfaces();

logger.debug(currentNetworkInterfaces);

const ipv4Addresses = Object.values(currentNetworkInterfaces)
  .flat()
  .filter((netInterface) => netInterface.family === 'IPv4')
  .map((netInterface) => netInterface.address);

const oscServer = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: LOCAL_PORT,
  remoteAddress: '0.0.0.0',
  remotePort: REMOTE_PORT,
});

oscServer.on('ready', () => {
  logger.info('Listening to OSC over UDP on %s, probably', ipv4Addresses);
});

oscServer.on('message', (message) => {
  logger.silly('message received %o', message);
  const response = messageParser(message);
  if (response) oscServer.send(response);
});

export default oscServer;
