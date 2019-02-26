import { Component } from 'preact';
import { Margin, DataArray } from '../../types';
interface LineScatterProps {
    name: string;
    height?: number;
    width?: number;
    margin?: Margin;
    x: string;
    y: string;
    data: DataArray[];
    radius?: number;
    labels?: boolean;
    legendReference?: string[];
}
interface LineScatterDefaultProps {
    height: number;
    width: number;
    margin: Margin;
    radius: number;
    labels: boolean;
}
interface LineScatterState {
    width: number;
    innerWidth: number;
    height: number;
    innerHeight: number;
    xDomain: [number, number];
    yDomain: [number, number];
}
export declare class LineScatter extends Component<LineScatterProps, LineScatterState> {
    static defaultProps: LineScatterDefaultProps;
    private chartSVG;
    private resizeOb;
    private brush;
    private brushSetup;
    private xScale;
    private yScale;
    constructor(props: LineScatterProps);
    render(props: LineScatterProps, { height, width, innerHeight, innerWidth, xDomain, yDomain }: LineScatterState): JSX.Element;
    componentDidMount(): void;
    componentWillReceiveProps(newProps: LineScatterProps, newState: LineScatterState): void;
    componentWillUnmount(): void;
    private resizeChart;
}
export {};
