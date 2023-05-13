export function formatNumber(x) {
    return x.toLocaleString();
}

export function dateToString(input, withTime = true) {
    const date = new Date(input);
    return withTime ? date.toDateString() + " " + date.toLocaleTimeString() : date.toDateString();
}