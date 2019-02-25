import { Component } from 'preact';
import { Margin } from '../../types';
export interface GroupedDataObject {
    [key: string]: Array<{
        name: number | string;
        value: number;
    }>;
}
interface HorizontalBarProps {
    name: string;
    data: GroupedDataObject;
    groups: string[];
    legendReference: {
        [key: string]: string;
    };
    height?: number;
    width?: number;
    margin?: Margin;
    ticks?: number;
}
interface HorizontalBarDefaultProps {
    height?: number;
    width?: number;
    margin?: Margin;
    ticks?: number;
}
interface HorizontalBarState {
    width: number;
    innerWidth: number;
    height: number;
    innerHeight: number;
}
export declare class HorizontalBar extends Component<HorizontalBarProps, HorizontalBarState> {
    static defaultProps: HorizontalBarDefaultProps;
    private chartSVG;
    private resizeOb;
    constructor(props: HorizontalBarProps);
    render({ margin, ticks, data, groups, name, legendReference }: HorizontalBarProps, { height, width, innerHeight, innerWidth }: HorizontalBarState): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private resizeChart;
    private createBars;
}
export {};
