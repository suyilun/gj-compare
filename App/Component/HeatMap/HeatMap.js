import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
moment.locale('zh-cn');
const MILLISECONDS_IN_ONE_DAY = 24 * 60 * 60 * 1000;
const DAYS_IN_WEEK = 7;
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const WEEK_X = 20;
const WEEK_Y = 40;
const MONTH_X = 40;
const MONTH_Y = 10;
const DAYS_X = 60;
const DAYS_Y = 40;//距离顶部距离
const GUTTER_SPACE = 1;
const DAY_WIDTH = 10;

const GWeekLabel = ({ weekLabels, startMoment, endMoment }) => {
    const weeks = [];
    for (var i = 0; i < 7; i++) {
        if (i % 2 != 0) {
            weeks.push(<text x={0} y={(i) * DAY_WIDTH + GUTTER_SPACE} >{weekLabels[i]}</text>);
        }
    }
    return (
        <g transform={`translate(${WEEK_X}, ${WEEK_Y})`}>
            {weeks}
        </g>
    );
}

const GMonthLabel = ({ monthLabels, startMoment, endMoment }) => {
    const months = [];
    let dayInWeek = startMoment.day();
    let dateInMonth = startMoment.date();
    let weekNums = 0;
    while (startMoment.isAfter(endMoment)) {
        if (dayInWeek == 7) {
            weekNums++;
            dayInWeek = 0;
        }
        // if (dateInMonth < dayInWeek && weekNums == 0) {
        //     months.push(
        //         <text x="10" y="10">{startMoment.month()}</text>
        //     )
        // } else {
        if (startMoment.date() == 1) {
            months.push(
                <text x={(GUTTER_SPACE + DAY_WIDTH) * (weekNums + 1)} y={10}>{monthLabels[startMoment.month()]}</text>
            )
        }
        // }
        dayInWeek++;
        startMoment.add(-1, "day");
    }

    return (
        <g transform={`translate(${MONTH_X}, ${MONTH_Y})`}>
            {months}
        </g>);
}

const GDayRects = ({ startMoment, endMoment }) => {
    const days = [];
    let dayInWeek = startMoment.day()
    let weekNums = 0;
    while (startMoment.isAfter(endMoment)) {
        if (dayInWeek == 7) {
            dayInWeek = 0;
            weekNums += 1;
        }
        days.push(
            <rect
                x={`${(weekNums - 1) * (DAY_WIDTH + GUTTER_SPACE)}`}
                y={`${(DAY_WIDTH + GUTTER_SPACE) * (dayInWeek - 1)}`}
                width={DAY_WIDTH}
                height={DAY_WIDTH}
                fill={"red"}>
                <title>{startMoment.format("YYYY-MM-DD")}</title>
            </rect>
        )
        dayInWeek++;
        startMoment.add(-1, "day");
    }
    return (
        <g transform={`translate(${DAYS_X}, ${DAYS_Y})`}>
            {days}
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
        weekLabels: DAY_LABELS,
        startDay: moment(new Date()).format("YYYYMMDD"),
        endDay: moment(new Date()).add(-200, "day").format("YYYYMMDD"),
    }

    render() {
        const { title, monthLabels, weekLabels, startDay, endDay } = this.props;
        // console.log(startDay);
        const startMoment = moment(startDay);
        const endMoment = moment(endDay);
        console.log("startM", startMoment.format("M"), startMoment.day(), startMoment.date());
        console.log("endM", endMoment.format("M"), endMoment.day());
        // 如果没有title
        return (
            <svg
                width={'100%'}
                height={'100%'}
                className={"heat-map"}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <GMonthLabel
                    monthLabels={monthLabels}
                    startMoment={_.cloneDeep(startMoment)}
                    endMoment={_.cloneDeep(endMoment)} />
                <GWeekLabel weekLabels={weekLabels} />
                <GDayRects
                    startMoment={_.cloneDeep(startMoment)}
                    endMoment={_.cloneDeep(endMoment)} />
            </svg>);
    }
}