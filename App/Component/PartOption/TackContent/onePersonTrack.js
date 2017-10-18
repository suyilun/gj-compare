import * as Actions from '../../../Actions/Actions';
import React from 'react';
import { connect } from 'react-redux';
import { showDetail } from "../../../Actions/Actions";



const cardClassName="life-single life-day";

const wbCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1>{dataContent.service_name}</h1>
            <ul>
                <li><span>姓名:</span><span>{dataContent.user_name}</span></li>
                <li><span>{dataContent.online_time_zhwz}</span></li>
                <li><span>{dataContent.offline_time_zhwz}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    );
}

const wbZjCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1>{dataContent.yycsmc}</h1>
            <ul>
                <li><span>姓名:</span><span>{dataContent.swryxm}</span></li>
                <li><span>{dataContent.swkssj_zhwz}</span></li>
                <li><span>{dataContent.xwsj_zhwz}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}

const lgCard = (type_org, dataContent) => {
    return (<div className={cardClassName}>
        <h1>{dataContent.hotelname}</h1>
        <ul>
            <li><span>房号:</span><span>{dataContent.no_room}</span></li>
            <li><span>{dataContent.in_time_zhwz}</span></li>
            <li><span>{dataContent.out_time_zhwz}</span></li>
        </ul>
        <img src={`images/life_class/${type_org}_life_big.png`}></img>
    </div>)
}


const hcCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1>{dataContent.cc}</h1>
            <ul>
                <li><span>座位:</span><span>{dataContent.zh}</span></li>
                <li><span>{dataContent.fcrq}</span></li>
                <li><span>{dataContent.fz}</span><span> - </span><span>{dataContent.dz}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}

const lgZjCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1>{dataContent.lgmc}</h1>
            <ul>
                <li><span>房号:</span><span>{dataContent.fh}</span></li>
                <li><span>{dataContent.rzsj_zhwz}</span></li>
                <li><span>{dataContent.ldsj_zhwz}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}

const hcDpCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1>{dataContent.cc}</h1>
            <ul>
                <li><span>姓名:</span><span>{dataContent.ckxm}</span></li>
                <li><span>{dataContent.send_time}</span></li>
                <li><span>{dataContent.cfz}</span><span> - </span><span>{dataContent.ddz}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}

const hcJzCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1>{dataContent.train_code}</h1>
            <ul>
                <li><span>座位:</span><span>{dataContent.seat_no}</span></li>
                <li><span>{dataContent.send_time}</span></li>
                <li><span>{dataContent.to_telecode_mc}</span><span> - </span><span>{dataContent.from_telecode_mc}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}

const kyCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1>{dataContent.startstationname}</h1>
            <ul>
                <li><span>姓名:</span><span>{dataContent.realname}</span></li>
                <li><span>买票:</span><span>{dataContent.selltime_zhwz}</span></li>
                <li><span>{dataContent.routename}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}

const fjCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1>{dataContent.hkgsdm_zhwz + ":" + dataContent.hbh}</h1>
            <ul>
                <li><span>座位:</span><span>{dataContent.djh}</span></li>
                <li><span>{dataContent.qfrq_zhwz}</span></li>
                <li><span>{dataContent.qfz_zhwz}</span><span>-</span><span>{dataContent.zdz_zhwz}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}




const fjDzCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1>{dataContent.hbh}</h1>
            <ul>
                <li><span>{dataContent.seg_dept_code_zhwz}</span><span>-</span><span>{dataContent.seg_dest_code_zhwz}</span></li>
                <li><span>出发:</span><span>{dataContent.air_seg_dpt_dt_lcl}</span></li>
                <li><span>到达:</span><span>{dataContent.air_seg_arrv_dt_lcl}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}

const fjJcgCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1>{dataContent.hbh}</h1>
            <ul>
                <li><span>{dataContent.seg_dept_code_zhwz}</span><span>-</span><span>{dataContent.seg_dest_code_zhwz}</span></li>
                <li><span>出发:</span><span>{dataContent.sta_depttm_zhwz}</span></li>
                <li><span>到达:</span><span>{dataContent.sta_arvetm_zhwz}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}

const fjLgCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1>{dataContent.hkgs + ":" + dataContent.hbh}</h1>
            <ul>
                <li><span>姓名:</span><span>{dataContent.lkzwxm}</span></li>
                <li><span>座位:</span><span>{dataContent.lkzwxx}</span></li>
                <li><span>{dataContent.jgsj}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}

const zkCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1 title={dataContent.zzdz}>{dataContent.zzdz}</h1>
            <ul>
                <li><span>姓名:</span><span>{dataContent.xm}</span></li>
                <li><span>登记:</span><span>{dataContent.djrq_zhwz}</span></li>
                <li><span>到期:</span><span>{dataContent.dqrq_zhwz}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}

const zkZjCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1 title={dataContent.zzdz}>{dataContent.zzdz}</h1>
            <ul>
                <li><span>姓名:</span><span>{dataContent.xm}</span></li>
                <li><span>登记:</span><span>{dataContent.djrq_zhwz}</span></li>
                <li><span>到期:</span><span>{dataContent.dqrq_zhwz}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}
const ylZjCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1>{dataContent.yymc}</h1>
            <ul>
                <li><span>姓名:</span><span>{dataContent.xm}</span></li>
                <li><span>{dataContent.online_time}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}

const ckCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1 title={dataContent.ssxq_zhwz + dataContent.xzjd_zhwz}>{dataContent.ssxq_zhwz + dataContent.xzjd_zhwz}</h1>
            <ul>
                <li><span>{dataContent.jlx_zhwz}</span></li>
                <li><span>{dataContent.pxh}</span></li>
                <li><span>{dataContent.hslbz_zhwz}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}

const zdCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1>{dataContent.org_name}</h1>
            <ul>
                <li><span>姓名:</span><span>{dataContent.xm}</span></li>
                <li><span>{dataContent.online_time}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}

const ylWsCard = (type_org, dataContent) => {
    return (
        <div className={cardClassName}>
            <h1>{dataContent.org_name}</h1>
            <ul>
                <li><span>姓名:</span><span>{dataContent.xm}</span></li>
                <li><span>{dataContent.online_time}</span></li>
            </ul>
            <img src={`images/life_class/${type_org}_life_big.png`}></img>
        </div>
    )
}



function mapStateToProps(state) {
    return {
        showContent: (type, dataContent) => {
            let type_org = type.split("_")[0];
            switch (type) {
                case "wb": return wbCard(type_org, dataContent);
                case "wb_zj": return wbZjCard(type_org, dataContent);
                case "lg": return lgCard(type_org, dataContent);
                case "lg_zj": return lgZjCard(type_org, dataContent);
                case "hc": return hcCard(type_org, dataContent);
                case "hc_dp": return hcDpCard(type_org, dataContent);
                case "hc_jz": return hcJzCard(type_org, dataContent);
                case "ky": return kyCard(type_org, dataContent);
                case "fj": return fjCard(type_org, dataContent);
                case "fj_dz": return fjDzCard(type_org, dataContent);
                case "fj_jcg": return fjJcgCard(type_org, dataContent);
                case "fj_lg": return fjLgCard(type_org, dataContent);
                case "zk": return zkCard(type_org, dataContent);
                case "zk_zj": return zkZjCard(type_org, dataContent);
                case "yl_zj": return ylZjCard(type_org, dataContent);
                case "yl_ws": return ylWsCard(type_org, dataContent);
                case "ck": return ckCard(type_org, dataContent);
                case "zd": return zdCard(type_org, dataContent);
                case "": return "";
            }
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        showDetailFunc: () => {
            dispatch(Actions.loadDetail())
        }
    }
}

const OptionShow = ({ isNewDay, user, showDetailFunc, dataContent, showContent }) => (
    <li className={isNewDay ? 'life-border frist' : 'life-border'} onClick={showDetailFunc}>
        {showContent(dataContent == undefined ? "" : dataContent.track_type, dataContent)}
    </li>
)

class OnePersonTrack extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { isNewDay, userNumber, showDetailFunc, dataContent, showContent } = this.props;
        return (
            <OptionShow 
                isNewDay={isNewDay} 
                user={userNumber} 
                showDetailFunc={showDetailFunc} 
                dataContent={dataContent} 
                showContent={showContent} />
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps
)(OnePersonTrack)