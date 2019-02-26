import { Component } from 'preact';
import { Margin } from '../../types';
interface DiffBarProps {
    name: string;
    data: Array<{
        name: string;
        value: number;
    }>;
    height?: number;
    width?: number;
    margin?: Margin;
    ticks?: number;
}
interface DiffBarDefaultProps {
    height: number;
    width: number;
    margin: Margin;
    ticks: number;
}
interface DiffBarState {
    width: number;
    innerWidth: number;
    height: number;
    innerHeight: number;
}
export declare class DifferenceChart extends Component<DiffBarProps, DiffBarState> {
    static defaultProps: DiffBarDefaultProps;
    private chartSVG;
    private resizeOb;
    constructor(props: DiffBarProps);
    render({ margin, ticks, data, name }: DiffBarProps, { height, width, innerHeight, innerWidth }: DiffBarState): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private resizeChart;
    private createBars;
}
export {};
