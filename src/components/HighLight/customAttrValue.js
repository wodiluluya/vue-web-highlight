let customValue = {};

export const getCustomValue = (key) => {
  return key ? customValue[key] : customValue;
};
export const setCustomValue = (value) => {
  customValue = {
    ...customValue,
    ...value,
  };
};
