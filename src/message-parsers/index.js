import { channelParser } from './channel.js';

function messageParser ({ address, args }) {
  if (address.includes('/eos/ping')) {
    return { address: `/eos/out/ping=${address.includes('=') ? address.split('=')[1] : ''}` };
  }

  if (address.includes('/eos/chan')) {
    return channelParser({ address, args });
  }
  return { address: '/invalid', args: ['You have sent an invalid or not implemented osc address'] };
}

// eslint-disable-next-line import/prefer-default-export
export { messageParser };
