import ActionTypes from './ActionTypes'
import { Map } from 'immutable'
import TraceCard from '../Component/PartOption/TraceCard'
import axios from 'axios'
import { getScaleFnFromScaleObject } from 'react-vis/dist/utils/scales-utils';

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
function mapping(userNumber, userDateMap) {
    return {
        type: ActionTypes.DATA.MAPPING,
        userNumber,
        userDateMap
    }
}

function descSameDay(getState, userTimeTypeDataArr) {
    const sameDay = calculteSameDay(getState, userTimeTypeDataArr);
    return {
        type: ActionTypes.DATA.DATE_DELETE,
        sameDay
    }
}

function descSameMd5(getState, userTimeTypeDataArr) {
    const sameMd5 = calculteSameMd5(getState, userTimeTypeDataArr);
    return {
        type: ActionTypes.DATA.MD5_COLLECTOR,
        sameMd5
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
            return sameDay[dayValue] > 1;
        case "same":
            return sameMd5[md5Value] > 1;
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
                    }
                }
            )
        }
        //{time,catg,show,sameKey}
    });

    userTimeTypeDataArr.map(timeTypeData => {
        if (showTypes.indexOf(timeTypeData.catg) != -1) {
            allTimeTypeData.push(timeTypeData);
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
                        if (sameDay[timeTypeData.day]) {
                            sameDay[timeTypeData.day] = sameDay[timeTypeData.day] - 1;
                        }
                    }
                } else {
                    console.err("state.desc.sameDay中不存在日期为：" + timeTypeData.day + "数据");
                }
            }
        })
    }
    return sameDay;
}

//计算统一个md5
const calculteSameMd5 = (getState, userTimeTypeDataArr, isDeleteUser = false) => {
    const sameMd5 = _.cloneDeep(getState().data.desc.sameMd5);
    //md5;
    if (!isDeleteUser) {
        //新增用户
        userTimeTypeDataArr.map(timeTypeData => {
            if (typeof sameMd5[timeTypeData.md5] == "undefined") {
                sameMd5[timeTypeData.md5] = 1;
            } else {
                sameMd5[timeTypeData.md5] = sameMd5[timeTypeData.md5] + 1;
            }
        })
    } else {
        userTimeTypeDataArr.map(timeTypeData => {
            if (typeof sameMd5[timeTypeData.md5] == "undefined") {
                console.log("md5 键不存在" + timeTypeData.md5);
            } else {
                if (sameMd5[timeTypeData.md5] == 1) {
                    delete sameMd5[timeTypeData.md5];
                } else {
                    sameMd5[timeTypeData.md5] = sameMd5[timeTypeData.md5] - 1;
                }
            }
        })
    }
    return sameMd5;
}


const calculteCatgSum = (getState, userTimeTypeDataArr, isDeleteUser = false) => {
    const sumCatg = _.cloneDeep(getState().data.desc.sumCatg);
    const radioValue = getState().data.filterData.radioValue;

    const sameDay = calculteSameDay(getState, userTimeTypeDataArr, isDeleteUser);
    const sameMd5 = calculteSameMd5(getState, userTimeTypeDataArr, isDeleteUser);

    if (!isDeleteUser) {
        //新增用户
        userTimeTypeDataArr.map(timeTypeData => {
            if (filterByRadio(radioValue, timeTypeData.day, timeTypeData.md5, sameDay, sameMd5)) {
                if (typeof sumCatg[timeTypeData.catg] == 'undefined') {
                    sumCatg[timeTypeData.catg] = 1;
                } else {
                    sumCatg[timeTypeData.catg] = sumCatg[timeTypeData.catg] + 1;
                }
            }
        })
    } else {
        userTimeTypeDataArr.map(timeTypeData => {
            if (filterByRadio(radioValue, timeTypeData.day, timeTypeData.md5, sameDay, sameMd5)) {
                if (typeof sumCatg[timeTypeData.catg] == 'undefined') {
                    sumCatg[timeTypeData.catg] = 0;
                } else {
                    sumCatg[timeTypeData.catg] = sumCatg[timeTypeData.catg] - 1;
                }
            }
        })
    }
    return sumCatg;
}


const calculteCatgSumRadioChange = (getState, radioValue) => {
    //const sumCatg = _.cloneDeep(getState().data.desc.sumCatg);
    const dateType = getState().data.desc.date_type;
    const sameMd5 = getState().data.desc.sameMd5;//{md5{timer:1}}对象
    const sameDay = getState().data.desc.sameDay;//{day:{timer:1}}对象
    //const filterData = getState().data.filterData;
    const sumCatg = {};
    Object.keys(dateType).map(userNumberKey => {
        if (userNumberKey != 'timeDataArray') {
            const timeTypeDataArrInState = dateType[userNumberKey];
            timeTypeDataArrInState.map(timeTypeData => {
                if (filterByRadio(radioValue, timeTypeData.day, timeTypeData.md5, sameDay, sameMd5)) {
                    if (typeof sumCatg[timeTypeData.catg] == 'undefined') {
                        sumCatg[timeTypeData.catg] = 1;
                    } else {
                        sumCatg[timeTypeData.catg] = sumCatg[timeTypeData.catg] + 1;
                    }
                }
            })
        }
    })
    return sumCatg;
}

function descSumCatg(getState, timeTypeDataArr) {
    const sumCatg = calculteCatgSum(getState, timeTypeDataArr);
    return {
        type: ActionTypes.DATA.SUMCATG_COLLECTOR,
        sumCatg,
    }
}

function deleteDescSumCatg(getState, timeTypeDataArr) {
    const sumCatg = calculteCatgSum(getState, timeTypeDataArr, true);
    return {
        type: ActionTypes.DATA.SUMCATG_DELETE,
        sumCatg,
    }
}

function descDateTypeArr(getState, userNumber, userTimeTypeDataArr) {
    const timeDataArray = calculteTimeDataArrayByUserChange(getState, userNumber, userTimeTypeDataArr);
    return {
        type: ActionTypes.DATA.DATE_TYPE_COLLECTOR,
        userNumber,
        userTimeTypeDataArr,
        timeDataArray,
    }
}

function deleteDescDateTypeArr(getState, userNumber) {
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
                //index-show  序号-是否显示
                userDateMap[trace.traceTime] = {
                    index: index,
                };
                if(!trace.md5){
                    trace.md5=TraceCard.sameKeyGen(trace);//生成MD5
                }
                //类型-时间-是否显示catg,time,show,sameKey,key判断是是否相同值
                userTimeTypeDataArr.push({
                    time: trace.traceTime,
                    day: String(trace.traceTime).substr(0, 8),
                    catg: trace.catg,
                    md5: trace.md5,
                })
            })

            //时间轴
            dispatch(descDateTypeArr(getState, userNumber, userTimeTypeDataArr));
            //合计
            dispatch(descSumCatg(getState, userTimeTypeDataArr));//需要在descSameDay，descSameDay之前实现
            //数据映射
            dispatch(mapping(userNumber, userDateMap));
            //同日
            dispatch(descSameDay(getState, userTimeTypeDataArr));
            //同md5
            dispatch(descSameMd5(getState, userTimeTypeDataArr));
            //数据存储
            dispatch(AddData(userNumber, userData));


            //图标数据
            // dispatch(
            //     {
            //         type: ActionTypes.CHART.CHART_ADD_DATA,
            //         userNumber,
            //         userDateArr
            //     });
            //停止显示进度条
            dispatch(isLoadWait(false));
            console.log("更新后的state:", getState());
        })
            .catch(function (error) {
                console.log(error);
            });

    }

}

//给次ajax后用所有的加载数据去重新初始化时间轴
// function deleteDescMd5(md5Arr) {
//     return {
//         type: ActionTypes.DATA.MA5_DELETE_COLLECTOR,
//         md5Arr
//     }
// }

// function deleteDescDate(dateArr) {
//     return {
//         type: ActionTypes.DATA.DATE_DELETE_COLLECTOR,
//         dateArr
//     }
// }

function deleteMapping(userNumber) {
    return {
        type: ActionTypes.DATA.DELETE_MAPPING,
        userNumber
    }
}
function deleteData(userNumber) {
    return {
        type: ActionTypes.DATA.DATA_DELETE,
        userNumber
    }
}

function deleteDescSameDay(getState, userTimeTypeDataArr) {
    const sameDay = calculteSameDay(getState, userTimeTypeDataArr, true);
    return {
        type: ActionTypes.DATA.DATE_DELETE,
        sameDay
    }
}

function deleteDescSameMd5(getState, userTimeTypeDataArr) {
    const sameMd5 = calculteSameMd5(getState, userTimeTypeDataArr, true);
    return {
        type: ActionTypes.DATA.MD5_DELETE,
        sameMd5
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
        const dateType = getState().data.desc.date_type;
        // const md5Arr = date_type[userNumber].map((item) => { return item.md5 });
        // const dateArr = date_type[userNumber].map((item) => { return item.time });
        const userTimeTypeDataArr = dateType[userNumber];

        //时间轴处理
        dispatch(deleteDescDateTypeArr(getState, userNumber));
        //删除mapping
        dispatch(deleteMapping(userNumber));
        dispatch(deleteDescSumCatg(getState, userTimeTypeDataArr));
        dispatch(deleteDescSameDay(getState, userTimeTypeDataArr));
        dispatch(deleteDescSameMd5(getState, userTimeTypeDataArr));

        //dispatch(deleteMapping(userNumber));
        //删除数据
        dispatch(deleteData(userNumber))

        // dispatch({ type: ActionTypes.CHART.CHART_DELETE_DATA, userNumber })
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
        const sumCatg = calculteCatgSumRadioChange(getState, radioValue);

        dispatch(isLoadWait(false));
        return dispatch({
            type: ActionTypes.FILTER.RADIO_CHANGE,
            radioValue,
            timeDataArray,
            sumCatg,
        })
    }
}

export function changeTimeSelect(value){
    return (dispatch,getState)=>{
        return dispatch({
            type:ActionTypes.DATA.CHANGE_TIME_SELECT,
            timeChoose:value,
        });
    }
}






