export const getLocaleFractionSeparator = (locale: string) => {
  const fakeNum = 1.1;
  const output = fakeNum.toLocaleString(locale);
  return output.substring(1, 2);
};
