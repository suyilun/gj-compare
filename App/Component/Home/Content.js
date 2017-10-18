import { connect } from 'react-redux'
import React from 'react';
import Handle from '../PartOption/handle'
import { Row, Col, Input, Radio } from 'antd';
import * as Actions from '../../Actions/Actions';
import PeoplePic from '../PartOption/peoplePic';
import PeopleDataList from '../PartOption/TackContent/peopleDataList';
import OneDayIndex from '../PartOption/oneDayIndexOption';
import DetailOption from '../PartOption/detailOption';


const TimeLine = ({ timeLineDataMap }) => {
    return (
        <div>
            {timeLineDataMap.map((day => {
                <OneDayIndex day={day} dayData={timeLineDataMap[day].dayData} />
            }))}
        </div>
    );
}

const Peoples = () => { }

const PersonTaces = ({ height, mappings = {} }) => {
    let all = [];
    for (let key in mappings) {
        all.push(<PeopleDataList oneTrackDate={mappings[key].dateArr} userNumber={key} key={key} />)
    }
    return (
        <div>
            {all}
        </div>
    );
}


class Main extends React.Component {
    componentDidMount() {
        this.refs.personsRef.addEventListener('scroll', () => {
            this.refs.personTraceRef.scrollTop = this.refs.personsRef.scrollTop;
        });
        this.refs.personTraceRef.addEventListener('scroll', () => {
            console.log("personTraceRef 滚动---------%o", this.refs.personTraceRef.scrollLeft);
            this.refs.timelineRef.scrollLeft = this.refs.personTraceRef.scrollLeft;
        });
    }
    render() {
        const { height, data, addFunc, showPeoples, showTimeIndex, addUser } = this.props;
        return (
            <Row>
                <Handle />
                <Col span="2">
                    <div className="index-warp" style={{ height: height, overflowX: "hidden" }}>
                        <div className="index-left">
                            <h1>对比人数：<span>{Object.keys(data.loadData).length}</span></h1>
                            <ul
                                ref={"personsRef"}
                                className="life-person"
                                style={{ height: height - 41, maxHeight: height - 41, overflowX: "hidden" }}>
                                {Object.keys(data.loadData).map(key=>{
                                    return (<PeoplePic pname={data.loadData[key].people.name}
                                    index={data.loadData[key].people.userNumber}
                                    key={key}
                                    /> );
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="b-left">
                        <img src="images/month_change_ico.png"></img>
                        <input type="text" defaultValue="2017-05" />
                    </div>
                </Col>
                <Col span="22" >
                    <div className="collect">
                        <Input.Search
                            size="small"
                            placeholder="请输入证件号码"
                            style={{ width: 200, margin: "0px 10px 0px 10px " }}
                            onSearch={addUser}
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
                        <div
                            ref={"personTraceRef"}
                            style={{
                                minHeight: height - 41, maxHeight: height - 41,
                                overflowY: "hidden"
                            }}>
                            <PersonTaces mappings={data.mappings} height={height} />
                        </div>
                    </div>
                    <div
                        className="b-right" ref="timelineRef" style={{ overflowX: "hidden" }} >
                        <div className="life-time-contant max-content">
                            <div className="life-today life-end">
                                <p className="today-time life-radius">End</p>
                            </div>
                        </div>
                    </div>
                    <DetailOption />
                </Col>
            </Row>
        )
    }
}



class Content extends React.Component {
    render() {
        let { ui, data, showTimeIndex, addUser } = this.props;
        console.log("content改变：", this.props);
        //height:计算content的高度
        //console.log("是否显示Top",isTopShow);
        let height = {};
        if (ui.Top.showTop) {
            height = document.body.clientHeight - 162;
        } else {
            height = document.body.clientHeight - 85;
        }
        return (
            <Main
                height={height}
                data={data}
                addUser={addUser}
            />
        )
    }
}
function mapStateToProps(state) {
    return {
        data: state.data,
        ui:state.ui,
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
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps
)(Content)

