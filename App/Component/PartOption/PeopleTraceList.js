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
        const { userDateMap, timeIndex, showFunc, userNumber, loadData, showDetailFunc } = this.props;
        let all = loadData[userNumber];
        let content = [];
        if (all != undefined) {
            content = all.content
        }
        //push({ month: nextMonth, day: nextTime, dayData: dayData });
        let result = []; let isFirst = false;
        timeIndex.timeDataArray.map((timeData) => {
            isFirst = true;
            timeData.dayData.map(timeInDay => {
                const tmp = userDateMap[timeInDay]
                if (tmp && tmp.show) {
                    const indextime = tmp.index;
                    const dataContent = content[indextime];
                    result.push(
                        <li
                            className={isFirst ? 'life-border frist' : 'life-border'}
                            onClick={showDetailFunc}>
                            {TraceCard.showContent(
                                dataContent == undefined ?
                                    "" : dataContent.track_type,
                                dataContent)}
                        </li>
                    );

                } else {
                    result.push(
                        <li
                            className={isFirst ? 'life-border frist' : 'life-border'}
                        >
                        </li>
                    )
                }
                isFirst = false;

            });
        })
        return result;
    }

    render() {
        return (
            <ul className="life-box max-content">
                {
                    this.renderOnePersonTrack()
                }
                <li className={'life-nbsp'} >
                </li>
            </ul>
        )
    }
}


export default PeopleTraceList;

//export default connect(mapStateToProps,mapDispatchToProps)(PeopleDataList)