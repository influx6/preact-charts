import { h, Component } from 'preact';
import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import * as style from './style.css';
export class Axis extends Component {
    constructor() {
        super(...arguments);
        this.componentDidMount = () => { this.renderAxis(); };
        this.componentDidUpdate = () => { this.renderAxis(); };
        this.renderAxis = () => {
            if (this.props.axisType === 'x') {
                select(this.axis).call(axisBottom(this.props.scale).ticks(this.props.ticks));
                if (this.props.rotateScaleText) {
                    select(this.axis).selectAll('text').attr('dx', '-.8em').attr('dy', '.15em')
                        .style('text-anchor', 'end').attr('transform', 'rotate(-65)');
                }
                if (this.props.grid) {
                    select(this.grid).call(axisBottom(this.props.scale)
                        .ticks(this.props.ticks).tickSize(-this.props.height).tickFormat(''));
                }
            }
            else if (this.props.axisType === 'y') {
                select(this.axis).call(axisLeft(this.props.scale).ticks(this.props.ticks));
                if (this.props.grid) {
                    select(this.grid).call(axisLeft(this.props.scale)
                        .ticks(this.props.ticks).tickSize(-this.props.width).tickFormat(''));
                }
            }
        };
    }
    render({ height, axisType, grid, offsetX }) {
        const translate = offsetX ? `translate(${offsetX}, 0)` : `translate(0, ${height})`;
        const shouldOffset = axisType.toLowerCase() === 'x' || offsetX !== undefined;
        return (h("g", null,
            h("g", { ref: (axis) => this.axis = axis, class: `${style.axis}`, transform: shouldOffset ? translate : '' }),
            grid &&
                h("g", { ref: (gridline) => this.grid = gridline, class: `${style.grid}`, transform: shouldOffset ? translate : '' })));
    }
}
Axis.defaultProps = {
    height: null,
    width: null,
    scale: null,
    axisType: null,
    ticks: 6,
    grid: false,
    rotateScaleText: false,
};
//# sourceMappingURL=index.js.map