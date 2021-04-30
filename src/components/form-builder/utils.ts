
export function msgTemplate(msg: string, name: string, values: any[] | any | null = null) {

    let v: any[] = !values ? [] : (Array.isArray(values) ? values : [values]);

    let obj = {
        name: name,
        ...v.reduce((p: any, c, i) => {p[`value${i ? i : ""}`] = c; return p;}, {})
    };

    let result = msg.replace(/(\{(name)\})|(\{(value[0-9]*)\})/g, (value) => {
        return obj[value.slice(1, -1)];
    });
    return result;
}