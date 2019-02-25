import { Component } from 'preact';
import { Margin, GroupedDataObject } from '../../types';
interface GroupedBarProps {
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
interface GroupedBarDefaultProps {
    height?: number;
    width?: number;
    margin?: Margin;
    ticks?: number;
}
interface GroupedBarState {
    width: number;
    innerWidth: number;
    height: number;
    innerHeight: number;
}
export declare class GroupedBar extends Component<GroupedBarProps, GroupedBarState> {
    static defaultProps: GroupedBarDefaultProps;
    private chartSVG;
    private resizeOb;
    constructor(props: GroupedBarProps);
    render({ margin, ticks, data, groups, legendReference, name }: GroupedBarProps, { height, width, innerHeight, innerWidth }: GroupedBarState): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private resizeChart;
    private createBars;
}
export {};
