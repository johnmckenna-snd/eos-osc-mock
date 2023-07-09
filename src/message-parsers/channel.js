import { beginLogging } from '@sndwrks/lumberjack';

import { channelMessageRegEx } from './channelMessageRegex.js';

const logger = beginLogging({ name: 'channel.js' });

/**
 * This is the global channel state. Eventually, it might be nice if
 * you could specify starting channels and have them programmatically
 * populated. It may also eventually need to move to a more global
 * store like a database or persist when the server shuts down.
 */
export const channelState = new Map();

let currentlySelected = null;

export const blankChannel = {
  level: 0,
  remdim: false,
  channel: null,
};

/**
 * This function takes in an updateObject to update the state. If there's
 * a channel key specified it updates `currentlySelected`.
 *
 * Then the state is updated for the currentlySelected channel.
 *
 * @param {Object} updateObject the generated state update object
 *
 * @returns {Object} OSC message Object
 */
export function updateChannelState (updateObject) {
  if (Object.hasOwn(updateObject, 'channel')) {
    const { channel } = updateObject;
    currentlySelected = channel;
  }

  // get the state object or add a new blank channel
  //
  // make a copy of the state or the blankChannel by spreading
  // this makes makes sure that state isn't mutated in place
  // and it makes sure that the blankChannel is a new object in memory
  // each time it is added to the state
  //
  const singleChannelState = { ...(channelState.get(currentlySelected) || blankChannel) };

  // spread the state then overwrite it by spreading the update
  channelState.set(currentlySelected, { ...singleChannelState, ...updateObject });

  logger.info({ channelState });

  return { address: `/eos/out/active/chan="${currentlySelected}"` };
}

/**
 * This function parses all osc messages related to channels.
 * @param {Object} args
 * @param {string} args.address
 * @returns {Object} OSC Message Object
 */
export function channelParser ({ address }) {
  const foundMessageRegEx = Object.values(channelMessageRegEx(channelState))
    .filter(({ regEx }) => address.match(regEx))[0];

  if (foundMessageRegEx) {
    const updateObject = foundMessageRegEx.buildUpdateObject(address);

    return updateChannelState(updateObject);
  }

  return { address: '/invalid', args: [`You have sent an invalid or not implemented osc address: ${address}`] };
}
