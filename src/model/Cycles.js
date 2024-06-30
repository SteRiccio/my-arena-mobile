const getPrevCycleKey = (cycleKey) => {
  const cycleNum = Number(cycleKey);
  return cycleNum > 0 ? String(cycleNum - 1) : cycleKey;
};

const labelFunction = (cycleKey) => String(Number(cycleKey) + 1);

export const Cycles = {
  getPrevCycleKey,
  labelFunction,
};
