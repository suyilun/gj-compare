import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import moment from 'moment';
import _ from 'lodash';
import { Tooltip } from 'antd';
moment.locale('zh-cn');
require("./HeatMap.less");
const MILLISECONDS_IN_ONE_DAY = 24 * 60 * 60 * 1000;
const DAYS_IN_WEEK = 7;
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//const MONTH_LABELS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
// const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const DAY_LABELS = ['', '周一', '', '周三', '', '周五', ''];
const WEEK_X = 20;
const WEEK_Y = 40;
const MONTH_X = 40;
const MONTH_Y = 10;
const DAYS_X = 60;
const DAYS_Y = 30;//距离顶部距离
const GUTTER_SPACE = 1;
const DAY_WIDTH = 10;
const COLOR_EMPTY = "color-empty";
const COLOR_FILLED = "color-filled";
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
        if (startMoment.date() == 1) {
            months.push(
                <text x={(GUTTER_SPACE + DAY_WIDTH) * (weekNums + 1)} y={10}>{monthLabels[startMoment.month()]}</text>
            )
        }
        dayInWeek++;
        startMoment.add(-1, "day");
    }

    return (
        <g transform={`translate(${MONTH_X}, ${MONTH_Y})`}>
            {months}
        </g>);
}

const GDayRects = ({ startMoment, endMoment, dataMap, classForDay, titleForDay, clickForDay }) => {
    const weekDays = [];
    let weekNum = 0;
    while (startMoment.isAfter(endMoment)) {
        let daysInWeek = [];
        let countWeek = 7;
        if (weekNum == 0) {
            countWeek = startMoment.day() + 1;
        }
        while (countWeek > 0 && startMoment.isAfter(endMoment)) {
            const tokenDate = startMoment.format("YYYY-MM-DD");
            const dayData = dataMap[tokenDate];
            const tokenClass = classNames({
                [COLOR_EMPTY]: typeof dayData == "undefined",
                [_.has(dayData, "value") ? `color-filled-${dayData.value}` : '']: true,
                [classForDay(dayData)]: true
            });

            let token = (
                <rect
                    x={GUTTER_SPACE}
                    y={(DAY_WIDTH + GUTTER_SPACE) * (startMoment.day())}
                    width={DAY_WIDTH}
                    height={DAY_WIDTH}
                    className={tokenClass}>
                    {dataMap[tokenDate] ? null : (<title>{titleForDay(tokenDate, dayData)}</title>)}
                </rect>
            );
            if (dataMap[tokenDate]) {
                token = (
                    <Tooltip
                        title={titleForDay(tokenDate, dayData)}
                        onClick={() => { clickForDay ? clickForDay(dayData) : () => { } }}
                    >
                        {token}
                    </Tooltip>
                )
            }
            daysInWeek.push(token);
            countWeek--;
            startMoment.add(-1, "day");
        }
        weekDays.push(
            <g transform={`translate(${weekNum * (DAY_WIDTH + 1)},0)`}>
                {daysInWeek}
            </g>
        )
        weekNum++;
    }
    return (
        <g transform={`translate(${DAYS_X}, ${DAYS_Y})`}>
            {weekDays}
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
        classForDay: PropTypes.func,
        titleForDay: PropTypes.func,
        clickForDay: PropTypes.func,
        data: PropTypes.array,//展示数据，
    };
    static defaultProps = {
        title: null,
        monthLabels: MONTH_LABELS,
        weekLabels: DAY_LABELS,
        classForDay: (dayData) => {
            return '';
        },
        titleForDay: (tokenDate, dayData) => {
            if (dayData) {
                return dayData.time;
            } else {
                return tokenDate;
            }
        },
        clickForDay: (dayData) => {
            console.log("clickForDay", dayData)
        },
        data: [
            { time: '2017-10-22', value: 3 },
            { time: '2017-10-25', value: 4 },
            { time: '2017-10-28', value: 2 },
            { time: '2017-11-01', value: 1 }
        ],
        startDay: moment(new Date()).format("YYYYMMDD"),
        endDay: moment(new Date()).add(-365, "day").format("YYYYMMDD"),
    }
    render() {
        const { title, monthLabels, weekLabels, startDay, endDay, data, classForDay, titleForDay, clickForDay } = this.props;
        const startMoment = moment(startDay);
        const endMoment = moment(endDay);
        const dataMap = {};
        data.map(dataRow => {
            dataMap[dataRow.time] = dataRow;
        })
        // console.log("startM", startMoment.format("M"), startMoment.day(), startMoment.date());
        // console.log("endM", endMoment.format("M"), endMoment.day(), dataMap);
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
                    endMoment={_.cloneDeep(endMoment)}
                />
                <GWeekLabel
                    weekLabels={weekLabels}
                />
                <GDayRects
                    dataMap={dataMap}
                    classForDay={classForDay}
                    titleForDay={titleForDay}
                    clickForDay={clickForDay}
                    startMoment={_.cloneDeep(startMoment)}
                    endMoment={_.cloneDeep(endMoment)}
                />
            </svg>
        );
    }
}