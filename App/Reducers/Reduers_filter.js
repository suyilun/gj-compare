/*
filter redurce
 */
import ActionTypes from '../Actions/ActionTypes';

const date=new Date();

const filter=(state=initFilter,action) =>{
    //console.log("进入reduce-filterReduers:",action)
    return {
        timeAndNumber:timeAndNumber(state.timeAndNumber,action),
        options:option(state.options,action)
    }
    console.log("进入reduce-filterReduers11:",state);
}

/*
 初始化开始
 */
const initOption=[
    {optionName:'旅馆',optionClass:'lg-life',ischeck:true},
    {optionName:'飞机',optionClass:'fj-life',ischeck:true},
    {optionName:'火车',optionClass:'hc-life',ischeck:true},
    {optionName:'客运',optionClass:'ky-life',ischeck:true},
    {optionName:'医疗',optionClass:'yl-life',ischeck:true},
    {optionName:'暂口',optionClass:'zk-life',ischeck:true},
    {optionName:'网吧',optionClass:'wb-life',ischeck:true},
    {optionName:'其他',optionClass:'qt-life',ischeck:true}
]

const initFilter={
    timeAndNumber:{
        startTime:date.getFullYear()+"-01-01",
        endTime:date.getFullYear()+'-'+(date.getMonth()<10?"0"+date.getMonth():date.getMonth())+'-'+(date.getDate()<10?"0"+date.getDate():date.getDate()),
        userNumber:''
    },
    options:initOption
}
/*
 初始化结束
 */

//时间和身份证选项
function timeAndNumber(state ,action) {
    switch (action.type){
        case ActionTypes.FILTER.SET_START_TIME:
            return Object.assign({},state,{startTime:action.startTime});
        case ActionTypes.FILTER.SET_END_TIME:
            return Object.assign({},state,{endTime:action.endTime});
        case ActionTypes.FILTER.SET_USERNUMBER:
            return Object.assign({},state,{userNumber:action.userNumber});
        default:
            return state;
    }
}

function option(state,action){
    switch(action.type){
        case ActionTypes.OPTION.ADD:
            let newOne= state.slice(0);
            newOne.push( {optionName:action.optionName,optionClass:action.optionClass,ischeck:false});
            return newOne
        case ActionTypes.OPTION.CHANGE_CHECK:
            return state.map((option,index)=>{
                    if(action.index===index){
                        return Object.assign({},option,{ischeck:!option.ischeck})
                    }
                    return option
                }
            )
        default:
            return state;

    }
}
export default filter
