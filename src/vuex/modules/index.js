import Vue from 'vue'
//域名
import host from '../../utils/host'
//公共方法
import {
    Common
} from '../../utils/common'
const state = {
    //微信授权code参数
    code: '-1',
    url: '',
    //用户信息
    userInfo: null,
    machineInfo: {
        //机器编号
        machineId: '',
        //机器名称
        machineAddress: ''
    },
    // 商品分类
    goodsCategory: [],
    //当前页
    page: 1,
    //每页大小
    pagesize: 10,
    //商品列表
    goodsList: []
};

//获取state
const getters = {
    getUrl: (state) => {
        return state.url
    },
    //获取用户信息
    getUserInfo: (state) => {
        return state.userInfo
    },
    //获取机器信息
    getMachineInfo: (state) => {
        return state.machineInfo
    },
    //商品分类
    getGoodsCategory: (state) => {
        return state.goodsCategory
    },
    //商品列表
    getGoodsList: (state) => {
        return state.goodsList
    }
};

// 设置state，不支持异步
const mutations = {
    setUrl: (state, url) => {
        state.url = url;
    },
    //设置用户信息
    setUserInfo: (state, userInfo) => {
        if (typeof (userInfo) == 'string') {
            state.userInfo = JSON.parse(userInfo);
        } else {
            state.userInfo = userInfo;
        }
    },
    //设置授权code
    setAuthCode(state, code) {
        if (code) {
            state.code = code;
        }
    },
    //设置机器编号
    setMachineId(state, id) {
        state.machineInfo.machineId = id;
    },
    //设置机器编号
    setMachineInfo(state, info) {
        state.machineInfo = info;
    },
    //商品分类
    setGoodsCategory(state, _data) {
        state.goodsCategory = _data;
    },
    //商品列表
    setGoodsList(state, goodsList) {
        state.goodsList = goodsList;
    }
};

//支持异步
const actions = {
    //微信授权
    wechatAuth({
        commit,
        state
    }, {
        isIndex
        }) {
        if (!Common.getSessionInfo('wechatinfo')) {
            //判断微信环境
            if (Common.isWeiXin()) {
                let _src = host.shopping + '/api/Hi/WechatAuth';
                let backUrl = location.origin+'/hi/#/?machineId='+state.machineInfo.machineId;
                let _param = {
                    code: state.code,
                    machineId: state.machineInfo.machineId,
                    retBack: backUrl
                };
                Vue.prototype.$get(_src, _param).then(function (res) {
                    let {
                        RequestState,
                        RequestData,
                        ProductJson
                    } = res.RetObj;
                    commit('setUrl', RequestData);
                    //未授权
                    if (RequestState == '0') {
                        if (!isIndex) {
                            location.href = RequestData;
                        }
                    } else if (RequestState == '1') {
                        //设置用户信息
                        commit('setUserInfo', ProductJson);
                        //存储用户信息到session
                        Common.setSessionInfo('wechatinfo',ProductJson);
                    }
                });
            }
        }
    },
    // 获取机器信息
    getMachineInfo({
        commit,
        state
    }) {
        let _src = host.shopping + '/api/Hi/GetMachineLocationById';
        let _param = {
            machineId: state.machineInfo.machineId
        };
        Vue.prototype.$get(_src, _param).then(function (res) {
            console.info('机器信息：', res.RetObj);
            if (res.RetObj) {
                let _data = {
                    //机器编号
                    machineId: res.RetObj.MachineId,
                    //机器名称
                    machineAddress: res.RetObj.MachineName
                }
                commit('setMachineInfo', _data);
                //存储到session
                Common.setSessionInfo('machineInfo',_data);
            }
        });
    },
    //商品分类
    getGoodsCategoryAjax({
        commit,
        state
    }) {
        let _src = host.shopping + '/api/Hi/GetProductTypeByMachine';
        let _param = {
            machineId: state.machineInfo.machineId
        };
        Vue.prototype.$get(_src, _param).then(function (res) {
            console.log(res);
            let _list = res.RetObj;
            let _data = [{
                label: '全部',
                content: ''
            }];
            for (var i = 0; i < _list.length; i++) {
                if (_list[i].WaresTypeName) {
                    _data.push({
                        //分类名称
                        label: _list[i].WaresTypeName,
                        //分类ID
                        content: _list[i].WaresTypeId
                    });
                }
            }
            commit('setGoodsCategory', _data);
        });
    },
    //商品列表
    getGoodsListAjax({
        state,
        commit
    }, {
        _this,
        refresh,
        type
    }) {
        console.log('类型：:', type);
        if (refresh) {
            state.page = 1;
            state.goodsList = [];
        }
        let _src = host.shopping + '/api/Hi/GetProductByMachine';
        let _param = {
            //机器编号
            machineId: state.machineInfo.machineId,
            //页码
            pageIndex: state.page,
            //每页多少条
            pageSize: state.pagesize
        };
        //商品类型存在时，传入商品类型
        if (type) {
            _param.waresTypeId = type;
        }
        Vue.prototype.$get(_src, _param).then(function (res) {
            let _list = res.RetObj;
            let _data = [];
            for (var i = 0; i < _list.length; i++) {
                _data.push({
                    //商品标识
                    goodsId: _list[i].WaresId,
                    //商品名称
                    goodsName: _list[i].WaresName,
                    //商品价格
                    goodsPrice: _list[i].WPrice,
                    //商品图片
                    goodsImg: _list[i].PicUrl,
                    //当前数量
                    CurrStock: parseInt(_list[i].CurrStock, 10)
                });
            }

            let newList = [...state.goodsList, ..._data];
            commit('setGoodsList', newList);
            _this.$dialog.loading.close();
            if (_data.length < state.pageSize) {
                _this.$refs.goodsListScroll.$emit('ydui.infinitescroll.loadedDone');
                return;
            }
            /* 单次请求数据完毕 */
            _this.$refs.goodsListScroll.$emit('ydui.infinitescroll.finishLoad');
            state.page++;
        });
    }
};

export default {
    state,
    getters,
    mutations,
    actions
}
