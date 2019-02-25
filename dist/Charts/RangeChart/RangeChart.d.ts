import { Component } from 'preact';
import { Margin } from '../../types';
import { TimestampArray } from '../../../dashboard-conc/types';
interface RangeChartProps {
    name: string;
    height: number;
    width: number;
    margin?: Margin;
    y: string;
    data: TimestampArray;
    lineColour?: string;
    fillColour?: string;
    onBrush?: (extent: Date[]) => void;
}
interface RangeChartState {
    width: number;
    innerWidth: number;
    height: number;
    innerHeight: number;
}
export declare class RangeChart extends Component<RangeChartProps, RangeChartState> {
    static defaultProps: RangeChartProps;
    private brush;
    private brushSetup;
    private xScale;
    private chartSVG;
    private resizeOb;
    constructor(props: RangeChartProps);
    render(props: RangeChartProps, { width, height, innerWidth, innerHeight }: RangeChartState): JSX.Element;
    componentDidMount: () => void;
    componentWillUnmount(): void;
    private resizeChart;
}
export {};
