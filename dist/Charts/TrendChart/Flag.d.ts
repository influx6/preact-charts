import { Component } from 'preact';
import { ScaleTime } from 'd3-scale';
import { EventsData } from '../../../dashboard-conc/types';
interface FlagProps extends EventsData {
    onClick: (flagID: number) => void;
    xScale?: ScaleTime<number, number>;
    height?: number;
    chartName: string;
    isClicked: boolean;
}
export declare class Flag extends Component<FlagProps> {
    static defaultProps: FlagProps;
    constructor(props: FlagProps);
    render({ xScale, height, start, end, chartName, isClicked }: FlagProps): JSX.Element;
    private handleFlagClick;
}
export {};
