import { connect } from 'react-redux'
import React from 'react';
import Handle from '../PartOption/handle'
import { Spin, Row, Col, Input, Radio, Select, Icon, Button, Switch, Table } from 'antd';
import classNames from 'classnames/bind';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalBarSeries,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalRectSeries
} from 'react-vis';
import CalendarHeatmap from 'react-calendar-heatmap';
import Immutable from 'immutable';
import * as Actions from '../../Actions/Actions';
import PeoplePic from '../PartOption/peoplePic';
import PeopleTraceList from '../PartOption/PeopleTraceList';
import OneDayIndex from '../PartOption/oneDayIndexOption';
import DetailOption from '../PartOption/detailOption';
import HeatMap from '../HeatMap/HeatMap.js';
// import 'react-vis/dist/style.css';

const BASELINE_HEIGHT = 35;
const TOP_HEIGHT = 60;
const SEARCH_BAR = 40;
const BOTTOM_HEIGHT = 160;
const PERSON_ROW_HEIGHT = 120;
const LEFT_HEIGHT = 116;

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
    return (
        <div>
            {timeDataArray.map((timeData => {
                return (<OneDayIndex day={timeData.day} dayData={timeData.dayData} />)
            }))}
        </div>
    );
}

class TimeSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = { nowMonth: null };
    }

    render() {
        const { timeDataArray, changeTimeSelect } = this.props;
        const { nowMonth } = this.state;
        let currentMonth = null;
        if (timeDataArray.length > 0) {
            currentMonth = nowMonth ? nowMonth : timeDataArray[0].month;
        }
        return (
            <Select
                key="TimeSelect-ant-select"
                size="small"
                value={currentMonth}
                onChange={changeTimeSelect}
                style={{ width: "75px" }}>
                {
                    //日期
                    timeDataArray.map(
                        (timeData) => {
                            return (
                                <Option key={`TimeSelect-ant-select-option-${timeData.month}`} value={timeData.month}>{timeData.month}</Option>
                            )
                        }
                    )
                }
            </Select>
        )
    }
}

class MonthLeftShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = { nowMonth: null };
    }
    render() {
        let currentMonth = null;
        const { nowMonth } = this.state;
        const { userNumberSize, timeDataArray } = this.props;
        if (timeDataArray.length > 0) {
            currentMonth = nowMonth ? nowMonth : timeDataArray[0].month;
        }
        if (userNumberSize == 0) {
            return (null);
        }
        return (<h5 style={{ height: BASELINE_HEIGHT }}><a>{currentMonth}</a></h5>);
    }
}

const Peoples = () => { }

const PersonTaces = ({ showDetailFunc, data }) => {
    let all = [];
    let count = 0;
    for (let userNumber in data.loadData) {
        all.push(
            <PeopleTraceList
                key={`PeopleTraceList-${userNumber}`}
                classNameExt={classNames({ "odd": count % 2 != 0, "even": count % 2 == 0 })}
                userNumber={userNumber}
                data={data}
                showDetailFunc={showDetailFunc}
            />)
        count++;
    }
    return (
        <div>
            {all}
        </div>
    );
}

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
        width={document.body.clientWidth - LEFT_HEIGHT}
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


const TraceAnaylse = () => {

    var until = '2016-06-30';
    return (
        <div >
            <CalendarHeatmap
                horizontal={true}
                startDate={new Date("2016-11-01")}
                endDate={new Date('2017-11-06')}
                showWeekdayLabels={true}
                weekdayLabels={['日', '一', '二', '三', '四', '五', '六']}
                monthLabels={['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']}
                values={[
                    { date: '2016-12-01', count: 1 },
                    { date: '2016-01-03', count: 4 },
                    { date: '2017-11-01', count: 2 },
                    // ...and so on
                ]}
            />

        </div>
    )
}


const TraceTable = () => {
    const columns = [{
        title: 'Name',
        dataIndex: 'name',
    }, {
        title: '旅馆',
        dataIndex: 'lg',
    }, {
        title: '飞机',
        dataIndex: 'fj',
    },
    {
        title: '火车',
        dataIndex: 'hc',
    },
    {
        title: '客运',
        dataIndex: 'ly',
    },
    {
        title: '医疗',
        dataIndex: 'yl',
    },
    {
        title: '暂口',
        dataIndex: 'zk',
    },
    {
        title: '网吧',
        dataIndex: 'wb',
    },
    {
        title: '其他',
        dataIndex: 'qt',
    },

    ];
    const data = [
        {
            name: "测试",
            key: '1', lg: 10, wb: 10, fj: 20, ky: 11, yl: 12, zk: 4, qt: 0
        },
        {
            name: "测试",
            key: '2', lg: 10, wb: 10, fj: 20, ky: 11, yl: 12, zk: 4, qt: 0
        },
        {
            name: "测试",
            key: '3', lg: 10, wb: 10, fj: 20, ky: 11, yl: 12, zk: 4, qt: 0
        },
        {
            name: "测试",
            key: '4', lg: 10, wb: 10, fj: 20, ky: 11, yl: 12, zk: 4, qt: 0
        },
        {
            name: "测试",
            key: '5', lg: 10, wb: 10, fj: 20, ky: 11, yl: 12, zk: 4, qt: 0
        },
        {
            name: "测试",
            key: '6', lg: 10, wb: 10, fj: 20, ky: 11, yl: 12, zk: 4, qt: 0
        },
    ];
    return (<Table scroll={{ y: BOTTOM_HEIGHT - 45 }} columns={columns} dataSource={data} size="small" pagination={false} />)
}


const BaseTimeLine = ({ timeDataArray, sameDay, sameMd5 }) => {
    const timeTokens = [];
    timeDataArray.map((timeData => {
        timeTokens.push(<OneDayIndex key={`${timeData.day}`} day={timeData.day} dayData={timeData.dayData} sameDay={sameDay} sameMd5={sameMd5} />);
    }))
    return (
        <div className="life-time-contant max-content">
            {timeTokens}
            <div className="life-today life-end">
                <span className="today-time life-radius"><b>End</b></span>
            </div>
        </div>);
};

class Content extends React.Component {

    constructor(props) {
        super(props);
        const { traceWidth } = this.props.ui;//窗口宽度
        this.timePosition = {};
        // this.state = { nowMonth: null };
        // this.timePosition = {};//位置距离
        //console.log("this.timePosition %o", this.timePosition)
        //this.state = { scrollWidth: 0 };
    }

    // componentDidUpdate(prevProps) {
    //     //判断状态是否有变化
    //     //filterData属性变化，radioValue变化，用户变化
    //     let needUpdate = false;
    //     const prevRadio = prevProps.data.filterData.radioValue;
    //     const radio = this.props.data.filterData.radioValue;
    //     needUpdate = prevRadio != radio
    //     if (!needUpdate) {
    //         const prevOptions = prevProps.data.filterData.options.filter((option) => { return option.ischeck }).map((option) => { return option.value })
    //             .join(",");
    //         const options = this.props.data.filterData.options.filter((option) => { return option.ischeck }).map((option) => { return option.value })
    //             .join(",");
    //         needUpdate = prevOptions != options;
    //     }
    //     if (!needUpdate) {
    //         const prevUsers = Object.keys(prevProps.data.loadData);
    //         const users = Object.keys(this.props.data.loadData);
    //         for (var i = 0; i < prevUsers.length; i++) {
    //             if (users.indexOf(prevUsers[i]) == -1) {
    //                 needUpdate = true;
    //                 break;
    //             }
    //         }
    //         if (!needUpdate) {
    //             for (var i = 0; i < users.length; i++) {
    //                 if (prevUsers.indexOf(users[i]) == -1) {
    //                     needUpdate = true;
    //                     break;
    //                 }
    //             }
    //         }
    //         if (needUpdate) {
    //             const timeDataArray = this.props.data.desc.date_type.timeDataArray;
    //             timeDataArray.map((timeData) => {
    //                 if (typeof timePosition[timeData.month] == 'undefined') {
    //                     this.timePosition[timeData.month] = 40;
    //                 } else {
    //                     timeData.dayData.map((timeInDay) => {
    //                         this.timePosition[timeData.month] = this.timePosition[timeData.month] + 210;
    //                     });
    //                 }
    //             })
    //             console.log("修改日期位置.....%o", this.timePosition);
    //         }
    //     }
    //}

    componentWillUpdate(nextProps, nextState) {
        let tempPosition = {};
        const timeDataArray = nextProps.data.desc.date_type.timeDataArray;
        let newDay = null;
        timeDataArray.map((timeData) => {
            if (typeof tempPosition[timeData.month] == 'undefined') {
                tempPosition[timeData.month] = 0;
            }
            if (newDay != timeData.day) {
                tempPosition[timeData.month] = tempPosition[timeData.month] + 40;
            }
            timeData.dayData.map((timeInDay) => {
                tempPosition[timeData.month] = tempPosition[timeData.month] + 210;
            });
        });
        this.timePosition = tempPosition;
        console.log("%o 转时间位置 %o", timeDataArray, this.timePosition);
    }

    moveTimeScroller = (value) => {
        let nowMonth = null;
        for (var month in this.timePosition) {
            value = value - this.timePosition[month];
            if (value < 0) {
                nowMonth = month;
                break;
            }
        }
        this.refs.timeSelectRef.setState({ nowMonth });
        this.refs.monthLeftShowRef.setState({ nowMonth })
    }

    changeTimeSelect = (nowMonth) => {
        this.refs.timeSelectRef.setState({ nowMonth })
        let scrollerWidth = 0;
        for (var month in this.timePosition) {
            if (month == nowMonth) {
                break;
            }
            scrollerWidth += this.timePosition[month];
        }
        console.log("changeTimeSelect:", nowMonth, scrollerWidth, this.timePosition)
        this.refs.personTraceRef.scrollLeft = scrollerWidth;
        this.refs.timelineRef.scrollLeft = scrollerWidth;
    }

    componentDidMount() {
        //const { moveTimeScroller } = this.props;
        let self = this;
        this.refs.personsRef.addEventListener('scroll', () => {
            this.refs.personTraceRef.scrollTop = this.refs.personsRef.scrollTop;
        });
        this.refs.personTraceRef.addEventListener('scroll', () => {
            //年月切换
            const value = this.refs.personTraceRef.scrollLeft;
            self.moveTimeScroller(value);
            this.refs.timelineRef.scrollLeft = value;
        });
    }

    render() {
        let { ui, data, showTimeIndex, addUser, showDetailFunc, changeShowChart, changeSameRadioFunc } = this.props;
        console.log("content改变：", this.props);
        const { loadData, chartData } = data;
        let height = {};
        const userNumberSize = Object.keys(loadData).length;
        if (ui.Top.showTop) {
            height = window.innerHeight - (TOP_HEIGHT + BOTTOM_HEIGHT + SEARCH_BAR);
        } else {
            height = window.innerHeight - (BOTTOM_HEIGHT + SEARCH_BAR);
        }
        if (userNumberSize != 0) {
            //有用户，出现日期条
            height = height - BASELINE_HEIGHT;
        }


        const timeDataArray = data.desc.date_type.timeDataArray;
        const sameDay = data.desc.sameDay;
        const sameMd5 = data.desc.sameMd5;
        const userChartDataMonth = chartDataByMonth(chartData);
        let timeChoose = data.filterData.timeChoose;
        if (timeChoose == null) {
            if (timeDataArray.length > 0) {
                timeChoose = timeDataArray[0].month;
            }
        }
        console.log("height is ", height);
        return (
            <Row>
                <Col span="24">
                    <Handle />
                    <div className="index-left" style={{ overflowX: "hidden" }}>
                        <Spin tip="Loading..." spinning={ui.isLoad.isLoadStatus} >
                            <h1>对比人数<span>{userNumberSize != 0 ? ` ${userNumberSize} ` : ""}</span></h1>
                            <MonthLeftShow ref={"monthLeftShowRef"} userNumberSize={userNumberSize} timeDataArray={timeDataArray} />
                            <ul
                                ref={"personsRef"}
                                className="life-person"
                                style={{ height: height, maxHeight: height, overflowX: "hidden" }}>
                                {Object.keys(loadData).map(key => {
                                    return (
                                        <PeoplePic pname={loadData[key].people.name}
                                            userNumber={loadData[key].people.userNumber}
                                            key={key}
                                        />);
                                })}
                            </ul>
                        </Spin>
                    </div>

                    {/* <div className="b-left" style={{ height: BOTTOM_HEIGHT }}>
                        <div style={{ marginTop: 21 }}>
                                描述
                         </div>
                    </div> */}

                    <div className="collect">
                        <Input
                            ref={"userNumberInput"}
                            size="small"
                            placeholder="请输入证件号码"
                            style={{ width: 160, margin: "0px 10px 0px 10px " }}
                            onPressEnter={(e) => { if (!ui.isLoad.isLoadStatus) { addUser(e.target.value) } }}
                        />
                        <Button type="primary" icon="search" size="small" onClick={
                            () => { if (!ui.isLoad.isLoadStatus) { addUser(this.refs.userNumberInput.refs.input.value) } }
                        }>添加</Button>
                        <Radio.Group value={data.filterData.radioValue} onChange={changeSameRadioFunc} style={{ marginLeft: 15 }}>
                            <Radio value={"all"}><b className="all">所有</b></Radio>
                            <Radio value={"sameDay"}><b className="sameDay">同日</b></Radio>
                            <Radio value={"sameTwo"}><b className="sameTwo">两两相同</b></Radio>
                            <Radio value={"sameAll"}><b className="sameAll">完全相同</b></Radio>
                        </Radio.Group>
                    </div>

                    {userNumberSize == 0 ?
                        null : (
                            <div
                                ref="timelineRef" className="collect-right" style={{ overflowX: "hidden" }} >
                                <BaseTimeLine key="baseLine" timeDataArray={timeDataArray} sameDay={sameDay} sameMd5={sameMd5} />
                            </div>
                        )
                    }
                    <div
                        className="life-view "
                        style={{ overflowY: "hidden" }}>
                        <Spin tip="Loading..." spinning={ui.isLoad.isLoadStatus} >
                            <div
                                ref={"personTraceRef"}
                                style={{
                                    minHeight: height,
                                    maxHeight: height,
                                    overflowY: "hidden"
                                }}>
                                <PersonTaces
                                    key="PersonTaces"
                                    data={data}
                                    height={height}
                                    showDetailFunc={showDetailFunc}
                                />
                            </div>
                        </Spin>
                    </div>
                    <div
                        className="b-right" height={BOTTOM_HEIGHT} style={{ overflowX: "hidden" }} >
                        <Row gutter={4} height={BOTTOM_HEIGHT}>
                            <Col span={12}>
                                <TraceAnaylse />
                                1
                                2
                                2
                                2
                            </Col>
                            <Col span={12}>
                                <HeatMap />
                            </Col>
                        </Row>

                    </div>
                    <DetailOption />
                </Col>
            </Row>
        )
    }
    //时间滚动条
}
//<TraceTable />


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
            dispatch(Actions.changeShowChart(value));
        },
        // changeTimeSelect: (value) => {
        //     dispatch(Actions.changeTimeSelect(value));
        // },
        showDetailFunc: (hbaseKey) => {
            dispatch(Actions.loadDetail(hbaseKey))
        },
        // moveTimeScroller: (value) => {
        //     //dispatch(Actions.scrollerTimeLine(value));
        // },
        changeSameRadioFunc: (e) => {
            dispatch(Actions.changeSameRadio(e.target.value))
        }
    }
}

//<Switch size="small" checked={ui.showChart} onChange={changeShowChart} />
export default connect(mapStateToProps, mapDispatchToProps
)(Content)

