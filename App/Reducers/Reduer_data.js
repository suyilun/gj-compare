import _ from 'lodash';
import ActionTypes from '../Actions/ActionTypes';
import TraceCard from '../Component/PartOption/TraceCard';
import axios from 'axios';

const data = (state = {}, action) => {
    //console.log("进入reduce-data:",action)
    return {
        desc: desc(state.desc, action),
        loadData: loadData(state.loadData, action),
        mappings: mappings(state.mappings, action),
        oneTrackDetail: oneTrackDetail(state.oneTrackDetail, action),
        chartData: chartData(state.chartData, action),
        filterData: filterData(state.filterData, action),
    }
}



const initFilter = () => {
    const date = new Date();
    // optionName: '旅馆', optionClass: 'lg-life', ischeck: true, value: 'lg',
    // dataTypes: ['lg', 'lg_zj']
    return {
        startTime: date.getFullYear() + "-01-01",
        endTime: `${date.getFullYear()}-${date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`,
        userNumber: '',
        options: TraceCard.typeOptions,
        radioValue: 'all',
    };

}


//加载数据是选出相同的MD5和date
function desc(descInState = { sameDay: {}, sameMd5: {}, date_type: { timeDataArray: [] } }, action) {
    return {
        sameDay: sameDayFun(descInState.sameDay, action),
        sameMd5: sameMd5Fun(descInState.sameMd5, action),
        date_type: date_type(descInState.date_type, action)
    };
}

function sameMd5Fun(state, action) {
    const { type, sameMd5 } = action;
    switch (type) {
        case ActionTypes.DATA.MD5_COLLECTOR:
        case ActionTypes.DATA.MA5_DELETE_COLLECTOR:
            return sameMd5;
        default: return state;
    }



    // switch (action.type) {
    //     case ActionTypes.DATA.MD5_COLLECTOR:
    //         action.md5Arr.map((md5, index) => {
    //             let timer = state[md5] == undefined ? 1 : state[md5].timer + 1;
    //             state[md5] = { "timer": timer };
    //         })
    //         return state
    //     case ActionTypes.DATA.MA5_DELETE_COLLECTOR:
    //         action.md5Arr.map((md5, index) => {
    //             let timer = state[md5] == undefined ? 0 : state[md5].timer - 1;
    //             if (timer == 0) {
    //                 delete state[md5];
    //             } else {
    //                 state[md5] = { "timer": timer };
    //             }
    //         })
    //         return state;
    //     default:
    //         return state;
    // }
}
//同日分析
function sameDayFun(state = {}, action) {
    const { type, sameDay } = action;
    switch (action.type) {
        case ActionTypes.DATA.DATE_COLLECTOR:
        case ActionTypes.DATA.DATE_DELETE_COLLECTOR:
            return sameDay;
        default:
            return state;
    }
    // const stateClone = _.cloneDeep(state);
    // switch (action.type) {
    //     case ActionTypes.DATA.DATE_COLLECTOR:
    //         //添加用户
    //         action.dateArr.map((date, index) => {
    //             let timer = stateClone[date] == undefined ? 1 : stateClone[date].timer + 1
    //             stateClone[date] = { "timer": timer }
    //         })
    //         return stateClone;
    //     case ActionTypes.DATA.DATE_DELETE_COLLECTOR:
    //         action.dateArr.map((item) => {
    //             let timer = stateClone[item] == undefined ? 0 : stateClone[item].timer - 1;
    //             if (timer == 0) {
    //                 delete stateClone[item]
    //             } else {
    //                 stateClone[item] = { "timer": timer }
    //             }
    //         })
    //         return stateClone
    //     default:
    //         return state;
    // }
}

//data_type={身份证:时间数据,timeDataArray:时间轴}
function date_type(state, action) {
    const { userNumber, timeTypeDataArr, timeDataArray } = action;
    switch (action.type) {
        case ActionTypes.DATA.DATE_TYPE_COLLECTOR:
            return Object.assign(state, { [userNumber]: timeTypeDataArr }, { timeDataArray });
        case ActionTypes.DATA.DATE_TYPE_DELETE:
            const stateClone = _.cloneDeep(state);
            delete stateClone[userNumber];
            return Object.assign(stateClone, { timeDataArray });
        case ActionTypes.OPTION.CHANGE_CHECK:
        case ActionTypes.FILTER.RADIO_CHANGE:
            return Object.assign(state, { timeDataArray });
        default: return state;
    }
}

//加载原始数据state
function loadData(loadDataInState = {}, action) {
    switch (action.type) {
        case ActionTypes.DATA.ADD_RECEIVE:
            loadDataInState[action.userNumber] = action.userData;
            return loadDataInState;//由ajax添加数据值resource
        case ActionTypes.DATA.DATE_DELETE:
            delete loadDataInState[action.userNumber];
            return Object.assign({}, loadDataInState);
        default:
            return loadDataInState;
    }
}

//加载数据时做映射
function mappings(mappingsInState = {}, action) {
    const { type, userNumber, userDateMap } = action;
    switch (type) {
        case ActionTypes.DATA.MAPPING:
            return Object.assign(mappingsInState, { [userNumber]: userDateMap });
        case ActionTypes.DATA.DELETE_MAPPING:
            //delete mappingsInState[userNumber];
            const clone = _.cloneDeep(mappingsInState);
            delete clone[userNumber];
            return clone;
        default:
            return mappingsInState;
    }
}



function oneTrackDetail(state = {}, action) {
    switch (action.type) {
        case ActionTypes.DATA.LOAD_ONETRACK_DETAIL:
            return Object.assign({}, state, action.detailData);
        default:
            return state;
    }

}


function chartData(chartDataInState = {}, action) {
    switch (action.type) {
        case ActionTypes.CHART.CHART_ADD_DATA:
            const { userDateArr, userNumber } = action;
            console.log("chartData dateArr :", userDateArr)
            //[{month,day,dayData:[]}]
            //const timeDataArray = dayArrayToTimeDataArray(userDateArr.sort());
            return chartDataInState;
        //return Object.assign({}, chartDataInState, { [userNumber]: timeDataArray });
        case ActionTypes.CHART.CHART_DELETE_DATA:
            delete chartDataInState[action.userNumber];
            return chartDataInState;
        default:
            return chartDataInState;
    }
}

//--------------顶部删选--------------------

const filterData = (filterInState = initFilter(), action) => {
    //console.log("进入reduce-filterReduers:",action)
    console.log("filterInState ", filterInState, action)
    switch (action.type) {
        case ActionTypes.FILTER.SET_START_TIME:
            return Object.assign(filterInState, { startTime: action.startTime });
        case ActionTypes.FILTER.SET_END_TIME:
            return Object.assign({}, filterInState, { endTime: action.endTime });
        case ActionTypes.FILTER.SET_USERNUMBER:
            return Object.assign({}, filterInState, { userNumber: action.userNumber });
        case ActionTypes.OPTION.CHANGE_CHECK:
            const { options } = filterInState;
            console.log("action.optValue,", action.optValue, action.optCheck)
            options.map((item) => {
                if (action.optValue === item.value) {
                    item.ischeck = action.optCheck;
                }
            });
            return Object.assign({}, filterInState, { options });
        case ActionTypes.FILTER.RADIO_CHANGE:
            const { radioValue } = action;
            return Object.assign({}, filterInState, { radioValue });
        default:
            return filterInState;
    }
}

export default data;

