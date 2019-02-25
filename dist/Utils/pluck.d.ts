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
export declare function pluck<T, K extends keyof T>(array: T[], key: K): Array<T[K]>;
/**
 * Returns on array of unique key values out of an input array and a key.
 * @export
 * @template T
 * @template K
 * @param {T[]} array
 * @param {K} key
 * @returns {Array<T[K]>}
 */
export declare function pluckUnique<T, K extends keyof T>(array: T[], key: K): Array<T[K]>;
