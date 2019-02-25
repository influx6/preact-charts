import { Component } from 'preact';
import { Margin } from '../../types';
import { TimestampArray } from '../../../dashboard-conc/types';
interface TrendChartProps {
    name: string;
    height?: number;
    width?: number;
    margin?: Margin;
    x: string;
    y: string;
    data: TimestampArray;
    lineColour?: string;
    extent?: Date[];
    tooltip?: boolean;
    axisControl?: boolean;
}
interface TrendChartState {
    height: number;
    width: number;
    innerHeight: number;
    innerWidth: number;
    tooltipValues: [Date, number];
    textAnchor: string;
    isMouseOver: boolean;
    yDomain: number[];
}
export declare class TrendChart extends Component<TrendChartProps, TrendChartState> {
    static defaultProps: TrendChartProps;
    private chartSVG;
    private resizeOb;
    private xScale;
    constructor(props: TrendChartProps);
    render(props: TrendChartProps, { innerWidth, innerHeight, height, width, isMouseOver, tooltipValues, textAnchor, yDomain }: TrendChartState): JSX.Element;
    componentDidMount(): void;
    componentWillReceiveProps(newProps: TrendChartProps): void;
    componentWillUnmount(): void;
    private handleChangeYDomain;
    private handleMouseOver;
    private handleMouseOut;
    private handleMouseMove;
    private bisectDate;
    private resizeChart;
}
export {};
