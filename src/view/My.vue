<template>
    <div style="display: flex;flex-direction: column;min-height: 100%;">
        <div class="my-card">
            <span class="des">购卡次数：</span>
            <span class="time">{{count}}次</span>
            <div class="get-card">
                <a class="btn" href="javascript:void(0);" @click="pickupByAccount"></a>
            </div>
        </div>
        <!-- 列表 -->
        <div class="list">
            <article slot="list" class="my-center">
                <div v-for="(item, index) in getOrderList" :key="index" href="javascript:;"  class="order-item">
                    <div class="goods-img">
                        <img :src="item.PicUrl">
                    </div>
                    <div class="detail">
                        <div class="name">{{item.WaresName}} x{{item.TotalNum}}</div>
                        <div class="shop-info">
                            <div class="no-info">
                                <i class="icon"></i>
                                <span class="des">{{getMachineInfo.machineId}}</span>
                            </div>
                            <div class="address-info">
                                <i class="icon"></i>
                                <span class="des">{{getMachineInfo.machineAddress}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="btn-wrap">
                        <a class="btn" href="javascript:void(0);" @click="getGood" :tradeno="item.TradeNo"></a>
                    </div>
                </div>
            </article>
        </div>
        <!-- 说明 -->
        <div class="center-des">
            <div class="des">
                <p class="p1">说明：</p>
                <p class="p2">本购物卡为网上商城消费抵用券，单卡面值为300元，售价每张100元，取卡需累积购卡满100次。点击取卡自动出货。</p>
                <p class="p3">注：杭州智购科技有限公司拥有本说明的最终解释权。</p>
            </div>
        </div>
        <!-- 返回顶部 -->
        <yd-backtop></yd-backtop>
    </div>
</template>

<script>
import Vue from 'vue';
//域名
import host from '../utils/host.js'
//公共方法
import { Common } from '../utils/common.js'
export default {
    //使用的组件
    components: {
    },
    data() {
        return {
            count:'0'
        }
    },
    computed:{
        //获取机器信息
        getMachineInfo(){
            return Common.getSessionInfo('machineInfo') || {};
        },
        //获取订单数据
        getOrderList(){
            return this.$store.getters.getOrderList;
        }
    },
    methods: {
        //获取购卡次数
        getMemberAccount(){
            let _this = this;
            //用户信息
            let _info = Common.getSessionInfo('wechatinfo');
            let _url = host.shopping + "/api/Hi/GetMemberAccountByMember";
            let _data = {
                machineId:_this.$route.params.machineId || '',
                openId:_info.openid || ''
            };
            _this.$get(_url,_data).then(function(res){
                if(res && res.RetObj){
                    _this.count = res.RetObj.AccountData || 0;
                }
            });
        },

        //加载列表数据
        loadList(){
            let _this = this;
            _this.$dialog.loading.open('数据加载中');
            //用户信息
            let _info = Common.getSessionInfo('wechatinfo');
            // 获取授权信息
            if (_info) {
                _this.$store.dispatch('getOrderListAjax',{
                    _this:_this,
                    machineId:_this.$route.params.machineId,
                    openId: _info.openid || ''
                });
            } else {
                //设置授权code
                _this.$store.dispatch('wechatAuth', {
                    isIndex: false
                });
            }
        },

        //取卡
        pickupByAccount(){
            let _this = this;
            if(parseInt(_this.count,10)<100){
                _this.$dialog.toast({
                    mes: '取卡需累积购卡满100次',
                    timeout: 1500
                });
            }else{
                _this.openConfrim(true,function(){
                    //立即取卡
                    _this.getGoods(true);
                });
            }
        },

        //取货
        getGood(e){
            let _this = this ;
            let tradeno = e.target.getAttribute('tradeno');
            console.log('订单编号：'+tradeno);
            _this.openConfrim(false,function(){
                _this.getGoods(false,tradeno);
            });
        },

        //确认提货
        openConfrim(isCard,callback) {
            let _this = this ;
            this.$dialog.confirm({
                title: '温馨提示',
                mes: isCard ? `您确定取卡吗？如果您不在 ${this.getMachineInfo.machineAddress} 机器旁边，将可能造成卡丢失。` : `您确定取货吗？如果您不在 ${this.getMachineInfo.machineAddress} 机器旁边，将可能造成商品丢失。`,
                opts: () => {
                    if(callback){
                        callback();
                    }
                }
            });
        },

        /*
            立即取货
        */
        getGoods(isCard,tradeno) {
            let _this = this;
            _this.$dialog.loading.open(isCard? '正在取卡...': '正在取货...');
            //用户信息
            let _info = Common.getSessionInfo('wechatinfo');
            let _url ='';
            if(isCard){
                _url = host.shopping + "/api/Hi/PickupByAccount?machineId=" + _this.$route.params.machineId + '&openId='+_info.openid;
            }else{
                _url = host.shopping + "/api/Hi/PickupImmediately?tradeNo=" + tradeno;
            }
            
            $.ajax({
                type: 'POST',
                contentType: "application/json;charset=utf-8",
                dataType: 'json',
                url: _url,
                success: function (res) {
                    if (res.RetObj == 1) {
                        setTimeout(function(){
                            _this.$dialog.loading.close();
                            _this.$dialog.toast({
                                mes: isCard ? '取卡成功' : '取货成功',
                                timeout: 1500,
                                icon: 'success',
                                callback: () => {
                                    if(isCard){
                                        _this.getMemberAccount();
                                    }else{
                                        _this.loadList();
                                    }
                                }
                            });
                        },6000);
                    } else {
                        _this.$dialog.loading.close();
                        _this.$dialog.toast({
                            mes: isCard ? '取卡失败' : '取货失败',
                            timeout: 1500,
                            icon: 'error',
                            callback: () => {
                               if(isCard){
                                    _this.getMemberAccount();
                                }else{
                                    _this.loadList();
                                }
                            }
                        });
                    }
                },
                error: function (err) {
                    _this.$dialog.loading.close();
                    _this.$dialog.toast({
                        mes: isCard ? '取卡失败' : '取货失败',
                        timeout: 1500,
                        icon: 'error',
                        callback: () => {
                            if(isCard){
                                _this.getMemberAccount();
                            }else{
                                _this.loadList();
                            }
                        }
                    });
                }
            });
        }
    },
    mounted() {
        //初始化页面完成后自动执行
        var _this = this;
        _this.getMemberAccount();
        _this.loadList();
    }
}
</script>

<style lang="less">
.my-card{
    width: 100%;
    height: 100px;
    display: flex;
    background-color: #ffffff;
    align-items: center;
    padding-left: 26px;
    .des{
        font-size: 30px;
        color: #646464;
    }
    .time{
        font-size: 30px;
        color: #ff3c3c;
    }
    .get-card{
        display: flex;
        flex: 1;
        padding-right: 30px;
        justify-content: flex-end;
        .btn{
            display: block;
            width: 160px;
            height: 80px;
            background: url('../assets/image/quka.png') center no-repeat;
            background-size: contain;
        }
    }
}
.list{
    flex: 1;
    .my-center{
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: 25px 25px 0 25px;
        .order-item{
            display: flex;
            align-items: center;
            width: 100%;
            height: 200px;
            background-color: #ffffff;
            border-radius: 8PX;
            padding-left: 9px;
            margin-bottom: 10px;
            .goods-img{
                width: 180px;
                height: 180px;
                margin-right: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                img{
                    width: 150px;
                    height: 150px;
                }
            }
            .detail{
                height: 100%;
                .name{
                    font-size: 32px;
                    font-weight: 600;
                    color: #000000;
                    padding-top: 25px;
                    padding-bottom: 35px;
                }
                // 店信息
                .shop-info{
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    .no-info{
                        display: flex;
                        margin-bottom: 12px;
                        align-items: center;
                        .icon{
                            display: block;
                            width: 25px;
                            height: 30px;
                            background: url('../assets/image/shouhuoji.png') center no-repeat;
                            background-size: contain;
                            margin-right: 16px;
                        }
                        .des{
                            font-size: 28px;
                            color: #000000;
                        }
                    }
                    .address-info{
                        display: flex;
                        align-items: center;
                        .icon{
                            display: block;
                            width: 25px;
                            height: 32px;
                            background: url('../assets/image/dizhi.png') center no-repeat;
                            background-size: contain;
                            margin-right: 16px;
                        }
                        .des{
                            font-size: 28px;
                            color: #646464;
                        }
                    }
                }
            }
            .btn-wrap{
                flex: 1;
                display: flex;
                justify-content: flex-end;
                padding-right: 11px;
                .btn{
                    display: block;
                    width: 200px;
                    height: 120px;
                    background: url('../assets/image/lijiquhuo.png') center no-repeat;
                    background-size: contain;
                }
            }
        }
    }
}
// 说明
.center-des{
    width: 100%;
    padding: 0 25px 20px 25px;
    display: flex;
    align-items: flex-end;
    .des{
        height: 250px;
        background: rgba(215, 215, 215, 1);
        padding: 15px 20px;
        .p1{
            font-size: 28px;
            color: #000000;
        }
        .p2{
            font-size: 28px;
            color: #000000;
            text-indent: 2em;
        }
        .p3{
            font-size: 28px;
            color: #646464;
            margin-top: 30px;
            width: 104%;
        }
    }
}
</style>