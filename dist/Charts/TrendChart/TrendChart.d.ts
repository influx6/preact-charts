import { Component } from 'preact';
import { Margin, TimestampArray } from '../../types';
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
interface TrendChartDefaultProps {
    height: number;
    width: number;
    margin: Margin;
    lineColour: string;
    extent: Date[];
    tooltip: boolean;
    axisControl: boolean;
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
    static defaultProps: TrendChartDefaultProps;
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
