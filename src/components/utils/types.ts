
export function isPrimitive(value : any) {
    return value!== Object(value);
}

export const makeArray = (value:any)=> Array.isArray(value) ? value : [value];