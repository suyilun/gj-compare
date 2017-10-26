import * as Actions from '../../Actions/Actions';
import React from 'react';
import { connect } from 'react-redux';
import TraceCard from './TraceCard'

class PeopleTraceList extends React.Component {
    constructor(props) {
        super(props);
        console.log("开始渲染peopleDataList", props);
    }

    renderOnePersonTrack = () => {
        const { userNumber, data, showFunc, showDetailFunc } = this.props;
        const { loadData, filterData } = data;
        let userData = loadData[userNumber];
        if (!userData) {
            return null;
        }
        const userTrace = userData.content;
        //push({ month: nextMonth, day: nextTime, dayData: dayData });
        let result = []; let isFirst = false;
        const userMapping = data.mappings[userNumber];
        data.desc.date_type.timeDataArray.map((timeData) => {
            isFirst = true;
            timeData.dayData.map(timeInDay => {
                const mappingItem = userMapping[timeInDay];
                if (mappingItem) {
                    const index = mappingItem.index;
                    const trace = userTrace[index];
                    result.push(
                        <li
                            className={isFirst ? 'life-border frist' : 'life-border'}
                            onClick={showDetailFunc}>
                            {TraceCard.showContent(trace)}
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
        return (
            <ul className="life-box max-content">
                {
                    this.renderOnePersonTrack()
                }
            </ul>
        )
    }
}

export default PeopleTraceList;

//export default connect(mapStateToProps,mapDispatchToProps)(PeopleDataList)