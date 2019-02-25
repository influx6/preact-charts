import { Component } from 'preact';
import { Axis } from '../../Axis';
import { scaleLinear } from 'd3-scale';
import { min, max, histogram } from 'd3-array';
import * as style from './style.css';
export class Histogram extends Component {
    constructor(props) {
        super(props);
        const innerWidth = props.width - props.margin.left - props.margin.right;
        const innerHeight = props.height - props.margin.top - props.margin.bottom;
        this.state = {
            width: props.width,
            height: props.height,
            innerWidth,
            innerHeight,
        };
    }
    render({ name, margin, x, data, ticks }, { height, width, innerHeight, innerWidth }) {
        const valuesArray = data.map((d) => d[x]);
        const xMin = min(valuesArray);
        const xMax = max(valuesArray) * 1.01;
        const xScale = scaleLinear().rangeRound([0, innerWidth]).domain([xMin, xMax]).nice();
        const bins = histogram()
            .domain(xScale.domain())
            .thresholds(xScale.ticks(ticks))(valuesArray);
        const yMax = max(bins, (d) => d.length);
        const yScale = scaleLinear().range([innerHeight, 0]).domain([0, yMax]);
        const barWidth = xScale(bins[0].x1) - xScale(bins[0].x0);
        return (<svg ref={(svg) => this.chartSVG = svg} class={name} height={height} width={width}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                    <Axis height={innerHeight} axisType='x' scale={xScale} ticks={ticks} rotateScaleText={true}/>
                    <Axis width={innerWidth} axisType='y' scale={yScale} grid={true} ticks={8}/>
                    {barWidth &&
            bins.map((bin) => <rect class={style.histogram_bar} x='1' width={barWidth} height={innerHeight - yScale(bin.length)} transform={`translate(${xScale(bin.x0)}, ${yScale(bin.length)})`}>
                            </rect>)}
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
Histogram.defaultProps = {
    height: 250,
    width: 350,
    margin: {
        top: 25,
        right: 25,
        bottom: 75,
        left: 50,
    },
    ticks: 8,
};
//# sourceMappingURL=Histogram.jsx.map