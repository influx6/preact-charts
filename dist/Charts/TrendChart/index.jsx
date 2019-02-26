import { Component, cloneElement } from 'preact';
import { scaleLinear, scaleTime } from 'd3-scale';
import { line } from 'd3-shape';
import { bisector, extent } from 'd3-array';
import { Axis } from '../../Axis';
import * as style from './style.css';
export class TrendChart extends Component {
    constructor(props) {
        super(props);
        this.handleChangeYDomain = (direction) => {
            const yDomain = this.state.yDomain;
            const yMax = yDomain[1];
            switch (direction) {
                case 'topup':
                    yDomain[1] *= 1.05;
                    break;
                case 'topdown':
                    yDomain[1] *= 0.95;
                    break;
                case 'botup':
                    yDomain[0] += yMax * 0.05;
                    break;
                case 'botdown':
                    yDomain[0] -= yMax * 0.05;
                    break;
            }
            yDomain[0] = yDomain[0] < 0 ? 0 : yDomain[0];
            this.setState({ yDomain });
        };
        this.handleMouseOver = () => {
            this.setState({ isMouseOver: true });
        };
        this.handleMouseOut = () => {
            this.setState({ isMouseOver: false });
        };
        this.handleMouseMove = (e) => {
            const xPoint = e.offsetX - this.props.margin.left;
            const xValue = this.xScale.invert(xPoint);
            const textAnchor = xPoint < (this.state.innerWidth * 0.1) ?
                'start' :
                xPoint < (this.state.innerWidth * 0.9) ?
                    'middle' :
                    'end';
            const i = this.bisectDate(this.props.data, xValue, 1);
            const d0 = this.props.data[i - 1];
            const d1 = this.props.data[i];
            const point = d1 === undefined ?
                d0 :
                +xValue - +d0.timestamp > +d1.timestamp - +xValue ?
                    d1 :
                    d0;
            const tooltipValues = [point.timestamp, point[this.props.y]];
            this.setState({ tooltipValues, textAnchor });
        };
        this.bisectDate = (data, x, low) => bisector((d) => d[this.props.x]).left(data, x, low);
        const innerWidth = props.width - props.margin.left - props.margin.right;
        const innerHeight = props.height - props.margin.top - props.margin.bottom;
        const yDomain = extent(props.data, (d) => +d[props.y]);
        this.state = {
            width: props.width,
            height: props.height,
            innerWidth,
            innerHeight,
            isMouseOver: false,
            tooltipValues: [null, null],
            textAnchor: 'middle',
            yDomain,
        };
    }
    render(props, { innerWidth, innerHeight, height, width, isMouseOver, tooltipValues, textAnchor, yDomain }) {
        const children = this.props.children;
        const xDomain = props.extent.length > 0 ?
            props.extent :
            extent(props.data, (d) => +d[props.x]);
        this.xScale = scaleTime()
            .range([0, innerWidth])
            .domain(xDomain);
        const yScale = scaleLinear()
            .range([innerHeight, 0])
            .domain(yDomain);
        const lineFunc = line()
            .x((d) => this.xScale(d[props.x]))
            .y((d) => yScale(+d[props.y]));
        return (<svg ref={(svg) => this.chartSVG = svg} class={props.name} height={height} width={width}>
                {props.axisControl &&
            <g class={style.axisControl} transform={`translate(${props.margin.left * 0.3}, ${props.margin.top + 5})`}>
                        <text class={style.axisControlPlus} onClick={() => this.handleChangeYDomain('topup')}>
                            &#43;
                        </text>
                        <text class={style.axisControlMinus} onClick={() => this.handleChangeYDomain('topdown')}>
                            &#45;
                        </text>
                    </g>}
                {props.axisControl &&
            <g class={style.axisControl} transform={`translate(${props.margin.left * 0.3}, ${innerHeight})`}>
                    <text class={style.axisControlPlus} onClick={() => this.handleChangeYDomain('botup')}>
                            &#43;
                        </text>
                        <text class={style.axisControlMinus} onClick={() => this.handleChangeYDomain('botdown')}>
                            &#45;
                        </text>
                    </g>}
                <g transform={`translate(${props.margin.left}, ${props.margin.top})`}>
                    <clipPath id={`${props.name}_cp`}>
                        <rect width={innerWidth} height={innerHeight}/>
                    </clipPath>
                    <Axis height={innerHeight} axisType='x' scale={this.xScale}/>
                    <Axis width={innerWidth} axisType='y' scale={yScale} grid={true}/>
                    <path class='line' d={lineFunc(props.data)} clip-path={`url(#${props.name}_cp)`} stroke-linecap='round' stroke={props.lineColour} fill='none' stroke-width='2px'/>
                    {children[0] &&
            children.map((ch) => cloneElement(ch, { xScale: this.xScale, height: innerHeight, chartName: props.name }))}
                    {(isMouseOver && tooltipValues[0] !== null) &&
            <g transform={`translate(${this.xScale(tooltipValues[0])},${yScale(tooltipValues[1])})`}>
                                <circle class={style.tooltipCircle} r='6'></circle>
                                <text class={style.tooltipText} x={0} y={-15} dy='0.5em' text-anchor={textAnchor}>
                                {`${tooltipValues[0].toLocaleDateString()} ${tooltipValues[0].toLocaleTimeString()}:
                                        ${tooltipValues[1].toFixed(4)}`}
                                </text>
                            </g>}
                    {(props.tooltip && props.data.length > 0) &&
            <rect class={style.tooltipOverlay} width={innerWidth} height={innerHeight} onMouseMove={this.handleMouseMove} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                            </rect>}
                    {children[0] &&
            children.map((ch) => cloneElement(ch, { xScale: this.xScale, height: innerHeight, chartName: props.name }))}
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
    componentWillReceiveProps(newProps) {
        const yDomain = extent(newProps.data, (d) => +d[newProps.y]);
        this.setState({ yDomain });
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
TrendChart.defaultProps = {
    height: 200,
    width: 1000,
    margin: {
        top: 25,
        right: 25,
        bottom: 75,
        left: 75,
    },
    lineColour: 'lightblue',
    extent: [],
    tooltip: true,
    axisControl: true,
};
//# sourceMappingURL=index.jsx.map