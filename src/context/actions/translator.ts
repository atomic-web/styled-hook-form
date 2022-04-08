import literals from "../../literals.json";

export const translate = (str: string, values?: object & Record<any, any>) => {
  let nativeStr = (literals as any)[str];
  if (!nativeStr) {
    return str;
  }

  if (!values){
     return nativeStr;
  }

  let exp = /\{\{([^{}]+)\}\}/g;
  let interpolated = nativeStr.replace(exp, (_: any, item: string) =>
    values[item].toString()
  );
 
  return interpolated;
};