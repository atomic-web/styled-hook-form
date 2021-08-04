
export function isPrimitive(value : any) {
    return value!== Object(value);
}