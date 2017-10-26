//过滤
const FILTER={
    OPTION:'OPTION',
    SET_START_TIME:'FILTER_START_TIME',
    SET_END_TIME:'FILTER_END_TIME',
    SET_USERNUMBER:'FILTER_USER_NUMBER',
    RADIO_CHANGE:'RADIO_CHANGE',
    

}
//顶部筛选条件action Type
const OPTION={
    ADD:'ADD_OPTION',
    CHANGE_CHECK:'OPTION_CHANGE_CHECK'
}

const DATA={
    CANCEL:'DATA_CANCEL',
    ADD_REQUEST:'DATA_ADD_REQUEST',
    ADD_RECEIVE:'DATA_ADD_RECEIVE',
    DATE_DELETE:'DATA_DELETE',
    MAPPING:'DATA_MAPPING',
    DELETE_MAPPING:'DELETE_DATA_MAPPING',
    MD5_COLLECTOR:'DATA_COLLECTOR_MD5',
    DATE_TYPE_COLLECTOR:'DATE_TYPE_COLLECTOR',
    DATE_TYPE_DELETE:'DATE_TYPE_DELETE',
    MA5_DELETE_COLLECTOR:'MD5_DELETE_COLLECTOR',
    DATE_COLLECTOR:'DATA_COLLECTOR_DATE',
    DATE_DELETE_COLLECTOR:'DATE_DELETE_COLLECTOR',
    ADD_USER_TIME_INDEX:'ADD_USER_TIME_INDEX',
    DEL_USER_TIME_INDEX:'DEL_USER_TIME_INDEX',
    LOAD_ONETRACK_DETAIL:'LOAD_ONETRACK_DETAIL'
}

//UI
const UI={
    TOPSHOW:'IS_TOP_SHOW',
    DETAILSHOW:'IS_DETAIL_SHOW',
    LOADWAIT:'IS_LOAD_WAIT',
    CHANGE_SHOW_CHART:'CHANGE_SHOW_CHART'
}


const CHART={
    CHART_ADD_DATA:'CHART_ADD_DATA',
    CHART_DELETE_DATA:'CHART_DELETE_DATA',

}

export default {
    OPTION,FILTER,UI,DATA,CHART

}