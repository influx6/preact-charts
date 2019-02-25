import { h, Component } from 'preact';
import { select } from 'd3-selection';
import { axisBottom, axisLeft, AxisScale } from 'd3-axis';
import * as style from './style.css';

interface AxisProps {
    height?: number;
    width?: number;
    scale: AxisScale<any>;
    axisType: string;
    ticks?: number;
    grid?: boolean;
    rotateScaleText?: boolean;
    offsetX?: number;
}

export class Axis extends Component<AxisProps> {
    public static defaultProps: AxisProps = {
        height: null,
        width: null,
        scale: null,
        axisType: null,
        ticks: 6,
        grid: false,
        rotateScaleText: false,
    };

    private axis: SVGGElement;
    private grid: SVGGElement;

    public render ({height, axisType, grid, offsetX}: AxisProps) {
        const translate = offsetX ? `translate(${offsetX}, 0)` : `translate(0, ${height})`;
        const shouldOffset = axisType.toLowerCase() === 'x' || offsetX !== undefined;

        return (
            <g>
                <g ref={(axis) => this.axis = axis} class={`${style.axis}`}
                    transform={shouldOffset ? translate : ''}>
                </g>
                {
                    grid &&
                    <g ref={(gridline) => this.grid = gridline} class={`${style.grid}`}
                        transform={shouldOffset ? translate : ''}>
                    </g>
                }
            </g>
        );
    }

    public componentDidMount = () => { this.renderAxis(); };
    public componentDidUpdate = () => { this.renderAxis(); };
    private renderAxis = () => {
        if (this.props.axisType === 'x') {
            select(this.axis).call(axisBottom(this.props.scale).ticks(this.props.ticks));
            if (this.props.rotateScaleText) {
                select(this.axis).selectAll('text').attr('dx', '-.8em').attr('dy', '.15em')
                    .style('text-anchor', 'end').attr('transform', 'rotate(-65)');
            }

            if (this.props.grid) {
                select(this.grid).call(axisBottom(this.props.scale)
                    .ticks(this.props.ticks).tickSize(-this.props.height).tickFormat('' as null));
            }
        } else if (this.props.axisType === 'y') {
            select(this.axis).call(axisLeft(this.props.scale).ticks(this.props.ticks));
            if (this.props.grid) {
                select(this.grid).call(axisLeft(this.props.scale)
                    .ticks(this.props.ticks).tickSize(-this.props.width).tickFormat('' as null));
            }
        }
    }
}
