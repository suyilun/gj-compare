import * as Actions from '../../Actions/Actions';
import React from 'react';
import {connect} from 'react-redux'

const PeopleShow = ({pname,cancel,index})=>(
    <li><a href="javascript:;">
        <p>
            {/*<img src="images/demo_header.png"></img>*/}
            <img src={"/big-data-interface/zhaopian/A"+index}></img>
            <strong>{pname}</strong>
        </p>
        <b>{index}</b>
        <i onClick={()=>{cancel(index)}}>
            <span className="life-tb"></span>
            <span className="life-lr"></span>
        </i>
    </a></li>
)

class PeoplePic extends React.Component {

    constructor(props) {
        super(props);
        console.log("people头像初始化：", props);// count: 0, text: undefined, user: undefined
    }

    render() {
        let {pname,cancel,index} = this.props;
        console.log("开始渲染People")
        return (
             <PeopleShow pname={pname}
                         index={index}
                         cancel={cancel}
             />
        );
    }
}
function mapStateToProps(){
    return{

    }
}
function mapDispatchToProps(dispatch) {
    return{
        cancel:(data)=>{
                        console.log("data---",data);
                        dispatch(Actions.dataCancel(data))
             }
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(PeoplePic)
