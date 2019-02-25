/**
 * Returns on array of key values out of an input array and a key.
 * Null values are removed.
 * @export
 * @template T
 * @template K
 * @param {T[]} array user defined array
 * @param {K} key
 * @returns {Array<T[K]>}
 */
export function pluck(array, key) {
    return array.map((el) => {
        if (el[key] !== null)
            return el[key];
    });
}
/**
 * Returns on array of unique key values out of an input array and a key.
 * @export
 * @template T
 * @template K
 * @param {T[]} array
 * @param {K} key
 * @returns {Array<T[K]>}
 */
export function pluckUnique(array, key) {
    return [...new Set(pluck(array, key))];
}
//# sourceMappingURL=pluck.js.map