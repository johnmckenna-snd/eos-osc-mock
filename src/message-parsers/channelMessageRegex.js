export function parseOutArg (address) {
  const value = address.split('=')[1];

  const parsedInt = parseInt(value, 10);

  if (typeof parsedInt === 'number' && !Number.isNaN(parsedInt)) {
    return parsedInt;
  }

  return value || '';
}

export function parseChannelNumber (address) {
  const numberSuffix = address.split('chan/')[1];
  if (numberSuffix) {
    const number = numberSuffix.includes('/') ? numberSuffix.split('/')[0] : numberSuffix.split('=')[0];
    return parseInt(number, 10);
  }

  return null;
}

export function toggleRemdim (channelState, address) {
  const channelNumber = parseChannelNumber(address);

  const currentChannel = channelState.get(channelNumber);

  if (currentChannel) {
    const { remdim } = currentChannel;

    return !remdim;
  }

  // if there's no current channel remdim defaults as
  // false, so we'll return true
  return true;
}

export function levelPlus (channelState, address) {
  const channelNumber = parseChannelNumber(address);

  const currentChannel = channelState.get(channelNumber);

  if (currentChannel) {
    const { level } = currentChannel;
    return level < 100 ? level + 1 : 100;
  }

  return 1;
}

export function levelMinus (channelState, address) {
  const channelNumber = parseChannelNumber(address);

  const currentChannel = channelState.get(channelNumber);

  if (currentChannel) {
    const { level } = currentChannel;
    return level > 0 ? level - 1 : 0;
  }

  return 0;
}

export function channelMessageRegEx (channelState) {
  return {
    // set channel intensity levels pg. 574
    setSelectedChannel: {
      // /eos/chan=19
      regEx: /^\/eos\/chan=[0-9]+$/g,
      buildUpdateObject: (address) => ({
        channel: parseOutArg(address),
      }),
    },
    setChannelLevel: {
      // /eos/chan/14=67
      regEx: /^\/eos\/chan\/[0-9]+=([0-9]|[1-9][0-9]|100)$/g,
      buildUpdateObject: (address) => ({
        channel: parseChannelNumber(address),
        level: parseOutArg(address),
      }),
    },
    setChannelOut: {
      // /eos/chan/1599/out
      regEx: /^\/eos\/chan\/[0-9]+\/out$/g,
      buildUpdateObject: (address) => ({
        channel: parseChannelNumber(address),
        level: 0,
      }),
    },
    setChannelHome: {
      // /eos/chan/51/home
      regEx: /^\/eos\/chan\/[0-9]+\/home$/g,
      buildUpdateObject: (address) => ({
        channel: parseChannelNumber(address),
        level: 0,
      }),
    },
    setChannelRemDim: {
      // /eos/chan/15124/remdim
      regEx: /^\/eos\/chan\/[0-9]+\/remdim$/g,
      buildUpdateObject: (address) => ({
        channel: parseChannelNumber(address),
        level: 0,
        remdim: toggleRemdim(channelState, address),
      }),
    },
    setChannelLevelPreset: {
      // /eos/chan/594/level
      regEx: /^\/eos\/chan\/[0-9]+\/level$/g,
      buildUpdateObject: (address) => ({
        channel: parseChannelNumber(address),
        // i believe this is the eos default
        // could maybe move to an env?
        level: 100,
      }),
    },
    setChannelFull: {
      // /eos/chan/42/full
      regEx: /^\/eos\/chan\/[0-9]+\/full$/g,
      buildUpdateObject: (address) => ({
        channel: parseChannelNumber(address),
        level: 100,
      }),
    },
    setChannelMin: {
      // /eos/chan/42/min
      regEx: /^\/eos\/chan\/[0-9]+\/min$/g,
      buildUpdateObject: (address) => ({
        channel: parseChannelNumber(address),
        level: 1,
      }),
    },
    setChannelMax: {
      // /eos/chan/42/max
      regEx: /^\/eos\/chan\/[0-9]+\/max$/g,
      buildUpdateObject: (address) => ({
        channel: parseChannelNumber(address),
        level: 99,
      }),
    },
    setChannelLevelPlus: {
      // /eos/chan/42/+%
      regEx: /^\/eos\/chan\/[0-9]+\/\+%$/g,
      buildUpdateObject: (address) => ({
        channel: parseChannelNumber(address),
        level: levelPlus(channelState, address),
      }),
    },
    setChannelLevelMinus: {
      // /eos/chan/42/+%
      regEx: /^\/eos\/chan\/[0-9]+\/-%$/g,
      buildUpdateObject: (address) => ({
        channel: parseChannelNumber(address),
        level: levelMinus(channelState, address),
      }),
    },
  };
}
