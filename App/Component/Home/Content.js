import { connect } from 'react-redux'
import React from 'react';
import Handle from '../PartOption/handle'
import { Spin, Row, Col, Input, Radio, Select, Icon, Button, Switch } from 'antd';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalBarSeries,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalRectSeries
} from 'react-vis';

import Immutable from 'immutable';
import * as Actions from '../../Actions/Actions';
import PeoplePic from '../PartOption/peoplePic';
import PeopleDataList from '../PartOption/TackContent/peopleDataList';
import OneDayIndex from '../PartOption/oneDayIndexOption';
import DetailOption from '../PartOption/detailOption';
import 'react-vis/dist/style.css';



const Option = Select.Option;
const timestamp = new Date('May 23 2017').getTime();
const ONE_DAY = 86400000;

const DATA = [
    { x: 'a', y: 1 },
    { x: 'b', y: 2 },
    { x: 'c', y: 1 },
    { x: 'd', y: 2 },

]
const DATA2 = [
    { x: 'a', y: 1 },
    { x: 'b', y: 2 },
    { x: 'c', y: 1 },
    { x: 'd', y: 2 },

]

console.log(" draw DATA ", DATA)

const TimeLine = ({ timeDataArray }) => {
    console.log("timeDataArray is %o", timeDataArray)
    return (
        <div>
            {timeDataArray.map((timeData => {
                return (<OneDayIndex day={timeData.day} dayData={timeData.dayData} />)
            }))}
        </div>
    );
}

const Peoples = () => { }

const PersonTaces = ({ height, mappings = {}, showDetailFunc, loadData, timeIndex }) => {
    let all = [];
    for (let key in mappings) {
        all.push(<PeopleDataList
            oneTrackDate={mappings[key].dateArr}
            userNumber={key}
            key={key}
            loadData={loadData}
            showDetailFunc={showDetailFunc}
            timeIndex={timeIndex}
        />)
    }
    return (
        <div>
            {all}
        </div>
    );
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


const chartDataByMonth = (chartData) => {
    let min = 0, max = 0;
    const userTimeDatas = Object.keys(chartData).map(userNumber => {
        const timeDataArray = chartData[userNumber];
        //  let chartUserMonth={[userNumber]:[]}
        let monthCount = {};
        timeDataArray.map(timeData => {
            if (!monthCount[timeData.month]) {
                monthCount[timeData.month] = timeData.dayData.length;
            } else {
                monthCount[timeData.month] = monthCount[timeData.month] + timeData.dayData.length;
            }
            min = min < monthCount[timeData.month] ? min : monthCount[timeData.month];
            max = max > monthCount[timeData.month] ? max : monthCount[timeData.month];
        });
        const xData =
            Object.keys(monthCount).map(key => {
                return { x: key, y: monthCount[key] }
            })

        return { userNumber: userNumber, xData: xData };
    });

    return { min: min, max: max, userTimeDatas: userTimeDatas }
}

const TraceChart = ({ userChartDataMonth }) => (
    <XYPlot
        xType="ordinal"
        yDomain={[userChartDataMonth.min, userChartDataMonth.max]}
        width={document.body.clientWidth - 116}
        height={139} >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        {
            userChartDataMonth.userTimeDatas.map(
                item => {
                    return (
                        <VerticalBarSeries data={item.xData} style={{ stroke: '#fff' }} />
                    )
                }
            )
        }
    </XYPlot>
);

const BaseTimeLine = ({ timeIndex }) => (
    <div className="life-time-contant max-content">
        {timeIndex.timeDataArray.map((timeData => {
            return (<OneDayIndex day={timeData.day} dayData={timeData.dayData} />)
        }))}
        <div className="life-today life-end">
            <p className="today-time life-radius">End</p>
        </div>
    </div>
);


class Content extends React.Component {
    componentDidMount() {
        this.refs.personsRef.addEventListener('scroll', () => {
            this.refs.personTraceRef.scrollTop = this.refs.personsRef.scrollTop;
        });
        this.refs.personTraceRef.addEventListener('scroll', () => {
            console.log("personTraceRef  滚动---------%o", this.refs.personTraceRef.scrollLeft);
            this.refs.timelineRef.scrollLeft = this.refs.personTraceRef.scrollLeft;
        });
    }

    render() {
        let { ui, data, showTimeIndex, addUser, showDetailFunc, changeShowChart } = this.props;
        console.log("content改变：", this.props);
        //height:计算content的高度
        //console.log("是否显示Top",isTopShow);
        let height = {};
        if (ui.Top.showTop) {
            height = document.body.clientHeight - 152 - 60;//60 每个减少20像素获取的
        } else {
            height = document.body.clientHeight - 85 - 60;
        }

        const { loadData, chartData, timeIndex } = data;
        const userChartDataMonth = chartDataByMonth(chartData);
        return (
            <Row>
                <Col span="24">
                    <Handle />

                    <div className="index-left" style={{ height: height, overflowX: "hidden" }}>
                        <Spin tip="Loading..." spinning={ui.isLoad.isLoadStatus} >
                            <h1>对比人数：<span>{Object.keys(loadData).length}</span></h1>
                            <ul
                                ref={"personsRef"}
                                className="life-person"
                                style={{ height: height - 41, maxHeight: height - 41, overflowX: "hidden" }}>
                                {Object.keys(loadData).map(key => {
                                    return (<PeoplePic pname={loadData[key].people.name}
                                        index={loadData[key].people.userNumber}
                                        key={key}
                                    />);
                                })}
                            </ul>
                        </Spin>
                    </div>
                    <div className="b-left">
                        <div style={{ marginTop: 21 }}>
                            <Select
                                size="small"
                                value={timeIndex.timeNow}
                                style={{ width: "75px" }}>
                                {
                                    data.timeIndex.timeDataArray.map(
                                        (timeData) => {
                                            return (
                                                <Option value={timeData.month}>{timeData.month}</Option>
                                            )
                                        }
                                    )
                                }
                            </Select> <Switch size="small" checked={ui.showChart} onChange={changeShowChart} />
                        </div>
                    </div>


                    <div className="collect">
                        <Input.Search
                            size="small"
                            placeholder="请输入证件号码"
                            style={{ width: 200, margin: "0px 10px 0px 10px " }}
                            onSearch={(value) => { if (!ui.isLoad.isLoadStatus) { addUser(value) } }}
                        />
                        <Radio.Group value={'all'}>
                            <Radio value={"all"}><b className="all">所有</b></Radio>
                            <Radio value={"same"}><b className="same">相同</b></Radio>
                            <Radio value={"sameDay"}><b className="sameDay">同日</b></Radio>
                        </Radio.Group>
                    </div>

                    <div
                        className="life-view "
                        style={{ overflowY: "hidden" }}>
                        <Spin tip="Loading..." spinning={ui.isLoad.isLoadStatus} >
                            <div
                                ref={"personTraceRef"}
                                style={{
                                    minHeight: height - 41, maxHeight: height - 41,
                                    overflowY: "hidden"
                                }}>
                                <PersonTaces
                                    mappings={data.mappings}
                                    height={height}
                                    showDetailFunc={showDetailFunc}
                                    loadData={loadData}
                                    timeIndex={timeIndex}
                                />
                            </div>
                        </Spin>
                    </div>
                    <div
                        className="b-right" ref="timelineRef" style={{ overflowX: "hidden" }} >
                        {ui.showChart ?
                            (<TraceChart userChartDataMonth={userChartDataMonth} />) : (
                                <BaseTimeLine timeIndex={timeIndex} />)
                        }
                    </div>

                    <DetailOption />
                </Col>
            </Row>
        )
    }

    //时间滚动条
    //    
}



function mapStateToProps(state) {



    return {
        data: state.data,
        ui: state.ui,
        isTopShow: state.ui.Top.showTop,
        isLoadStatus: state.ui.isLoad.isLoadStatus,
        filter: state.filter,
        // showTimeIndex: (timeIndex) => {
        //    dispatch(Actions.loadTimeLine(timeIndx));
        // }
    }
}
function mapDispatchToProps(dispatch) {
    return {
        addUser: (value) => {
            dispatch(Actions.loadData(value));
        },
        changeShowChart: (value) => {
            dispatch(Actions.changeShowChart(value))
        },
        showDetailFunc: () => {
            dispatch(Actions.loadDetail())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps
)(Content)

