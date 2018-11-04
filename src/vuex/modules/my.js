import Vue from 'vue';
//域名
import host from '../../utils/host'
const state = {
    //订单列表
    orderList: [
    ]
};

//获取state
const getters = {
    //商品列表
    getOrderList: (state) => { 
        return state.orderList
    }
};

// 设置state，不支持异步
const mutations = {
    //商品列表
    setOrderList(state, list) { 
        state.orderList = list;
    }
};

//支持异步
const actions = {
    //商品列表
    getOrderListAjax({ state, commit }, { _this, machineId, openId }) {
        let _src = host.shopping + '/api/Hi/GetWaitingPickupByMachine';
        let _param = {
            machineId: machineId,
            openId:openId
        };
        Vue.prototype.$get(_src, _param).then(function (res) {
            let newList = [];
            if(res && res.RetObj && res.RetObj.length>0){
                let _data = res.RetObj;
                for(let i = 0; i < _data.length ; i++){
                    newList.push({
                        //订单编号
                        TradeNo:_data[i].TradeNo,
                        //商品图片
                        PicUrl:_data[i].PicUrl,
                        //商品名称
                        WaresName:_data[i].WaresName,
                        //商品数量
                        TotalNum:_data[i].TotalNum
                    });
                }
                commit('setOrderList', newList);
            }
            _this.$dialog.loading.close();
        });
    }
};

export default {
    state,
    getters,
    mutations,
    actions
}