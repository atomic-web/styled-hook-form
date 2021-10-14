export const isEmptyObject = (obj: any) : boolean => {
  if (!obj) return true;

  if (!["object"].includes(typeof obj)) return false;

  return (
    Object.keys(obj).length === 0 ||
    !Object.values(obj).some((p) => !(p === undefined || isEmptyObject(p)))
  );
};
