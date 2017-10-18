import ActionTypes from '../Actions/ActionTypes';

const ui=(state=initUI,action)=>{
    //console.log("进入reduce-UI:",state)
    return {
        Top:changeTop(state.Top,action),
        Detail:changeDetail(state.Detail,action),
        isLoad:changdLoadStatus(state.isLoad,action)
    }

}
/*
初始化开始
 */
const initUI={
    Top:{showTop:true},
    Detail:{showDetsil:false},
    isLoad:{isLoadStatus:false}
}

/*
 初始化结束
 */

function changeTop(state,action){
    //console.log("changeUI",action);
    switch(action.type){
        case ActionTypes.UI.TOPSHOW:
            return Object.assign({},state,{showTop:!action.isShow});
        default:
            return state;
    }

}

function changeDetail(state,action) {
    //console.log("changeDetail",action);
    switch(action.type){
        case ActionTypes.UI.DETAILSHOW:
            return Object.assign({},state,{showDetail:action.isShow});
        default:
            return state;
    }
}
function changdLoadStatus(state,action) {
    //console.log("chngeLoad",action);
    switch (action.type){
        case ActionTypes.UI.LOADWAIT:
            return Object.assign({},state,{isLoadStatus:action.loadStatus})
        default:
            return state
    }
}

export default ui