import { connect } from 'react-redux'
import React from 'react';
import * as Actions from '../../Actions/Actions';
import { Row, Col, DatePicker, Button } from 'antd';
import moment from 'moment';


const Option = ({ ischeck, optionClass, optionName, checkOption }) => (
    <li className={ischeck ? optionClass + ' life-check' : optionClass} onClick={checkOption}>
        <p href="javascript:;">
            <i></i>
            <span>{optionName}(未定)</span>
        </p>
    </li>
)

class Head extends React.Component {
    render() {
        //console.log("top改变:",this.props)
        let { topShow, filterData, setStartTime, setEndTime, checkOption } = this.props;
        const { options, startTime, endTime, } = filterData;
        return (
            <Row height="40px" className="top" style={{ display: topShow ? 'block' : 'none' }}>
                <Col span="16">
                    <a href="javascript:;" className="logo">
                        <img src="images/index-logo02.png"></img>
                    </a>
                    <ul className="life-class">
                        {
                            options.map((option, index) => {
                                return (
                                    <Option
                                        ischeck={option.ischeck}
                                        optionName={option.optionName}
                                        optionClass={option.optionClass}
                                        checkOption={() => { checkOption(option.value, !option.ischeck) }}
                                    />)
                            })
                        }
                    </ul>
                </Col>
                <Col span="8">
                    <div className={"searchAgain"}>
                        <DatePicker defaultValue={moment(startTime, 'YYYY-MM-DD')} onChange={(date, dateString) => { setStartTime(dateString) }} />
                        -
                         <DatePicker defaultValue={moment(endTime, 'YYYY-MM-DD')} onChange={(date, dateString) => { setEndTime(dateString) }} />
                        <Button icon="user" style={{ backgroundColor: "#fd6461" }}>重新比对</Button>
                    </div>
                </Col>
            </Row>
        )
    }
}
function mapStateToProps(state) {
    return {
        filterData: state.data.filterData,
        topShow: state.ui.Top.showTop
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setStartTime: (date) => { dispatch(Actions.setStartTime(date)); },
        setEndTime: (date) => { dispatch(Actions.setEndTime(date)); },
        checkOption: (optValue, optCheck) => { dispatch(Actions.checkOption(optValue, optCheck)); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps
)(Head)

