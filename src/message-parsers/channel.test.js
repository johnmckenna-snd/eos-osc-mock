import {
  expect,
  jest,
  test,
  beforeEach,
  beforeAll,
} from '@jest/globals';

import {
  blankChannel, updateChannelState, channelParser, channelState,
} from './channel.js';

function resetState () {
  channelState.clear();
}

beforeAll(() => {
  resetState();
});

beforeEach(() => {
  resetState();
});

test('blankChannel should match expected object', () => {
  const expectedBlankChannel = {
    level: 0,
    remdim: false,
    channel: null,
  };
  expect(blankChannel).toEqual(expectedBlankChannel);
});

test('expect updateChannelState to add a channel', () => {
  const updateObject = {
    channel: 10,
    remdim: false,
    level: 100,
  };

  updateChannelState(updateObject);

  const expectedChannelObject = {
    channel: 10,
    remdim: false,
    level: 100,
  };

  expect(channelState.get(10)).toEqual(expectedChannelObject);
});

test('expect updateChannelState to update a channel', () => {
  channelState.set(2, { ...blankChannel, remdim: true, level: 50 });

  const updateObject = {
    channel: 2,
    remdim: false,
    level: 100,
  };

  updateChannelState(updateObject);

  const expectedChannelObject = {
    channel: 2,
    remdim: false,
    level: 100,
  };

  expect(channelState.get(2)).toEqual(expectedChannelObject);
});

test('expect updateChannelState to return an osc message object', () => {
  channelState.set(8, { ...blankChannel, level: 50, channel: 8 });

  const updateObject = {
    channel: 8,
    remdim: true,
    level: 100,
  };

  const result = updateChannelState(updateObject);

  const expectedResult = {
    address: '/eos/out/active/chan="8"',
  };

  expect(result).toEqual(expectedResult);
});

test('expect updateChannelState to not change currently selected channel', () => {
  const insertObject = {
    channel: 8,
    remdim: true,
    level: 100,
  };

  updateChannelState(insertObject);

  const updateObject = {
    remdim: true,
    level: 100,
  };

  const result = updateChannelState(updateObject);

  const expectedResult = {
    address: '/eos/out/active/chan="8"',
  };

  expect(result).toEqual(expectedResult);
});

test('expect channelParser() to match and return a osc message object', () => {
  const testMessage = { address: '/eos/chan=1' };

  const result = channelParser(testMessage);

  const expectedResult = {
    address: '/eos/out/active/chan="1"',
  };

  expect(result).toEqual(expectedResult);
});

test('expect channelParser() to not match and return a osc message object', () => {
  const testMessage = { address: '/eos/channel=1' };

  const result = channelParser(testMessage);

  const expectedResult = {
    address: '/invalid',
    args: ['You have sent an invalid or not implemented osc address: /eos/channel=1'],
  };

  expect(result).toEqual(expectedResult);
});
