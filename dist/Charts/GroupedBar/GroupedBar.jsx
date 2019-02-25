import { Component } from 'preact';
import { Axis } from '../../Axis';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { max } from '../../../utilities/simpleStats';
import { pluckUnique } from '../../../utilities/pluck';
import { colourArray } from '../../colors';
export class GroupedBar extends Component {
    constructor(props) {
        super(props);
        this.createBars = (x0, x1, y, height, groups, colourScale) => {
            return groups.map((group) => <g transform={`translate(${x0(group)}, 0)`}>
                {this.props.data[group].map((entry) => <rect width={x1.bandwidth()} x={x1(entry.name)} y={y(entry.value)} height={height - y(entry.value)} fill={colourScale(entry.name)} title={entry.value.toFixed(4)}>
                        </rect>)}
            </g>);
        };
        const innerWidth = props.width - props.margin.right - props.margin.left;
        const innerHeight = props.height - props.margin.top - props.margin.bottom;
        this.state = {
            height: props.height,
            innerHeight,
            width: props.width,
            innerWidth,
        };
    }
    render({ margin, ticks, data, groups, legendReference, name }, { height, width, innerHeight, innerWidth }) {
        let yMax = 0;
        for (const key of groups) {
            const groupMax = max(data[key], 'value');
            yMax = groupMax > yMax ? groupMax : yMax;
        }
        const names = pluckUnique(data[groups[0]], 'name');
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
        return (<svg ref={(svg) => this.chartSVG = svg} class={name} height={height} width={width}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    <Axis height={innerHeight} axisType='x' scale={xScale} rotateScaleText={true}/>
                    <Axis width={innerWidth} axisType='y' scale={yScale} grid={true} ticks={ticks}/>
                    {data &&
            this.createBars(xScale, x1, yScale, innerHeight, groups, colourScale)}
                    {names &&
            names.map((barName, idx) => <g transform={`translate(0, ${idx * 20})`}>
                                    <rect x={innerWidth + margin.right - 18} width={18} height={15} stroke='black' strokeWidth='1px' fill={colourScale(barName)}>
                                    </rect>
                                    <text x={innerWidth + margin.right - 24} y={9} dy='0.35em' fill='whitesmoke' text-anchor='end'>
                                        {legendReference[barName]}
                                    </text>
                                </g>)}
                </g>
            </svg>);
    }
    componentDidMount() {
        this.resizeChart();
        this.resizeOb = new ResizeObserver((entries) => {
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
    componentWillUnmount() {
        this.resizeOb.disconnect();
    }
    resizeChart() {
        const parent = this.chartSVG.parentElement;
        const cr = parent.getBoundingClientRect();
        const width = cr.width;
        const height = cr.height;
        const innerWidth = width - this.props.margin.left - this.props.margin.right;
        const innerHeight = height - this.props.margin.top - this.props.margin.bottom;
        this.setState({ innerWidth, innerHeight, height, width });
    }
}
GroupedBar.defaultProps = {
    name: 'groupedbar',
    height: 500,
    width: 500,
    margin: {
        top: 25,
        right: 25,
        bottom: 75,
        left: 50,
    },
    data: {},
    groups: [],
    ticks: 6,
    legendReference: {},
};
//# sourceMappingURL=GroupedBar.jsx.map