import { Component } from 'preact';
import { Axis } from '../../Axis';
import { scaleLinear } from 'd3-scale';
import { extent } from 'd3-array';
import { select, event } from 'd3-selection';
import { brush } from 'd3-brush';
import { line, curveNatural } from 'd3-shape';
import { colourArray } from '../../colors';
import * as style from './style.css';
export class LineScatter extends Component {
    constructor(props) {
        super(props);
        const innerWidth = props.width - props.margin.left - props.margin.right;
        const innerHeight = props.height - props.margin.top - props.margin.bottom;
        const flatData = props.data.flat();
        const xDomain = extent(flatData, (d) => d[props.x]);
        const xDomainPadded = [xDomain[0] * 0.95, xDomain[1] * 1.05];
        const yDomain = extent(flatData, (d) => d[props.y]);
        const yDomainPadded = [yDomain[0] * 0.95, yDomain[1] * 1.05];
        this.state = {
            width: props.width,
            height: props.height,
            innerWidth,
            innerHeight,
            xDomain: xDomainPadded,
            yDomain: yDomainPadded,
        };
    }
    render(props, { height, width, innerHeight, innerWidth, xDomain, yDomain }) {
        this.xScale = scaleLinear()
            .range([0, innerWidth])
            .domain(xDomain);
        this.yScale = scaleLinear()
            .range([innerHeight, 0])
            .domain(yDomain);
        const lineFunc = line()
            .x((d) => this.xScale(d[props.x]))
            .y((d) => this.yScale(d[props.y]))
            .curve(curveNatural);
        return (<svg ref={(svg) => this.chartSVG = svg} class={props.name} height={height} width={width}>
                <g transform={`translate(${props.margin.left}, ${props.margin.top})`}>
                    <clipPath id={`${props.name}_cp`}>
                        <rect width={innerWidth} height={innerHeight}/>
                    </clipPath>
                    <Axis height={innerHeight} axisType='x' scale={this.xScale} grid={true}/>
                    <Axis width={innerWidth} axisType='y' scale={this.yScale} grid={true}/>
                    {props.data.map((dArray, groupIdx) => (<g>
                                <path class='line' d={lineFunc(dArray)} clip-path={`url(#${props.name}_cp)`} stroke-linecap='round' stroke={colourArray[groupIdx]} fill='none' stroke-width='2px'/>
                                {dArray.map((point, index) => <circle class={style.dot} r={props.radius} cx={this.xScale(point[props.x])} cy={this.yScale(point[props.y])} key={index} fill={colourArray[groupIdx]} clip-path={`url(#${props.name}_cp)`}/>)}
                            </g>))}
                    {props.labels &&
            <text class={style.label} x={innerWidth / 2} y={innerHeight + props.margin.bottom - 15}>
                                {props.x.replace(/_/g, ' ')}
                            </text>}
                    {props.labels &&
            <text class={style.label} x={-innerHeight / 2} y={-props.margin.left + 15} transform='rotate(-90)'>
                                {props.y.replace(/_/g, ' ')}
                            </text>}
                    {props.legendReference &&
            props.legendReference.map((title, idx) => <g transform={`translate(0, ${idx * 20})`}>
                                    <rect x={innerWidth + props.margin.right - 18} width={18} height={15} stroke='black' strokeWidth='1px' fill={colourArray[idx]}>
                                    </rect>
                                    <text x={innerWidth + props.margin.right - 24} y={9} dy='0.35em' fill='whitesmoke' text-anchor='end'>
                                        {title.replace(/_/g, ' ')}
                                    </text>
                                </g>)}
                    <g ref={(brushRef) => this.brush = brushRef} key={1}></g>
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
    componentWillReceiveProps(newProps, newState) {
        const flatData = newProps.data.flat();
        const xDomain = extent(flatData, (d) => d[newProps.x]);
        const xDomainPadded = [xDomain[0] * 0.95, xDomain[1] * 1.05];
        const yDomain = extent(flatData, (d) => d[newProps.y]);
        const yDomainPadded = [yDomain[0] * 0.95, yDomain[1] * 1.05];
        this.setState({ yDomain: yDomainPadded, xDomain: xDomainPadded });
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
        this.brushSetup = brush()
            .extent([
            [0, 0],
            [innerWidth, innerHeight],
        ])
            .handleSize(10)
            .on('end', () => {
            const s = event.selection;
            if (s === null) {
                const flatData = this.props.data.flat();
                const xDomain = extent(flatData, (d) => d[this.props.x]);
                const xDomainPadded = [xDomain[0] * 0.95, xDomain[1] * 1.05];
                const yDomain = extent(flatData, (d) => d[this.props.y]);
                const yDomainPadded = [yDomain[0] * 0.95, yDomain[1] * 1.05];
                this.setState({ xDomain: xDomainPadded, yDomain: yDomainPadded });
            }
            else {
                const xDomain = [s[0][0], s[1][0]].map(this.xScale.invert, this.xScale);
                const yDomain = [s[1][1], s[0][1]].map(this.yScale.invert, this.yScale);
                select(this.brush).call(this.brushSetup.move, null);
                this.setState({ xDomain, yDomain });
            }
        });
        select(this.brush).call(this.brushSetup);
        this.setState({ innerWidth, innerHeight, height, width });
    }
}
LineScatter.defaultProps = {
    height: 500,
    width: 500,
    margin: {
        top: 25,
        right: 25,
        bottom: 75,
        left: 75,
    },
    radius: 5,
    labels: false,
};
//# sourceMappingURL=LineScatter.jsx.map