import ActionTypes from '../Actions/ActionTypes';


const data = (state = {}, action) => {
    //console.log("进入reduce-data:",action)
    return {
        desc: desc(state.desc, action),
        loadData: loadData(state.loadData, action),
        mappings: mappings(state.mappings, action),
        timeIndex: timeIndex(state.timeIndex, action),
        oneTrackDetail: oneTrackDetail(state.oneTrackDetail, action),
        chartData: chartData(state.chartData, action)
    }
}
//加载数据是选出相同的MD5和date
function desc(state = { md5_area: {}, date_area: {} }, action) {
    return {
        md5_area: md5_area(state.md5_area, action),
        date_area: date_area(state.date_area, action)
    }
}

function md5_area(state, action) {
    switch (action.type) {
        case ActionTypes.DATA.MD5_COLLECTOR:
            action.md5Arr.map((md5, index) => {
                let timer = state[md5] == undefined ? 1 : state[md5].timer + 1
                state[md5] = { "timer": timer }
            })
            return state
        case ActionTypes.DATA.MA5_DELETE_COLLECTOR:
            action.md5Arr.map((md5, index) => {
                let timer = state[md5] == undefined ? 0 : state[md5].timer - 1;
                if (timer == 0) {
                    delete state[md5]
                } else {
                    state[md5] = { "timer": timer }
                }
            })
            return state
        default:
            return state;
    }

}

function date_area(state, action) {
    switch (action.type) {
        case ActionTypes.DATA.DATE_COLLECTOR:
            action.dateArr.map((date, index) => {
                let timer = state[date] == undefined ? 1 : state[date].timer + 1
                state[date] = { "timer": timer }
            })
            return state
        case ActionTypes.DATA.DATE_DELETE_COLLECTOR:
            for (var key in action.dateArr) {
                let timer = state[key] == undefined ? 0 : state[key].timer - 1;
                if (timer == 0) {
                    delete state[key]
                } else {
                    state[key] = { "timer": timer }
                }
            }
            return state
        default:
            return state;
    }
}

//加载原始数据state
function loadData(state = {}, action) {
    switch (action.type) {
        case ActionTypes.DATA.ADD_RECEIVE:
            state[action.userNumber] = action.content
            return state;//由ajax添加数据值resource
        case ActionTypes.DATA.DATE_DELETE:
            delete state[action.userNumber]
            return Object.assign({}, state)
        default:
            return state;
    }


}
//加载数据时做映射
function mappings(state = {}, action) {
    switch (action.type) {
        case ActionTypes.DATA.MAPPING:
            state[action.userNumber] = { "md5Arr": action.md5Arr, "dateArr": action.dateArr }
            return state
        case ActionTypes.DATA.DELETE_MAPPING:
            delete state[action.userNumber]
            return Object.assign({}, state)
        default:
            return state;
    }
}

function dayArrayToTimeDataArray(dayArray) {
    const daySortArray = dayArray.sort();
    let nextTime; let nextMonth; let dayData = [];
    const timeDataArray = [];
    daySortArray.map((time, index) => {
        time = String(time);
        // console.log(index,time);
        if (nextTime == undefined || nextTime.substr(0, 8) != time.substr(0, 8)) { //判断是不是新的一天或最后一天
            // let dayData = oneDay;
            nextTime = time.substr(0, 8);
            nextMonth = time.substr(0, 6);
            dayData = [];
            timeDataArray.push({ month: nextMonth, day: nextTime, dayData: dayData })
        }
        dayData.push(time.substr(8, 2));
    })
    return timeDataArray;
}


//初始化时间轴
function timeIndex(state = { daySortArray: [], timeNow: null, timeDataArray: [], timePos: [] }, action) {
    switch (action.type) {
        case ActionTypes.DATA.INIT_TIME_INDEX:
            console.log("timeIndex action.descDataArea :%o", action.descDateArea)
            if (action.descDateArea && Object.keys(action.descDateArea).length > 0) {
                let dayArray = [];
                const daySortArray = Object.keys(action.descDateArea).map(key => {
                    return key;
                }).sort();
                const timeNow = state.timeNow || daySortArray[0].substr(0, 6);
                // if (state.timeNow != null) {
                //     timeNow = state.timeNow;
                // }
                const timeDataArray = dayArrayToTimeDataArray(daySortArray);
                return { daySortArray, timeNow, timeDataArray };
            } else {
                return { daySortArray: [], timeNow: null, timeDataArray: [] };
            }
        default:
            return state;
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
            const { dateArr, userNumber } = action;
            console.log("chartData dateArr :", dateArr)
            const timeDataArray = dayArrayToTimeDataArray(dateArr.sort());
            //[{month,day,dayData:[]}]
            return Object.assign({}, chartDataInState, { [userNumber]: timeDataArray });
        case ActionTypes.CHART.CHART_DELETE_DATA:
            delete chartDataInState[action.userNumber];
            return chartDataInState;
        default:
            return chartDataInState;
    }
}


export default data

