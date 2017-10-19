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
        const { oneTrackDate, timeIndex, showFunc, userNumber, loadData, showDetailFunc } = this.props;
        // console.log("$$$$$$$$$$$$$$$$$%o,%o,%o",loadData,userNumber,Object.keys(loadData))
        // console.log("--------------",Object.keys(loadData))
        let lastTime = ""; let isSameTime = false;
        let all = loadData[userNumber];
        let content = [];
        if (all != undefined) {
            content = all.content
        }
        //timeData
        //timeIndex
        //daySortArray 所有日期排序
        return timeIndex.daySortArray.map((time, index) => {
            isSameTime = lastTime == time.substr(0, 8);//判断是不是新的一天
            if (!isSameTime) {
                lastTime = time.substr(0, 8);
            }
            let indextime = oneTrackDate[time];
            // console.log("oneTrackDate", oneTrackDate);
            // //console.log("indextime", indextime);
            // console.log("content",content)
            // console.log("dataContent", content[indextime]);
            return (
                <OnePersonTrack
                    isNewDay={!isSameTime}
                    userNumber={userNumber}
                    dataContent={content[indextime]}
                    key={userNumber + time}
                    showDetailFunc={showDetailFunc}
                />
            )
        });
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

// function mapStateToProps(state) {
//     return {
//         timeIndex: state.data.timeIndex,
//         loadData: state.data.loadData,
//     }
// }

// function mapDispatchToProps(dispatch) {
//     return {
//         showDetailFunc: () => {
//             dispatch(Actions.loadDetail())
//         }
//     }
// }
export default PeopleDataList;

//export default connect(mapStateToProps,mapDispatchToProps)(PeopleDataList)