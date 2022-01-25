export const isEmptyObject = (obj: any) : boolean => {
  if (!obj) return true;

  if (!["object"].includes(typeof obj)) return false;

  return (
    Object.keys(obj).length === 0 ||
    !Object.values(obj).some((p) => !(p === undefined || isEmptyObject(p)))
  );
};

export const filterProps = (
  obj: Record<string, any>,
  predicate: (prop: string) => boolean
) => {
  Object.keys(obj)
    .filter(predicate)
    .reduce((p: Record<string, any>, c: string) => ({ ...p, [c]: obj[c] }), {});
};
