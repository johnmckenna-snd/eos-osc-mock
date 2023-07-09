import {
  expect,
  jest,
  test,
  beforeEach,
  beforeAll,
} from '@jest/globals';

import { blankChannel } from './channel.js';
import {
  parseOutArg, parseChannelNumber, toggleRemdim, levelPlus, levelMinus, channelMessageRegEx,
} from './channelMessageRegex.js';

const mockState = new Map();

function resetState () {
  mockState.clear();
  mockState.set(1, { ...blankChannel });
}

beforeAll(() => {
  resetState();
});

beforeEach(() => {
  resetState();
});

test('parseOutArg() should return the eos style arg as a number', () => {
  const testAddress = '/eos/chan/1=75';

  const arg = parseOutArg(testAddress);

  expect(arg).toBe(75);
  expect(typeof arg).toBe('number');
});

test('parseOutArg() should return a arg as a string', () => {
  const testAddress = '/eos/chan/1=asdf';

  const arg = parseOutArg(testAddress);

  expect(arg).toBe('asdf');
  expect(typeof arg).toBe('string');
});

test('parseOutArg() should return an empty string', () => {
  const testAddress = '/eos/chan/1';

  const arg = parseOutArg(testAddress);

  expect(arg).toBe('');
});

test('parseChannelNumber() should return the channel number', () => {
  const testAddress1 = '/eos/chan/13/home';
  const testAddress2 = '/eos/chan/3';

  expect(parseChannelNumber(testAddress1)).toBe(13);
  expect(parseChannelNumber(testAddress2)).toBe(3);
});

test('parseChannelNumber() should return null', () => {
  const testAddress1 = '/eos/chan';
  const testAddress2 = '/eos/chan1';

  expect(parseChannelNumber(testAddress1)).toBe(null);
  expect(parseChannelNumber(testAddress2)).toBe(null);
});

test('toggleRemdim() should return the opposite of the state bool', () => {
  const testChannel = mockState.get(1);

  const toggledRemdim = toggleRemdim(mockState, '/eos/chan/1/remdim');

  expect(toggledRemdim).toBe(!testChannel.remdim);
});

test('toggleRemdim() should return true', () => {
  const toggledRemdim = toggleRemdim(mockState, '/eos/chan/3/remdim');

  expect(toggledRemdim).toBeTruthy();
});

test('levelPlus() should increment the level by 1', () => {
  mockState.set(1, { ...blankChannel, level: 10 });
  const levelPLusOne = levelPlus(mockState, '/eos/chan/1/+%');

  expect(levelPLusOne).toBe(11);
});

test('levelPlus() should increment to 1', () => {
  const levelPLusOne = levelPlus(mockState, '/eos/chan/1/+%');

  expect(levelPLusOne).toBe(1);
});

test('levelPlus() should not increment past 100', () => {
  mockState.set(1, { ...blankChannel, level: 100 });
  const levelPLusOne = levelPlus(mockState, '/eos/chan/1/+%');

  expect(levelPLusOne).toBe(100);
});

test('levelMinus() should decrement the level by 1', () => {
  mockState.set(1, { ...blankChannel, level: 15 });
  const levelMinusOne = levelMinus(mockState, '/eos/chan/1/-%');

  expect(levelMinusOne).toBe(14);
});

test('levelMinus() should not decrement the level past 0', () => {
  const levelMinusOne = levelMinus(mockState, '/eos/chan/1/-%');

  expect(levelMinusOne).toBe(0);
});

test('setSelectedChannel regEx should match', () => {
  const { regEx } = channelMessageRegEx(mockState).setSelectedChannel;

  const testAddress = '/eos/chan=19';

  expect(testAddress.match(regEx)).toBeTruthy();
});

test('setSelectedChannel regEx should not match', () => {
  const { regEx } = channelMessageRegEx(mockState).setSelectedChannel;

  const testAddress = '/eos/chan/1599/out';

  expect(testAddress.match(regEx)).toBeFalsy();
});

test('setSelectedChannel buildUpdateObject should match', () => {
  const { buildUpdateObject } = channelMessageRegEx(mockState).setSelectedChannel;

  const testAddress = '/eos/chan=19';

  const expectedUpdateObject = {
    channel: 19,
  };

  expect(buildUpdateObject(testAddress)).toEqual(expectedUpdateObject);
});

test('setChannelLevel regEx should match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelLevel;

  const testAddress = '/eos/chan/14=19';

  expect(testAddress.match(regEx)).toBeTruthy();
});

test('setChannelLevel regEx should not match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelLevel;

  const testAddress = '/eos/chan/1599/out';

  expect(testAddress.match(regEx)).toBeFalsy();
});

test('setChannelLevel buildUpdateObject should match', () => {
  const { buildUpdateObject } = channelMessageRegEx(mockState).setChannelLevel;

  const testAddress = '/eos/chan/14=19';

  const expectedUpdateObject = {
    channel: 14,
    level: 19,
  };

  expect(buildUpdateObject(testAddress)).toEqual(expectedUpdateObject);
});

test('setChannelOut regEx should match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelOut;

  const testAddress = '/eos/chan/14/out';

  expect(testAddress.match(regEx)).toBeTruthy();
});

test('setChannelOut regEx should not match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelOut;

  const testAddress = '/eos/chan/1599/remdim';

  expect(testAddress.match(regEx)).toBeFalsy();
});

test('setChannelOut buildUpdateObject should match', () => {
  const { buildUpdateObject } = channelMessageRegEx(mockState).setChannelOut;

  const testAddress = '/eos/chan/14/out';

  const expectedUpdateObject = {
    channel: 14,
    level: 0,
  };

  expect(buildUpdateObject(testAddress)).toEqual(expectedUpdateObject);
});

test('setChannelHome regEx should match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelHome;

  const testAddress = '/eos/chan/14/home';

  expect(testAddress.match(regEx)).toBeTruthy();
});

test('setChannelHome regEx should not match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelHome;

  const testAddress = '/eos/chan/1599/out';

  expect(testAddress.match(regEx)).toBeFalsy();
});

test('setChannelHome buildUpdateObject should match', () => {
  const { buildUpdateObject } = channelMessageRegEx(mockState).setChannelHome;

  const testAddress = '/eos/chan/14/home';

  const expectedUpdateObject = {
    channel: 14,
    level: 0,
  };

  expect(buildUpdateObject(testAddress)).toEqual(expectedUpdateObject);
});

test('setChannelRemDim regEx should match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelRemDim;

  const testAddress = '/eos/chan/14/remdim';

  expect(testAddress.match(regEx)).toBeTruthy();
});

test('setChannelRemDim regEx should not match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelRemDim;

  const testAddress = '/eos/chan/1599/out';

  expect(testAddress.match(regEx)).toBeFalsy();
});

test('setChannelRemDim buildUpdateObject should match', () => {
  const { buildUpdateObject } = channelMessageRegEx(mockState).setChannelRemDim;

  const testAddress = '/eos/chan/14/remdim';

  const expectedUpdateObject = {
    channel: 14,
    level: 0,
    remdim: true,
  };

  expect(buildUpdateObject(testAddress)).toEqual(expectedUpdateObject);
});

test('setChannelLevelPreset regEx should match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelLevelPreset;

  const testAddress = '/eos/chan/14/level';

  expect(testAddress.match(regEx)).toBeTruthy();
});

test('setChannelLevelPreset regEx should not match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelLevelPreset;

  const testAddress = '/eos/chan/1599/out';

  expect(testAddress.match(regEx)).toBeFalsy();
});

test('setChannelLevelPreset buildUpdateObject should match', () => {
  const { buildUpdateObject } = channelMessageRegEx(mockState).setChannelLevelPreset;

  const testAddress = '/eos/chan/14/level';

  const expectedUpdateObject = {
    channel: 14,
    level: 100,
  };

  expect(buildUpdateObject(testAddress)).toEqual(expectedUpdateObject);
});

test('setChannelFull regEx should match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelFull;

  const testAddress = '/eos/chan/14/full';

  expect(testAddress.match(regEx)).toBeTruthy();
});

test('setChannelFull regEx should not match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelFull;

  const testAddress = '/eos/chan/1599/out';

  expect(testAddress.match(regEx)).toBeFalsy();
});

test('setChannelFull buildUpdateObject should match', () => {
  const { buildUpdateObject } = channelMessageRegEx(mockState).setChannelFull;

  const testAddress = '/eos/chan/14/full';

  const expectedUpdateObject = {
    channel: 14,
    level: 100,
  };

  expect(buildUpdateObject(testAddress)).toEqual(expectedUpdateObject);
});

test('setChannelMin regEx should match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelMin;

  const testAddress = '/eos/chan/14/min';

  expect(testAddress.match(regEx)).toBeTruthy();
});

test('setChannelMin regEx should not match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelMin;

  const testAddress = '/eos/chan/1599/out';

  expect(testAddress.match(regEx)).toBeFalsy();
});

test('setChannelMin buildUpdateObject should match', () => {
  const { buildUpdateObject } = channelMessageRegEx(mockState).setChannelMin;

  const testAddress = '/eos/chan/14/min';

  const expectedUpdateObject = {
    channel: 14,
    level: 1,
  };

  expect(buildUpdateObject(testAddress)).toEqual(expectedUpdateObject);
});

test('setChannelMax regEx should match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelMax;

  const testAddress = '/eos/chan/14/max';

  expect(testAddress.match(regEx)).toBeTruthy();
});

test('setChannelMax regEx should not match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelMax;

  const testAddress = '/eos/chan/1599/out';

  expect(testAddress.match(regEx)).toBeFalsy();
});

test('setChannelMax buildUpdateObject should match', () => {
  const { buildUpdateObject } = channelMessageRegEx(mockState).setChannelMax;

  const testAddress = '/eos/chan/14/max';

  const expectedUpdateObject = {
    channel: 14,
    level: 99,
  };

  expect(buildUpdateObject(testAddress)).toEqual(expectedUpdateObject);
});

test('setChannelLevelPlus regEx should match', () => {
  mockState.set(1, { ...blankChannel, level: 10 });

  const { regEx } = channelMessageRegEx(mockState).setChannelLevelPlus;

  const testAddress = '/eos/chan/14/+%';

  expect(testAddress.match(regEx)).toBeTruthy();
});

test('setChannelLevelPlus regEx should not match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelLevelPlus;

  const testAddress = '/eos/chan/1599/out';

  expect(testAddress.match(regEx)).toBeFalsy();
});

test('setChannelLevelPlus buildUpdateObject should match', () => {
  mockState.set(1, { ...blankChannel, level: 10 });

  const { buildUpdateObject } = channelMessageRegEx(mockState).setChannelLevelPlus;

  const testAddress = '/eos/chan/1/+%';

  const expectedUpdateObject = {
    channel: 1,
    level: 11,
  };

  expect(buildUpdateObject(testAddress)).toEqual(expectedUpdateObject);
});

test('setChannelLevelMinus regEx should match', () => {
  mockState.set(1, { ...blankChannel, level: 10 });

  const { regEx } = channelMessageRegEx(mockState).setChannelLevelMinus;

  const testAddress = '/eos/chan/1/-%';

  expect(testAddress.match(regEx)).toBeTruthy();
});

test('setChannelLevelMinus regEx should not match', () => {
  const { regEx } = channelMessageRegEx(mockState).setChannelLevelMinus;

  const testAddress = '/eos/chan/1599/out';

  expect(testAddress.match(regEx)).toBeFalsy();
});

test('setChannelLevelMinus buildUpdateObject should match', () => {
  mockState.set(1, { ...blankChannel, level: 10 });

  const { buildUpdateObject } = channelMessageRegEx(mockState).setChannelLevelMinus;

  const testAddress = '/eos/chan/1/-%';

  const expectedUpdateObject = {
    channel: 1,
    level: 9,
  };

  expect(buildUpdateObject(testAddress)).toEqual(expectedUpdateObject);
});
