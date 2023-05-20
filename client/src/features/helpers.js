export function formatNumber(x) {
    return x.toLocaleString();
}

export function dateToString(input, withTime = true) {
    const date = new Date(input);
    return withTime ? date.toDateString() + " " + date.toLocaleTimeString() : date.toDateString();
}

export function normalizeString(condition) {
    return condition.split("::")
}

export function translateRow(item, key) {
    const normalized = normalizeString(key);
    if (normalized[1]) {
        switch (normalized[1]) {
            case 'datetime':
                return dateToString(item[normalized[0]]);
            case 'string':
                return item[normalized[0]].toString();
            default:
                return item[normalized[0]];
        }
    }
    return item[key];
}