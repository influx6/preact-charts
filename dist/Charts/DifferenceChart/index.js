import { h, Component } from 'preact';
import { Axis } from '../../Axis';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import { pluck } from '../../Utils/pluck';
export class DifferenceChart extends Component {
    constructor(props) {
        super(props);
        this.createBars = (y, x) => {
            return this.props.data.map((entry) => h("rect", { height: y.bandwidth(), x: x(Math.min(0, entry.value)), y: y(entry.name), width: Math.abs(x(entry.value) - x(0)), fill: entry.value < 0 ? 'darkred' : 'green', title: entry.value.toFixed(4) }));
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
    render({ margin, ticks, data, name }, { height, width, innerHeight, innerWidth }) {
        const absoluteXValues = data.map((d) => Math.abs(d.value));
        const xMax = max(absoluteXValues);
        const xDomain = [-xMax, xMax];
        const yDomain = pluck(data, 'name');
        const xScale = scaleLinear()
            .range([0, innerWidth])
            .domain(xDomain)
            .nice();
        const yScale = scaleBand()
            .rangeRound([innerHeight, 0])
            .paddingInner(0.1)
            .domain(yDomain);
        return (h("svg", { ref: (svg) => this.chartSVG = svg, class: name, height: height, width: width },
            h("g", { transform: `translate(${margin.left}, ${margin.top})` },
                data &&
                    this.createBars(yScale, xScale),
                h(Axis, { height: innerHeight, axisType: 'x', scale: xScale, rotateScaleText: false, grid: true }),
                h(Axis, { width: innerWidth, axisType: 'y', scale: yScale, ticks: ticks, offsetX: xScale(0) }))));
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
DifferenceChart.defaultProps = {
    height: 800,
    width: 600,
    margin: {
        top: 25,
        right: 25,
        bottom: 50,
        left: 25,
    },
    ticks: 8,
};
//# sourceMappingURL=index.js.map