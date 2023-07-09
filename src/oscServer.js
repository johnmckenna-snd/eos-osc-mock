import osc from 'osc';
import { networkInterfaces } from 'node:os';
import { beginLogging } from '@sndwrks/lumberjack';

import config from '../config/config.js';
import { messageParser } from './message-parsers/index.js';

const {
  LOCAL_PORT, LOCAL_ADDRESS, REMOTE_PORT, REMOTE_ADDRESS,
} = config.server;

const logger = beginLogging({ name: 'oscServer.js' });

const currentNetworkInterfaces = networkInterfaces();

const ipv4Addresses = Object.values(currentNetworkInterfaces)
  .flat()
  .filter((netInterface) => netInterface.family === 'IPv4')
  .map((netInterface) => netInterface.address);

const oscServer = new osc.UDPPort({
  localAddress: LOCAL_ADDRESS,
  localPort: LOCAL_PORT,
  remoteAddress: REMOTE_ADDRESS,
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
