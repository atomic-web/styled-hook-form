
export const isEmptyObject = (obj : any)=>{
    if (!obj)
    return true;

    return Object.keys(obj).length === 0 ||
           !Object.values(obj).some(p=>p!==undefined);
}