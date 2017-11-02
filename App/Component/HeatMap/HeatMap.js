import React from 'react';
import PropTypes from 'prop-types';

const MILLISECONDS_IN_ONE_DAY = 24 * 60 * 60 * 1000;
const DAYS_IN_WEEK = 7;
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const HEAT_MAP_SPACE = 10;

const GMonthLabel = ({ monthLabels }) => {
    return (
        <g transform={"translate(30, 10)"}>
            <text>一月</text>
        </g>);
}

const GWeekLabel = ({ weekLabels }) => {
    return (
        <g transform={`translate(10, ${10 + HEAT_MAP_SPACE})`}>
            {/* <text x={0} y={10}>7</text> */}
            <text x={0} y={21}>一</text>
            {/* <text x={0} y={32}>2</text> */}
            <text x={0} y={43}>三</text>
            {/* <text x={0} y={54}>4</text> */}
            <text x={0} y={65}>五</text>
        </g>);
}

const GDayRacts = () => {
    return (
        <g transform={`translate(30, ${10 + HEAT_MAP_SPACE})`}>
            <rect x="0" y="0" width="10" height="10" fill={"red"}></rect>
            <rect x="0" y="11" width="10" height="10" fill={"blue"}></rect>
            <rect x="0" y="22" width="10" height="10" fill={"blue"}></rect>
            <rect x="0" y="33" width="10" height="10" fill={"blue"}></rect>
            <rect x="0" y="44" width="10" height="10" fill={"blue"}></rect>
            <rect x="0" y="55" width="10" height="10" fill={"blue"}></rect>
            <rect x="0" y="66" width="10" height="10" fill={"blue"}></rect>
        </g>
    );
}

export default class HeatMap extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        startDay: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
        endDay: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
        monthLabels: PropTypes.array,
        weekLabels: PropTypes.array,
        classForValue: PropTypes.func,
        data: PropTypes.array,//展示数据，
    };
    static defaultProps = {
        title: null,
        monthLabels: MONTH_LABELS,
        weekLabels: DAY_LABELS
    }

    render() {
        const { title, monthLabels, weekLabels } = this.props;
        // 如果没有title
        return (
            <svg viewBox={"0 0 623 120"}
                width={200}
                height={100}
                className={"heat-map"}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <GMonthLabel monthLabels={monthLabels} />
                <GWeekLabel weekLabels={weekLabels} />
                <GDayRacts />
            </svg>);
    }
}