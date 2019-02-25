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
export function pluck<T, K extends keyof T> (array: T[], key: K): Array<T[K]> {
    return array.map((el) => {
        if (el[key] !== null) return el[key];
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
export function pluckUnique<T, K extends keyof T> (array: T[], key: K): Array<T[K]> {
    return [...new Set(pluck(array, key))];
}
