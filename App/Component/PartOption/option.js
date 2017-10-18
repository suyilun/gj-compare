import * as Actions from '../../Actions/Actions';
import React from 'react';
import {connect} from 'react-redux'

const OptionShow = ({id, ischeck, optionName, optionClass,changeit})=>(
    <li id={id} className={ischeck?optionClass+' life-check':optionClass} onClick={changeit}>
        <p href="javascript:;">
            <i></i>
            <span>{optionName}(未定)</span>
        </p></li>
)

class Option extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //  let {dispatch} = this.props;
    }

    render() {
        let {dispatch,id, ischeck, optionName, optionClass} = this.props;
        return (
             <OptionShow 
                id={id}
                ischeck={ischeck}
                optionName={optionName}
                optionClass={optionClass}
                changeit={
                () => {
                    let action =Actions.checkOption(id);
                    // console.log("option我被点击了",action);
                    dispatch(action)
                }}
             />
        );
    }
}

function mapStateToProps(state) {
    return {
        dispatch: state.dispatch,
    }
}
export default connect(mapStateToProps
)(Option)