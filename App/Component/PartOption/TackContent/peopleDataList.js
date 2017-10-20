import * as Actions from '../../../Actions/Actions';
import React from 'react';
import { connect } from 'react-redux';
import OnePersonTrack from './onePersonTrack';


class PeopleDataList extends React.Component {
    constructor(props) {
        super(props);
        console.log("开始渲染peopleDataList", props);
    }

    renderOnePersonTrack = () => {
        const { userDateMap, timeIndex, showFunc, userNumber, loadData, showDetailFunc } = this.props;
        // console.log("$$$$$$$$$$$$$$$$$%o,%o,%o",loadData,userNumber,Object.keys(loadData))
        // console.log("--------------",Object.keys(loadData))
        let all = loadData[userNumber];
        let content = [];
        if (all != undefined) {
            content = all.content
        }
        //timeData
        //timeIndex
        //daySortArray 所有日期排序
        //push({ month: nextMonth, day: nextTime, dayData: dayData });
        let lastTime = ""; let isSameTime = false;
        let result = [];
        timeIndex.timeDataArray.map((timeData) => {
            isSameTime = lastTime == timeData.day;
            timeData.dayData.map(timeInDay => {
                let tmp = userDateMap[timeInDay]
                if (tmp) {
                    let indextime = tmp.index;
                    result.push(
                        <OnePersonTrack
                            isNewDay={!isSameTime}
                            userNumber={userNumber}
                            dataContent={content[indextime]}
                            key={userNumber + timeInDay}
                            showDetailFunc={showDetailFunc}
                        />
                    );
                }
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


export default PeopleDataList;

//export default connect(mapStateToProps,mapDispatchToProps)(PeopleDataList)