import { Component } from 'preact';
import { Axis } from '../../Axis';
import { scaleLinear, scaleBand, scaleOrdinal } from 'd3-scale';
import { max } from 'd3-array';
import { pluckUnique } from '../../Utils/pluck';
import { colourArray } from '../../colors';
export class HorizontalBar extends Component {
    constructor(props) {
        super(props);
        this.createBars = (y0, y1, x, groups, colourScale) => {
            return groups.map((group) => <g transform={`translate(0, ${y0(group)})`}>
                {this.props.data[group].map((entry) => <rect height={y1.bandwidth()} x={0} y={y1(entry.name)} width={x(entry.value)} fill={colourScale(entry.name)} title={entry.value.toFixed(4)}>
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
    render({ margin, ticks, data, groups, name, legendReference }, { height, width, innerHeight, innerWidth }) {
        let xMax = 0;
        for (const key of groups) {
            const groupMax = max(data[key], (d) => d.value);
            xMax = groupMax > xMax ? groupMax : xMax;
        }
        const names = pluckUnique(data[groups[0]], 'name');
        const xScale = scaleLinear()
            .range([0, innerWidth])
            .domain([0, xMax])
            .nice();
        const yScale = scaleBand()
            .rangeRound([innerHeight, 0])
            .paddingInner(0.1)
            .domain(groups);
        const y1 = scaleBand()
            .padding(0.05)
            .domain(names)
            .rangeRound([0, yScale.bandwidth()]);
        const colourScale = scaleOrdinal(colourArray);
        return (<svg ref={(svg) => this.chartSVG = svg} class={name} height={height} width={width}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    <Axis height={innerHeight} axisType='x' scale={xScale} rotateScaleText={false} grid={true}/>
                    <Axis width={innerWidth} axisType='y' scale={yScale} ticks={ticks}/>
                    {data &&
            this.createBars(yScale, y1, xScale, groups, colourScale)}
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
HorizontalBar.defaultProps = {
    height: 800,
    width: 600,
    margin: {
        top: 25,
        right: 25,
        bottom: 50,
        left: 150,
    },
    ticks: 6,
};
//# sourceMappingURL=index.jsx.map