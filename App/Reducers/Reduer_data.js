import ActionTypes from '../Actions/ActionTypes';


const initOption = [
    { optionName: '旅馆', optionClass: 'lg-life', ischeck: true, value: 'lg' },
    { optionName: '飞机', optionClass: 'fj-life', ischeck: true, value: 'fj' },
    { optionName: '火车', optionClass: 'hc-life', ischeck: true, value: 'hc' },
    { optionName: '客运', optionClass: 'ky-life', ischeck: true, value: 'ky' },
    { optionName: '医疗', optionClass: 'yl-life', ischeck: true, value: 'yl' },
    { optionName: '暂口', optionClass: 'zk-life', ischeck: true, value: 'zk' },
    { optionName: '网吧', optionClass: 'wb-life', ischeck: true, value: 'wb' },
    { optionName: '其他', optionClass: 'qt-life', ischeck: true, value: 'qt' },
]

const data = (state = {}, action) => {
    //console.log("进入reduce-data:",action)
    return {
        desc: desc(state.desc, action),
        loadData: loadData(state.loadData, action),
        mappings: mappings(state.mappings, action),
        timeIndex: timeIndex(state.timeIndex, action),
        oneTrackDetail: oneTrackDetail(state.oneTrackDetail, action),
        chartData: chartData(state.chartData, action),
        filterData: filterData(state.filterData, action),
    }
}

const initFilter = () => {
    const date = new Date();
    return {
        startTime: date.getFullYear() + "-01-01",
        endTime: `${date.getFullYear()}-${date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`,
        userNumber: '',
        options: initOption,
        getShowTypes: function () {
            return this.options.filter((option) => { return option.ischeck }).map((option) => { return option.value })
        }
    }
}


//加载数据是选出相同的MD5和date
function desc(descInState = { md5_area: {}, date_area: {} }, action) {
    return {
        md5_area: md5_area(descInState.md5_area, action),
        date_area: date_area(descInState.date_area, action)
    };
}


function md5_area(state, action) {
    switch (action.type) {
        case ActionTypes.DATA.MD5_COLLECTOR:
            action.md5Arr.map((md5, index) => {
                let timer = state[md5] == undefined ? 1 : state[md5].timer + 1;
                state[md5] = { "timer": timer };
            })
            return state
        case ActionTypes.DATA.MA5_DELETE_COLLECTOR:
            action.md5Arr.map((md5, index) => {
                let timer = state[md5] == undefined ? 0 : state[md5].timer - 1;
                if (timer == 0) {
                    delete state[md5];
                } else {
                    state[md5] = { "timer": timer };
                }
            })
            return state;
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
function loadData(loadDataInState = {}, action) {
    switch (action.type) {
        case ActionTypes.DATA.ADD_RECEIVE:
            loadDataInState[action.userNumber] = action.content;
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
    const { type, userNumber, md5Arr, userDateMap, mappings } = action;
    switch (type) {
        case ActionTypes.DATA.MAPPING:
            mappingsInState[userNumber] = { "md5Arr": md5Arr, "userDateMap": userDateMap };
            return mappingsInState;
        case ActionTypes.DATA.DELETE_MAPPING:
            delete mappingsInState[userNumber];
            return Object.assign({}, mappingsInState);
        case ActionTypes.OPTION.CHANGE_CHECK:
            let newMappingsInState = {};
            Object.keys(mappings).map(userNumberKey => {
                newMappingsInState[userNumberKey]={userDateMap: mappings[userNumberKey]};
                if (mappingsInState[userNumberKey]) {
                    newMappingsInState[userNumberKey].md5Arr;
                }
            })
            return newMappingsInState;
        default:
            return mappingsInState;
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
        //过滤type
        dayData.push(time);
    })
    return timeDataArray;
}


//初始化时间轴
function timeIndex(
    timeIndexInState = {
        daySortArray: [],
        timeNow: null,
        timeDataArray: [],
        timePos: [],
        userTimeTypeDataMap: {}
    }
    , action) {
    const handlerUserTimeTypeDataMap = (userTimeTypeDataMap, showTypes) => {
        // const types = filterData.getShowTypes();//所有需要显示的类型
        const allTimes = [];
        Object.keys(userTimeTypeDataMap).map(userNumber => {
            const timeTypeData = userTimeTypeDataMap[userNumber].timeTypeData;
            timeTypeData.map(
                timeTypeDataItem => {
                    if (!false) {//TODO判断是否过滤 filterData
                        allTimes.push(timeTypeDataItem.time);
                    }
                }
            )
            //{time:content.online_time,track_type:content.track_type,show:true}
        });
        const allTimeSort = allTimes.sort();
        return { timeDataArray: dayArrayToTimeDataArray(allTimeSort) };
    }
    const { type, userTimeTypeData, userNumber } = action
    const { userTimeTypeDataMap } = timeIndexInState
    switch (type) {
        case ActionTypes.DATA.ADD_USER_TIME_INDEX:
            userTimeTypeDataMap[userTimeTypeData.userNumber] = userTimeTypeData;
            return Object.assign({}, timeIndexInState,
                handlerUserTimeTypeDataMap(userTimeTypeDataMap));
        case ActionTypes.DATA.DEL_USER_TIME_INDEX:
            delete userTimeTypeDataMap[userNumber];
            return Object.assign({}, timeIndexInState,
                handlerUserTimeTypeDataMap(userTimeTypeDataMap));
        default:
            return timeIndexInState;

        // Object.keys(userDateTypeConfigMap).map((userNumber,index)=>{
        //     const userDateTypeConfig=userDateTypeConfigMap[userNumber];
        // })
        // console.log("timeIndex action.descDataArea :%o", action.descDateArea)
        //     if (action.descDateArea && Object.keys(action.descDateArea).length > 0) {
        //         let dayArray = [];
        //         const daySortArray = Object.keys(action.descDateArea).map(key => {
        //             return key;
        //         }).sort();
        //         const timeNow = timeIndexInState.timeNow || daySortArray[0].substr(0, 6);
        //         // if (state.timeNow != null) {
        //         //     timeNow = state.timeNow;
        //         // }
        //         const timeDataArray = dayArrayToTimeDataArray(daySortArray);
        //         // timeDataArray.push({ month: nextMonth, day: nextTime, dayData: dayData })
        //         return { daySortArray, timeNow, timeDataArray };
        //     } else {
        //         return { daySortArray: [], timeNow: null, timeDataArray: [] };
        //     }
        // default:
        //     return timeIndexInState;
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
        default:
            return filterInState;
    }
}

export default data;

