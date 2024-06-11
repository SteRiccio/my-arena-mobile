const findByUuid = (uuid) => (array) =>
  array.find((item) => item.uuid === uuid);

export const ArrayUtils = {
  findByUuid,
};
