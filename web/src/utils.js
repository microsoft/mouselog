export function humpToLine(name) {
    return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}

export let isLocalStorageAvailable = (() => {
    let testString = "testStringForLocalStorage";
    try {
        localStorage.setItem(testString, testString);
        localStorage.removeItem(testString);
        return true;
    } catch(e) {
        return false;
    }
})();