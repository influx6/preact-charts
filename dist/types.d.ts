export interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export interface NumberObject {
    [key: string]: number;
}
export declare type DataArray = NumberObject[];
export interface GroupedDataObject {
    [key: string]: Array<{
        name: number | string;
        value: number;
    }>;
}
export interface DataObject {
    [key: string]: number | string | Date;
}
export interface TimestampData extends DataObject {
    timestamp: Date;
}
export declare type TimestampArray = TimestampData[];
export interface EventsData {
    idx: number;
    event: number;
    start: string | Date;
    end: string | Date;
    type: string;
    sub_type: string | null;
    comment: string | null;
}
