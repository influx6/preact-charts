export interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface NumberObject {
    [key: string]: number;
}

export type DataArray = NumberObject[];

export interface GroupedDataObject {
    [key: string]: Array<{name: number | string, value: number}>;
}
