import * as Actions from '../../../Actions/Actions';
import React from 'react';
import { connect } from 'react-redux';
import OnePersonTrack from './onePersonTrack';


const PeopleDataListShow = ({ data, date, showFunc, userNum, loadData }) => (
    <ul className="life-box max-content">
        {showFunc(date, data, userNum, loadData)}
    </ul>

);

class PeopleDataList extends React.Component {
    constructor(props) {
        super(props);
        console.log("开始渲染peopleDataList", props);
    }

    render() {
        let { oneTrackDate, dateIndex, showOneTrackFunc, userNumber, loadData } = this.props;
        return (
            <PeopleDataListShow key={userNumber} data={oneTrackDate} date={dateIndex} showFunc={showOneTrackFunc} userNum={userNumber} loadData={loadData} />
        )
    }
}

function mapStateToProps(state) {
    return {
        dateIndex: state.data.timeIndex,
        loadData: state.data.loadData,
        showOneTrackFunc:
            (timeIndex, mappings, userNumber, loadData) => {
                let lastTime = ""; let isSameTime = false;
                let all = loadData[userNumber];
                let content = [];
                if (all != undefined) {
                    content = all.content
                }
                //timeData
                //timeIndex
                return timeIndex.daySortArray.map((time, index) => {
                    isSameTime = lastTime == time.substr(0, 8);//判断是不是新的一天
                    if (!isSameTime) {
                        lastTime = time.substr(0, 8);
                    }
                    let indextime = mappings[time];
                    console.log("mappings", mappings);
                    console.log("indextime", indextime);
                    return (
                        <OnePersonTrack
                            isNewDay={!isSameTime}
                            userNumber={time}
                            dataContent={content[indextime]}
                            key={userNumber + time} />
                    )
                })

            }
    }

}
export default connect(mapStateToProps)(PeopleDataList)