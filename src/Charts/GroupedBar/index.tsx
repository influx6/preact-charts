import { h, Component } from 'preact';
import { Margin, GroupedDataObject } from '../../types';
import { Axis } from '../../Axis';
import { scaleLinear, scaleBand, ScaleBand, ScaleLinear, scaleOrdinal, ScaleOrdinal } from 'd3-scale';
import { max } from 'd3-array';
import { pluckUnique } from '../../Utils/pluck';
import { colourArray } from '../../colors';

declare const ResizeObserver: any;

interface GroupedBarProps {
    name: string;
    data: GroupedDataObject;
    groups: string[];
    legendReference: {[key: string]: string};
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
export class GroupedBar extends Component<GroupedBarProps, GroupedBarState> {
    public static defaultProps: GroupedBarDefaultProps = {
        height: 500,
        width: 500,
        margin: {
            top: 25,
            right: 25,
            bottom: 75,
            left: 50,
        },
        ticks: 6,
    };
    private chartSVG: HTMLBaseElement;
    private resizeOb: any;

    constructor (props: GroupedBarProps) {
        super(props);
        const innerWidth = props.width - props.margin.right - props.margin.left;
        const innerHeight = props.height - props.margin.top - props.margin.bottom;
        this.state = {
            height: props.height,
            innerHeight,
            width: props.width,
            innerWidth,
        };
    }
    public render ({ margin, ticks, data, groups, legendReference, name }: GroupedBarProps,
                   { height, width, innerHeight, innerWidth }: GroupedBarState) {
        let yMax = 0;

        for (const key of groups) {
            const groupMax = max(data[key], (d) => d.value);
            yMax = groupMax > yMax ? groupMax : yMax;
        }

        const names = pluckUnique(data[groups[0]], 'name') as string[];

        const yScale = scaleLinear()
            .range([innerHeight, 0])
            .domain([0, yMax])
            .nice();

        const xScale = scaleBand()
            .rangeRound([0, innerWidth])
            .paddingInner(0.1)
            .domain(groups);

        const x1 = scaleBand()
            .padding(0.05)
            .domain(names)
            .rangeRound([0, xScale.bandwidth()]);

        const colourScale = scaleOrdinal(colourArray);
        return (
            <svg ref={(svg) => this.chartSVG = svg} class={name} height={height} width={width}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    <Axis height={innerHeight} axisType='x' scale={xScale} rotateScaleText={true}/>
                    <Axis width={innerWidth} axisType='y' scale={yScale} grid={true} ticks={ticks}/>
                    {
                        data &&
                            this.createBars(xScale, x1, yScale, innerHeight, groups, colourScale)
                    }
                    {
                        names &&
                            names.map((barName, idx) =>
                                <g transform={`translate(0, ${idx * 20})`}>
                                    <rect x={innerWidth + margin.right - 18} width={18} height={15} stroke='black'
                                        strokeWidth='1px' fill={colourScale(barName)}>
                                    </rect>
                                    <text x={innerWidth + margin.right - 24} y={9} dy='0.35em' fill='whitesmoke'
                                        text-anchor='end'>
                                        {legendReference[barName]}
                                    </text>
                                </g>)
                    }
                </g>
            </svg>
        );
    }
    public componentDidMount () {
        this.resizeChart();
        this.resizeOb = new ResizeObserver((entries: any[]) => {
            for (const entry of entries) {
                const cr = entry.contentRect;
                const width = cr.width;
                const height = cr.height;
                if (width !== this.state.width || height !== this.state.height) {
                    this.resizeChart();
                }
            }
        });
        this.resizeOb.observe(this.chartSVG.parentElement);
    }

    public componentWillUnmount () {
        this.resizeOb.disconnect();
    }

    private resizeChart () {
        const parent = this.chartSVG.parentElement;
        const cr = parent.getBoundingClientRect();
        const width = cr.width;
        const height = cr.height;
        const innerWidth = width - this.props.margin.left - this.props.margin.right;
        const innerHeight = height - this.props.margin.top - this.props.margin.bottom;
        this.setState({innerWidth, innerHeight, height, width});
    }

    private createBars = (x0: ScaleBand<string>, x1: ScaleBand<string>, y: ScaleLinear<number, number>,
                          height: number, groups: string[], colourScale: ScaleOrdinal<string, string>) => {
        return groups.map((group) =>
            <g transform={`translate(${x0(group)}, 0)`}>
                {
                    this.props.data[group].map((entry) =>
                        <rect width={x1.bandwidth()} x={x1(entry.name as string)} y={y(entry.value)}
                            height={height - y(entry.value)} fill={colourScale(entry.name as string)}
                            title={entry.value.toFixed(4)}>
                        </rect>)
                }
            </g>,
        );
    }
}
