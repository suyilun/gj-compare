import * as Actions from '../../Actions/Actions';
import React from 'react';
import { connect } from 'react-redux';
import TraceCard from './TraceCard'
import classNames from 'classnames/bind';

class PeopleTraceList extends React.Component {

    renderOnePersonTrack = () => {
        const { userNumber, data, showFunc, showDetailFunc } = this.props;
        const { loadData, filterData, desc, mappings } = data;
        const { sameDay, sameMd5, date_type } = desc;
        const timeDataArray = date_type.timeDataArray;
        let userData = loadData[userNumber];
        if (!userData) {
            return null;
        }
        const userTrace = userData.content;
        //({ month: 201409, day: 20140902, dayData: [20140902195800,...]});
        let result = []; let isFirst = false;
        const userMapping = mappings[userNumber];
        timeDataArray.map((timeData) => {
            isFirst = true;
            const isSameDay = sameDay[timeData.day] ? sameDay[timeData.day] > 1 : false;
            timeData.dayData.map(timeInDay => {
                const mappingItem = userMapping[timeInDay];
                if (mappingItem) {
                    const index = mappingItem.index;
                    const trace = userTrace[index];
                    const isSameMd5 = sameMd5[trace.md5] ? sameMd5[trace.md5] > 1 : false;
                    const traceStyle = classNames({ "life-single": true, "life-day": isSameDay, "life-same": isSameMd5 });
                    result.push(
                        <li
                            className={isFirst ? 'life-border frist' : 'life-border'}
                            onClick={showDetailFunc}>
                            {TraceCard.showContent(trace, traceStyle)}
                        </li>
                    );
                } else {
                    result.push(
                        <li className={isFirst ? 'life-border frist' : 'life-border'} />
                    )
                }
                isFirst = false;
            });
        })
        if (result.length > 0) {
            result.push(<li className={'life-nbsp'} />)
        }
        return result;
    }

    render() {
        const {classNameExt}=this.props;
        return (
            <ul className={`life-box max-content ${classNameExt}`}>
                {
                    this.renderOnePersonTrack()
                }
            </ul>
        )
    }
}

export default PeopleTraceList;

//export default connect(mapStateToProps,mapDispatchToProps)(PeopleDataList)