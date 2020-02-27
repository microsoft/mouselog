export function humpToLine(name) {
    return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}