import { connect } from 'react-redux'
import React from 'react';
import classNames from 'classnames/bind';
import * as Actions from '../../Actions/Actions';

// 6,2
const OneDayIndexShow = ({ day, dayData, sameDay, sameMd5 }) => {
    const isSameDay = sameDay[day] ? sameDay[day] > 1 : false;
    return (
        <ul className="life-time max-content">
            <li className="life-today" id={`time-day-${day}`}>
                <p className="today-time life-radius">{day.substr(6, 2)}</p>
            </li>
            {dayData.map((time, index) => {
                return (
                    <li >
                        <i className={classNames('life-radius', { 'today-day': isSameDay, 'today-same': false })}></i>
                        <span>{time}</span>
                    </li>
                )
            })}
        </ul>
    );
}

class OneDayIndex extends React.Component {
    render() {
        let { dayData, day, sameMd5, sameDay } = this.props;
        return (
            <OneDayIndexShow day={day} dayData={dayData} sameMd5={sameMd5} sameDay={sameDay} />
        );
    }
}


export default OneDayIndex;
