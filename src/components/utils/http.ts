export const isAxiosCancel = (value: any) => {
  return !!(value && value.__CANCEL__);
};
