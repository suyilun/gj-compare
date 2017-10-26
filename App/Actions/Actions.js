import ActionTypes from './ActionTypes'
import { Map } from 'immutable'
import TraceCard from '../Component/PartOption/TraceCard'
import axios from 'axios'

/*以下为 Top 内容*/
//UI是否显示Top
export function showTop(isShow) {
    return {
        type: ActionTypes.UI.TOPSHOW,
        isShow: isShow
    }
}
//添加选项（飞机，火车）
export function addOption(optionName, optionClass) {
    return {
        type: ActionTypes.OPTION.ADD,
        optionName: optionName,
        optionClass: optionClass
    };
}

//改变选项（飞机，火车）选中状态
export function checkOption(optValue, optCheck) {
    return (dispatch, getState) => {
        const radioValue = getState().data.filterData.radioValue;
        const timeDataArray = calculteTimeDataArrayByChangeOptionAndRadio(getState, optValue, optCheck, radioValue);
        dispatch({
            type: ActionTypes.OPTION.CHANGE_CHECK,
            optValue,
            optCheck,
            timeDataArray
        });
    }
}

// //设置筛选人员身份证号
// export function setUserNumber(userNumber) {
//     return {
//         type: ActionTypes.FILTER.SET_USERNUMBER,
//         userNumber
//     };
// }

//设置筛选结束日期
export function setEndTime(endTime) {
    return {
        type: ActionTypes.FILTER.SET_END_TIME,
        endTime
    };
}

//设置筛选开始日期
export function setStartTime(startTime) {
    return {
        type: ActionTypes.FILTER.SET_START_TIME,
        startTime
    };
}

/*以下为content 内容*/

//UI是否显示Top
export function isLoadWait(loadStatus) {
    return {
        type: ActionTypes.UI.LOADWAIT,
        loadStatus
    }
}
function mappingData(userNumber, userDateMap) {
    return {
        type: ActionTypes.DATA.MAPPING,
        userNumber,
        userDateMap
    }
}
function descMd5Arr(md5Arr) {
    return {
        type: ActionTypes.DATA.MD5_COLLECTOR,
        md5Arr
    }
}
function descSameDay(getState, userTimeTypeDataArr) {
    const sameDay = calculteSameDay(getState, userTimeTypeDataArr);
    return {
        type: ActionTypes.DATA.DATE_COLLECTOR,
        sameDay
    }
}

function timeArrayToTimeDataArray(allTimes) {
    const daySortArray = allTimes.sort();
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

//栏目过滤选中,radio切换
const calculteTimeDataArrayByChangeOptionAndRadio = (getState, optValue, optCheck, radioValue) => {
    const dateType = getState().data.desc.date_type;
    const sameMd5 = getState().data.desc.sameMd5;//{md5{timer:1}}对象
    const sameDay = getState().data.desc.sameDay;//{day:{timer:1}}对象

    const filterData = getState().data.filterData;
    const allTimes = [];
    const showTypes = filterData.options.filter((option) => { return option.ischeck }).map((option) => { return option.value });
    if (optCheck) {
        showTypes.push(optValue);
    } else {
        _.remove(showTypes, function (n) {
            return n == optValue;
        })
    }
    Object.keys(dateType).map(userNumberKey => {
        if (userNumberKey != 'timeDataArray') {
            const timeTypeDataArrInState = dateType[userNumberKey];
            timeTypeDataArrInState.map(
                timeTypeData => {
                    //没有过滤操作
                    if (showTypes.indexOf(timeTypeData.catg) != -1) {
                        if (filterByRadio(radioValue, timeTypeData.day, timeTypeData.md5, sameDay, sameMd5)) {
                            allTimes.push(timeTypeData.time);
                        }
                    }
                }
            )
        }
    });
    return timeArrayToTimeDataArray(allTimes);

}

const filterByRadio = (radioValue, dayValue, md5Value, sameDay, sameMd5) => {
    switch (radioValue) {
        case "all": return true;
        case "sameDay":
            var result = sameDay[dayValue] > 1 ? true : false
            return result;
        case "same": return sameMd5[md5Value] > 1 ? true : false;
        default: console.error("radio值有错误", radioValue);
    }
}

//用户添加删除
// optValue, optCheck
// optValue, optCheck, radioValue
const calculteTimeDataArrayByUserChange = (getState, userNumber, userTimeTypeDataArr, isDeleteUser = false) => {

    const dataType = getState().data.desc.date_type;
    const filterData = getState().data.filterData;
    const radioValue = filterData.radioValue;
    //加入 radioValue属性
    const showTypes = filterData.options.filter((option) => { return option.ischeck }).map((option) => { return option.value });
    //重新计算sameDay
    const sameDay = calculteSameDay(getState, userTimeTypeDataArr, isDeleteUser);
    const sameMd5 = calculteSameMd5(getState, userTimeTypeDataArr, isDeleteUser);

    const allTimeTypeData = []

    Object.keys(dataType).map(userNumberKey => {
        if (userNumber != userNumberKey && dataType != 'timeDataArray') {
            const userTimeTypeDataArrInState = dataType[userNumberKey];
            userTimeTypeDataArrInState.map(
                timeTypeData => {
                    //没有过滤操作
                    if (showTypes.indexOf(timeTypeData.catg) != -1) {
                        allTimeTypeData.push(timeTypeData)
                        // if (filterByRadio(radioValue, timeTypeData.day, timeTypeData.md5, sameDay, sameMd5)) {
                        //     allTimes.push(timeTypeData.time);
                        // }
                    }
                }
            )
        }
        //{time,catg,show,sameKey}
    });

    userTimeTypeDataArr.map(timeTypeData => {
        if (showTypes.indexOf(timeTypeData.catg) != -1) {
            //if (filterByRadio(radioValue, timeTypeData.day, timeTypeData.md5, sameDay, sameMd5)) {
            allTimeTypeData.push(timeTypeData);
            //}
        }
    });

    const allTimes = allTimeTypeData.filter((timeTypeData) => {
        return (filterByRadio(radioValue, timeTypeData.day, timeTypeData.md5, sameDay, sameMd5));
    }).map((itemTypeData) => {
        return itemTypeData.time;
    })

    return timeArrayToTimeDataArray(allTimes);
}


//计算同一天
const calculteSameDay = (getState, userTimeTypeDataArr, isDeleteUser = false) => {
    const sameDay = _.cloneDeep(getState().data.desc.sameDay);
    const allDays = Object.keys(sameDay);
    let dayMap = {};
    if (!isDeleteUser) {
        //新增用户
        userTimeTypeDataArr.map(timeTypeData => {
            //按照天统计
            if (!dayMap[timeTypeData.day]) {
                if (allDays.indexOf(timeTypeData.day) != -1) {
                    //有数据
                    sameDay[timeTypeData.day] = sameDay[timeTypeData.day] + 1;
                } else {
                    //无数据
                    sameDay[timeTypeData.day] = 1
                }
            }
        });
    } else {
        //删除用户时
        userTimeTypeDataArr.map(timeTypeData => {
            if (!dayMap[timeTypeData.day]) {
                if (allDays.indexOf(timeTypeData.day) != -1) {
                    if (sameDay[timeTypeData.day] == 1) {
                        delete sameDay[timeTypeData.day];
                    } else {
                        sameDay[timeTypeData.day] = sameDay[timeTypeData.day] - 1;
                    }
                } else {
                    console.err("state.desc.sameDay中不存在" + timeTypeData.day + "数据");
                }
            }
        })
    }

    return sameDay;
}

//计算统一个md5
const calculteSameMd5 = (getState, timeTypeDataArr, isDeleteUser = false) => {
    const sameMd5 = _.cloneDeep(getState().data.desc.sameMd5);
    return sameMd5;
}



function descDateTypeArr(getState, userNumber, timeTypeDataArr) {
    const timeDataArray = calculteTimeDataArrayByUserChange(getState, userNumber, timeTypeDataArr);
    return {
        type: ActionTypes.DATA.DATE_TYPE_COLLECTOR,
        userNumber,
        timeTypeDataArr,
        timeDataArray,
    }
}

function deleteDesDateType(getState, userNumber) {
    const timeDataArray = calculteTimeDataArrayByUserChange(getState, userNumber, [], true);
    return {
        type: ActionTypes.DATA.DATE_TYPE_DELETE,
        userNumber,
        timeDataArray,
    }
}



function AddData(userNumber, userData) {
    return {
        type: ActionTypes.DATA.ADD_RECEIVE,
        userNumber,
        userData
    }
}

function iscontain(sfzh, mappings) {
    for (var key in mappings) {
        if (key == sfzh) {
            return true;
        }
    }
    return false;
}


//加载一个人的数据
//thunk action 创建函数
//虽然内部操作不同，但是你可以像创建action创建函数一样使用它，且内部可dispatch
export function loadData(sfzh) {
    //thunk middleware 知道如何处理函数
    //这里把 dispatch 方法通过参数的形式传给函数以此来让它自己也能dispatch action
    console.log("加载ajax....");
    return function (dispatch, getState) {
        //console.log(getState());//获取state getState是function 而getstate() 的结果是state
        //let sfzh=getState().filter.timeAndNumber.userNumber;
        if (sfzh.length != 18) {
            alert("请输入18位身份证号."); return;
        } else if (iscontain(sfzh, getState().data.mappings)) {
            alert("对不起该身份证已存在"); return;
        }
        //首次displaced：更新loadStatus 来加载进度条
        dispatch(isLoadWait(true));
        //TODO:旧请求地址/fwzy/do/track/data
        console.log("getState()", getState())
        return axios.get(`/json/${sfzh}.json`,
            {
                params: {
                    zjhm: sfzh,
                    kssj: getState().data.filterData.startTime.replace("-", "").replace("-", "") + "000000",
                    jssj: getState().data.filterData.endTime.replace("-", "").replace("-", "") + "999999",
                    lx: 'wb,lg,hc,ky,fj,zk,qt,yl'
                }
                , responseType: "json"
            }
        ).then(function (response) {
            console.log("异步获得的数据", response.data);
            const radioValue = getState().data.filterData.radioValue;
            let userData = response.data;
            let userNumber = userData.people.userNumber;
            let userTraces = userData.content;
            let userMd5Arr = []; let userDateMap = {}; let userTimeTypeDataArr = [];
            //let userDateArr = [];
            //用户时间类型数据

            //let userTimeTypeData = { userNumber: userNumber, timeTypeData: [] };
            userTraces.map((trace, index) => {
                //userDateArr.push(trace.traceTime);
                //如果是旅馆，需要进行拆分
                userMd5Arr.push(TraceCard.sameKeyGen(trace));
                userDateMap[trace.traceTime] = {
                    index: index,
                };
                //类型-时间-是否显示catg,time,show,sameKey,key判断是是否相同值
                userTimeTypeDataArr.push({
                    time: trace.traceTime,
                    day: String(trace.traceTime).substr(0, 8),
                    catg: trace.catg,
                    md5: TraceCard.sameKeyGen(trace),
                })
                //index-show  序号-是否显示
                //getState().data.filterData.getShowTypes().join(','),//
                //const hiddenTypes=getState().data.filterData.getHiddenTypes();
                //traceTime索引位置
            })
            //const userTimeLineData = getState().data.desc.date_type.userTimeLineData;
            //console.log("完成数据分类：",md5Arr)
            //时间轴
            dispatch(descDateTypeArr(getState, userNumber, userTimeTypeDataArr));
            //数据映射，加入过滤
            dispatch(mappingData(userNumber, userDateMap));
            //合并date，md5集合
            dispatch(descMd5Arr(userMd5Arr));
            dispatch(descSameDay(getState, userTimeTypeDataArr));

            //数据存储
            dispatch(AddData(userNumber, userData))
            //每次加载后初始化时间轴
            // dispatch(
            //     addUserTimeIndex(getState, userTimeLineData, userNumber, timeTypeDataArr, userDateArr, userMd5Arr, radioValue)
            // );
            //停止显示进度条

            //图标数据
            // dispatch(
            //     {
            //         type: ActionTypes.CHART.CHART_ADD_DATA,
            //         userNumber,
            //         userDateArr
            //     });
            dispatch(isLoadWait(false));
            console.log("更新后的state:", getState());
        })
            .catch(function (error) {
                console.log(error);
            });

    }

}

//给次ajax后用所有的加载数据去重新初始化时间轴
function deleteDescMd5(md5Arr) {
    return {
        type: ActionTypes.DATA.MA5_DELETE_COLLECTOR,
        md5Arr
    }
}

function deleteDescDate(dateArr) {
    return {
        type: ActionTypes.DATA.DATE_DELETE_COLLECTOR,
        dateArr
    }
}

function deleteMapping(userNumber) {
    return {
        type: ActionTypes.DATA.DELETE_MAPPING,
        userNumber
    }

}
function deleteData(userNumber) {
    return {
        type: ActionTypes.DATA.DATE_DELETE,
        userNumber
    }
}


export function changeChart() {
    return (dispatch, getState) => {
        const chartData = {}
        return {
            type: ActionTypes.CHART.CHART_INIT,
            chartData
        }
    }
}

export function changeShowChart(value) {
    return {
        type: ActionTypes.UI.CHANGE_SHOW_CHART,
        showChart: value
    }
}


//删除一个人的轨迹内容
export function dataCancel(userNumber) {
    return function (dispatch, getState) {
        const date_type = getState().data.desc.date_type;
        const md5Arr = date_type[userNumber].map((item) => { return item.md5 });
        const dateArr = date_type[userNumber].map((item) => { return item.time });
        //let mapping = getState().data.mappings;
        //删除desc
        //md5 构建
        //dateArray 构建

        dispatch(deleteDescMd5(md5Arr));
        dispatch(deleteDescDate(dateArr));
        dispatch(deleteDesDateType(getState, userNumber));

        //删除mapping
        dispatch(deleteMapping(userNumber))
        //删除数据
        dispatch(deleteData(userNumber))


        // dispatch(
        //     {
        //         type: ActionTypes.DATA.DEL_USER_TIME_INDEX,
        //         userNumber,
        //         radioValue,
        //     }
        // );
        //重新初始化时间轴
        //dispatch(initTimeIndex(getState().data.desc.date_area))
        dispatch({ type: ActionTypes.CHART.CHART_DELETE_DATA, userNumber })
        console.log("更新后的state:", getState());
    }
}

//详情是否显示
export function showDetail(isShow) {
    return {
        type: ActionTypes.UI.DETAILSHOW,
        isShow: isShow
    }
}
function loadDetailData(data) {
    return {
        type: ActionTypes.DATA.LOAD_ONETRACK_DETAIL,
        detailData: data
    }
}


//加载详情
export function loadDetail() {
    console.log("详情加载ajax....");
    return function (dispatch, getState) {
        //console.log(getState());//获取state getState是function 而getstate() 的结果是state
        //首次displaced：更新loadStatus 来加载进度条
        dispatch(isLoadWait(true))
        return axios.get('/json/test.json', { responseType: "json" })
            .then(function (response) {
                dispatch(isLoadWait(false))
                console.log("异步获得的数据", response.data);
                //详情数据存储
                dispatch(loadDetailData(response.data))
                //显示详情页面
                dispatch(showDetail(true))
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}


export function changeSameRadio(radioValue) {
    return (dispatch, getState) => {
        dispatch(isLoadWait(true));
        const timeDataArray = calculteTimeDataArrayByChangeOptionAndRadio(getState, undefined, undefined, radioValue);
        dispatch(isLoadWait(false));
        return dispatch({
            type: ActionTypes.FILTER.RADIO_CHANGE,
            radioValue,
            timeDataArray,
        })
    }
}






