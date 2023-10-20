const roundToDecimals = (val, numberOfDecimals = 2) => {
  const factor = Math.pow(10, numberOfDecimals);
  return Math.floor(val * factor) / factor;
};

export const NumberUtils = {
  roundToDecimals,
};
