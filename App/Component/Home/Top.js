import {connect} from 'react-redux'
import React from 'react';
import * as Actions from '../../Actions/Actions';
import Option from '../PartOption/option'
import {Row, Col, DatePicker,Button} from 'antd';
import moment  from 'moment';

const Top = ({showTop,setStartTime,setEndTime,renderFun, optionlist, starttime, endtime}) => (
    <Row height="40px" className="top" style={{display:showTop?'block':'none'}}>
        <Col span="16">
            <a href="javascript:;" className="logo">
                <img src="images/index-logo02.png"></img>
            </a>
            <ul className="life-class">
                {renderFun(optionlist)}
            </ul>
        </Col>
        <Col span="8">
            <div className={"searchAgain"}>
                <DatePicker defaultValue={moment(starttime,'YYYY-MM-DD')} onChange={(date,dateString)=>{setStartTime(dateString)}} />
                    -
                <DatePicker defaultValue={moment(endtime,'YYYY-MM-DD')} onChange={(date,dateString)=>{setEndTime(dateString)}} /> 
                <Button  icon="user" style={{backgroundColor:"#fd6461"}}>重新比对</Button>
            </div> 
        </Col>
    </Row>
)

class Head extends React.Component {
    constructor(props) {
        super(props);
        this.renderOptions = this.renderOptions.bind(this)//内部function绑定
    }

    renderOptions(optionlist) {
        return optionlist.map((option, index)=> {
            return (<Option
                key={index}
                id={index}
                ischeck={option.ischeck}
                optionName={option.optionName}
                optionClass={option.optionClass}
            />)
        });
    }

    render() {
        //console.log("top改变:",this.props)
        let {topShow,filter,setStartTime,setEndTime} = this.props;
        return (<Top
            showTop={topShow}
            renderFun={this.renderOptions}
            optionlist={filter.options}
            starttime={filter.timeAndNumber.startTime}
            endtime={filter.timeAndNumber.endTime}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
        />
        )
    }
}
function mapStateToProps(state) {
    return {
        filter: state.filter,
        topShow:state.ui.Top.showTop
    }
}

function mapDispatchToProps(dispatch) {
    return{
        setStartTime:(date)=>{dispatch(Actions.setStartTime(date))},
        setEndTime:(date)=>{dispatch(Actions.setEndTime(date))}
    }
}

export default connect(mapStateToProps,mapDispatchToProps
)(Head)

