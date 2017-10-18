import ActionTypes from './ActionTypes'
import {Map} from 'immutable'
import axios from 'axios'


/*以下为 Top 内容*/
//UI是否显示Top
export function showTop(isShow){
    return {
        type:ActionTypes.UI.TOPSHOW,
        isShow:isShow
    }
}
//添加选项（飞机，火车）
export function addOption(optionName,optionClass) {
    return {
        type: ActionTypes.OPTION.ADD,
        optionName:optionName,
        optionClass:optionClass
    };
}
//改变选项（飞机，火车）选中状态
export function checkOption(index) {
    return {
        type:ActionTypes.OPTION.CHANGE_CHECK,
        index
    };
}

//设置筛选人员身份证号
export function setUserNumber(userNumber) {
    return {
        type:ActionTypes.FILTER.SET_USERNUMBER,
        userNumber
    };
}

//设置筛选结束日期
export function setEndTime(endTime) {
    return {
        type:ActionTypes.FILTER.SET_END_TIME,
        endTime
    };
}

//设置筛选开始日期
export function setStartTime(startTime) {
    return {
        type:ActionTypes.FILTER.SET_START_TIME,
        startTime
    };
}

/*以下为content 内容*/

//UI是否显示Top
export function isLoadWait(loadStatus){
    return {
        type:ActionTypes.UI.LOADWAIT,
        loadStatus
    }
}
function mappingData(userNumber,md5Arr,dateArr){
    return {
        type:ActionTypes.DATA.MAPPING,
        userNumber,
        md5Arr,
        dateArr
    }
}
function descMd5Arr(md5Arr){
    return {
        type:ActionTypes.DATA.MD5_COLLECTOR,
        md5Arr
    }
}
function descDateArr(dateArr){
    return {
        type:ActionTypes.DATA.DATE_COLLECTOR,
        dateArr
    }
}

function AddData(userNumber,content){
    return {
        type:ActionTypes.DATA.ADD_RECEIVE,
        userNumber,
        content
    }
}

function iscontain(sfzh,mappings){
    for(var key in mappings){
      if(key==sfzh){
          return true;
      }
    }
    return false;
}

//加载一个人的数据
//thunk action 创建函数
//虽然内部操作不同，但是你可以像创建action创建函数一样使用它，且内部可dispatch
export  function loadData(sfzh){
    //thunk middleware 知道如何处理函数
    //这里把 dispatch 方法通过参数的形式传给函数以此来让它自己也能dispatch action
    console.log("加载ajax....");
    return function (dispatch,getState){
        //console.log(getState());//获取state getState是function 而getstate() 的结果是state
        //let sfzh=getState().filter.timeAndNumber.userNumber;
        if(sfzh.length!=18){
            alert("请输入18位身份证号.");return;
        }else if(iscontain(sfzh,getState().data.mappings)){
            alert("对不起该身份证已存在");return;
        }
        //首次displaced：更新loadStatus 来加载进度条
        dispatch(isLoadWait(true));
        //TODO:旧请求地址/fwzy/do/track/data
        return axios.get(`/json/${sfzh}.json`,
            {params:{
                zjhm:sfzh,
                kssj:getState().filter.timeAndNumber.startTime.replace("-","").replace("-","")+"000000",
                jssj:getState().filter.timeAndNumber.endTime.replace("-","").replace("-","")+"999999",
                lx:'wb,lg,hc,ky,fj,zk,qt,yl'
            }
            ,responseType: "json"}
            )
            .then(function (response) {
                console.log("异步获得的数据",response.data);
                let result=response.data;
                let userNumber=result.people.userNumber;
                let contents=result.content;
                let md5Arr=[];let dateArr=[];let dateMap={};
                contents.map((content,index)=>{
                    md5Arr.push(content.hbase_zj);
                    dateArr.push(content.online_time);
                    dateMap[content.online_time]=index;
                })
                //console.log("完成数据分类：",md5Arr)
                //数据映射
                dispatch(mappingData(userNumber,md5Arr,dateMap))
                //合并date，md5集合
                dispatch(descMd5Arr(md5Arr))
                dispatch(descDateArr(dateArr))
                //每次加载后初始化时间轴
                dispatch(initTimeIndex(getState().data.desc.date_area))
                //数据存储
                dispatch(AddData(userNumber,result))
                //停止显示进度条
                dispatch(isLoadWait(false))
                console.log("更新后的state:",getState());
            })
            .catch(function (error) {
                console.log(error);
            });

    }

}

//给次ajax后用所有的加载数据去重新初始化时间轴

function initTimeIndex(descDateArea) {
    return {
        type:ActionTypes.DATA.INIT_TIME_INDEX,
        descDateArea
    }
}


function deleteDescMd5(md5Arr){
    return {
        type:ActionTypes.DATA.MA5_DELETE_COLLECTOR,
        md5Arr
    }
}

function deleteDescDate(dateArr){
    return {
        type:ActionTypes.DATA.DATE_DELETE_COLLECTOR,
        dateArr
    }
}

function deleteMapping(userNumber){
    return {
        type:ActionTypes.DATA.DELETE_MAPPING,
        userNumber
    }

}
function deleteData(userNumber){
    return{
        type:ActionTypes.DATA.DATE_DELETE,
        userNumber
    }
}

//删除一个人的轨迹内容
export function dataCancel(userNumber) {
    console.log("正在删除")
    return function (dispatch,getState){
        let mapping=getState().data.mappings;
        //console.log("i'll dead",mapping[userNumber].md5Arr)
        //删除desc
            dispatch(deleteDescMd5(mapping[userNumber].md5Arr))
            dispatch(deleteDescDate(mapping[userNumber].dateArr))
        //删除mapping
            dispatch(deleteMapping(userNumber))
        //删除数据
            dispatch(deleteData(userNumber))
        //重新初始化时间轴
            dispatch(initTimeIndex(getState().data.desc.date_area))
        console.log("更新后的state:",getState());
    }
}

//详情是否显示
export function showDetail(isShow){
    return {
        type:ActionTypes.UI.DETAILSHOW,
        isShow:isShow
    }
}
function loadDetailData(data){
    return {
       type: ActionTypes.DATA.LOAD_ONETRACK_DETAIL,
       detailData:data
    }

}
//加载详情
export function loadDetail() {
    console.log("详情加载ajax....");
    return function (dispatch,getState){
        //console.log(getState());//获取state getState是function 而getstate() 的结果是state
        //首次displaced：更新loadStatus 来加载进度条
        dispatch(isLoadWait(true))
        return axios.get('/json/test.json', {responseType: "json"})
            .then(function (response) {
                console.log("异步获得的数据",response.data);
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







