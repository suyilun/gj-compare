import { connect } from 'react-redux'
import React from 'react';
import * as Actions from '../../Actions/Actions';
// 6,2
const OneDayIndexShow = ({ day, dayData }) => (
    <ul className="life-time max-content">
        <li className="life-today" id={`time-day-${day.substr(0, 8)}`}>
            <p className="today-time life-radius">{day.substr(6, 2)}</p>
        </li>
        {dayData.map((time, index) => {
            return (
                <li >
                    <i className="today-same life-radius"></i>
                    <span>{time}</span>
                </li>
            )
        })}
    </ul>
);


class OneDayIndex extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { dayData, day } = this.props;
        console.log("dayData is %o", dayData);
        return (
            <OneDayIndexShow day={day} dayData={dayData} />
        );
    }
}


function mapStateToProps(state) {

}


export default connect(mapStateToProps)(OneDayIndex)
