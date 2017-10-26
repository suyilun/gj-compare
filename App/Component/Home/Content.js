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
import PeopleTraceList from '../PartOption/PeopleTraceList';
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

const PersonTaces = ({ showDetailFunc, data }) => {
    let all = [];
    for (let userNumber in data.loadData) {
        all.push(
            <PeopleTraceList
                userNumber={userNumber}
                key={userNumber}
                data={data}
                showDetailFunc={showDetailFunc}
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

const BaseTimeLine = ({ data }) => {
    const { desc } = data;
    const timeTokens = [];
    desc.date_type.timeDataArray.map((timeData => {
        timeTokens.push(<OneDayIndex day={timeData.day} dayData={timeData.dayData} />);
    }))
    return (
        <div className="life-time-contant max-content">
            {timeTokens}
            <div className="life-today life-end">
                <p className="today-time life-radius">End</p>
            </div>
        </div>);
};

class Content extends React.Component {
    componentDidMount() {
        this.refs.personsRef.addEventListener('scroll', () => {
            this.refs.personTraceRef.scrollTop = this.refs.personsRef.scrollTop;
        });
        this.refs.personTraceRef.addEventListener('scroll', () => {
            this.refs.timelineRef.scrollLeft = this.refs.personTraceRef.scrollLeft;
        });
    }

    render() {
        let { ui, data, showTimeIndex, addUser, showDetailFunc, changeShowChart, changeSameRadioFunc } = this.props;
        console.log("content改变：", this.props);
        //height:计算content的高度
        //console.log("是否显示Top",isTopShow);
        let height = {};
        if (ui.Top.showTop) {
            height = document.body.clientHeight - 152 - 60;//60 每个减少20像素获取的
        } else {
            height = document.body.clientHeight - 85 - 60;
        }

        const { loadData, chartData } = data;
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
                                value={"11"}
                                style={{ width: "75px" }}>
                                {
                                    //日期

                                    // data.timeIndex.timeDataArray.map(
                                    //     (timeData) => {
                                    //         return (
                                    //             <Option value={timeData.month}>{timeData.month}</Option>
                                    //         )
                                    //     }
                                    // )
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
                        <Radio.Group value={data.filterData.radioValue} onChange={changeSameRadioFunc}>
                            <Radio value={"all"}><b className="all">所有</b></Radio>
                            <Radio value={"sameDay"}><b className="sameDay">同日</b></Radio>
                            <Radio value={"same"}><b className="same">相同</b></Radio>
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
                                    data={data}
                                    height={height}
                                    showDetailFunc={showDetailFunc}
                                />
                            </div>
                        </Spin>
                    </div>
                    <div
                        className="b-right" ref="timelineRef" style={{ overflowX: "hidden" }} >
                        {ui.showChart ?
                            (<TraceChart userChartDataMonth={userChartDataMonth} />)
                            :
                            (<BaseTimeLine data={data} />)
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
        },
        changeSameRadioFunc: (e) => {
            dispatch(Actions.changeSameRadio(e.target.value))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps
)(Content)

