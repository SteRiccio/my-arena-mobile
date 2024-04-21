const labelFunction = (cycleKey) => String(Number(cycleKey) + 1);
const getPrevCycleKey = (cycleKey) => {
  const cycleNum = Number(cycleKey);
  return cycleNum > 0 ? String(cycleNum - 1) : cycleKey;
};

export const Cycles = {
  labelFunction,
  getPrevCycleKey,
};
