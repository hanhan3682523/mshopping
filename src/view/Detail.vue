<template>
    <!-- 商品详情页 -->
    <div class="detail-wrap">
        <div class="top">
            <!-- 返回 -->
            <router-link :to="{ name: 'Index', query: {machineId:$route.params.machineId}}">
                <a class="back" href="javascript:;"></a>
            </router-link>
            <div class="name">{{goodsName}}</div>
            <div class="goods-img">
                <img :src="goodsImg">
            </div>
            <div class="price">￥{{goodsPrice}}</div>
        </div>
        <div class="shop">
            <div class="shop-wrap">
                <!-- 店信息 -->
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
        </div>
        <!-- 购买数量及金额 -->
        <div class="buy-info">
            <i class="minus"></i>
            <span class="num">{{counter}}</span>
            <i class="add"></i>
            <div class="price">
                <span>共：</span>
                <span class="count">￥{{priceCounter}}</span>
            </div>
        </div>
        <!-- 按钮组 -->
        <div class="btn-group">
            <a class="btn left" href="javascript:void(0);" @click="buyGoods"></a>
            <router-link v-if="parseInt(goodsPrice,10)>1" :to="{ name: 'LuckDraw', params: {machineId:$route.params.machineId,goodsId: $route.params.goodsId}}">
                <a class="btn right" href="javascript:;"></a>
            </router-link>
        </div>
        <!-- 广告 -->
        <AdImgs />
    </div>
</template>

<script>
//域名
import host from '../utils/host.js'
//广告轮播
import AdImgs from '../components/detail/AdImgs'
//公共方法
import { Common } from '../utils/common.js'
export default {
    //使用的组件
    components: {
        AdImgs
    },
    data() {
        return {
            counter: 1,
            //机器ID
            machineId: '',
            //商品ID
            goodsId: '',
            //商品名称
            goodsName: '',
            //商品图片
            goodsImg: '',
            //商品价格
            goodsPrice: '',
            //支付信息
            payParams:null
        }
    },
    computed: {
        //获取机器信息
        getMachineInfo() {
            return this.$store.getters.getMachineInfo;
        },
        //总价
        priceCounter() {
            return this.counter * this.goodsPrice;
        }
    },
    methods: {
        // 页面初始化
        initPage(){
            let _this = this;
            _this.goodsId = _this.$route.params.goodsId;
            _this.machineId = _this.$route.params.machineId;
            //读取所有的商品列表
            let _goodsList = this.$store.getters.getGoodsList;
            //是否查询到该商品
            let isGet = false;
            //遍历数组，找出当前选中商品
            for (var i = 0; i < _goodsList.length; i++) {
                if (_goodsList[i].goodsId == _this.goodsId) {
                    isGet = true;
                    _this.goodsName = _goodsList[i].goodsName;
                    _this.goodsImg = _goodsList[i].goodsImg;
                    _this.goodsPrice = _goodsList[i].goodsPrice;
                    return;
                }
            }
            if (!isGet) {
                _this.$router.push({ path: '/?machineId=' + _this.$route.params.machineId })
            }
        },
        //购买
        buyGoods() {
            let _this = this;
            _this.$dialog.loading.open('支付中...');
            //用户信息
            let _info =Common.getSessionInfo('wechatinfo');
            // 获取授权信息
            if (_info) {
                //获取支付信息
                _this.getPayInfo(_info);
            } else {
                //设置授权code
                _this.$store.dispatch('wechatAuth',{
                    isIndex:false
                });
                _this.$dialog.loading.close();
            }
        },
        //获取支付信息
        getPayInfo(info){
            let _this = this;
            //立即购买
            let _url = host.shopping + "/api/Hi/PostDataW?machineId="+_this.machineId+'&openId='+info.openid+'&hiPara=-1';
            let _param = {
                machineId: _this.machineId,
                openId: info.openid,
                hiPara:'-1',
                listProductPay: [{
                    TradeAmount: _this.priceCounter,
                    Number: '1',
                    WaresId: _this.goodsId,
                    WaresName: _this.goodsName,
                    IsGroup: '0'
                }]
            };
            $.ajax({
                type: 'POST',
                contentType: "application/json;charset=utf-8",
                dataType:'json',
                url: _url,
                data: JSON.stringify(_param.listProductPay),
                success: function(res){
                    try{
                        if(res.RetObj.RequestData){
                            _this.payParams = JSON.parse(res.RetObj.RequestData);
                            _this.callPay();
                        }else{
                            _this.$dialog.loading.close();
                            _this.$dialog.toast({
                                mes: res.RetMsg || '支付失败',
                                timeout: 2000,
                                icon: 'error'
                            });
                        }
                    }catch(e){
                        _this.$dialog.loading.close();
                        _this.$dialog.toast({
                            mes: res.RetMsg || '支付失败',
                            timeout: 2000,
                            icon: 'error'
                        });
                    }
                },
                error:function(){
                    _this.$dialog.loading.close();
                }
            });
        },
        //调起微信支付
        callPay(){
            let _this = this;
            if (typeof WeixinJSBridge == "undefined"){
                if( document.addEventListener ){
                    document.addEventListener('WeixinJSBridgeReady', _this.onBridgeReady, false);
                }else if (document.attachEvent){
                    document.attachEvent('WeixinJSBridgeReady', _this.onBridgeReady); 
                    document.attachEvent('onWeixinJSBridgeReady', _this.onBridgeReady);
                }
            }else{
                _this.onBridgeReady();
            }
        },
        //支付
        onBridgeReady(){
            let _this = this;
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', _this.payParams,
                function(res){
                    _this.$dialog.loading.close();
                    if(res.err_msg == "get_brand_wcpay_request:ok" ){
                        // 使用以上方式判断前端返回,微信团队郑重提示：
                        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                        _this.$dialog.toast({
                            mes: '支付成功',
                            timeout: 2000,
                            icon: 'success'
                        });
                    }else{
                        _this.$dialog.toast({
                            mes: '支付失败',
                            timeout: 2000,
                            icon: 'error'
                        });
                    } 
                }
            ); 
        }
    },
    mounted() {
        this.initPage();
    },
    watch: {
        '$route' (to, from) {
            // data数据操作
            this.initPage();
        }
    }
}
</script>

<style lang="less">
.detail-wrap {
    .top {
        background-color: #ffffff;
        height: 470px;
        width: 100%;
        margin-bottom: 2px;
        padding-top: 45px;
        position: relative;
        //返回
        .back {
            display: block;
            width: 60px;
            height: 60px;
            background: url("../assets/image/fanhui.png") center no-repeat;
            background-size: contain;
            position: absolute;
            left: 22px;
            top: 36px;
        }
        .price {
            display: block;
            width: 125px;
            height: 62px;
            line-height: 62px;
            text-align: center;
            color: #ff0000;
            font-size: 30px;
            background: url("../assets/image/danjiadi.png") center no-repeat;
            background-size: contain;
            position: absolute;
            right: 26px;
            bottom: 34px;
            font-family: Impact, Haettenschweiler, "Arial Narrow Bold",
                sans-serif;
        }
        .name {
            color: #000000;
            font-size: 36px;
            line-height: 36px;
            text-align: center;
            margin-bottom: 16px;
        }
        .goods-img {
            text-align: center;
            img {
                width: 350px;
                height: 350px;
            }
        }
    }

    .shop {
        height: 132px;
        background: #ffffff;
        margin-bottom: 2px;
        .shop-wrap {
            height: 100%;
            display: flex;
            align-items: center;
            padding-left: 35px;
            // 店信息
            .shop-info {
                display: flex;
                height: 100%;
                justify-content: center;
                flex-direction: column;
                .no-info {
                    display: flex;
                    margin-bottom: 12px;
                    align-items: center;
                    .icon {
                        display: block;
                        width: 25px;
                        height: 30px;
                        background: url("../assets/image/shouhuoji.png") center
                            no-repeat;
                        background-size: contain;
                        margin-right: 16px;
                    }
                    .des {
                        font-size: 28px;
                        color: #000000;
                    }
                }
                .address-info {
                    display: flex;
                    align-items: center;
                    .icon {
                        display: block;
                        width: 25px;
                        height: 32px;
                        background: url("../assets/image/dizhi.png") center
                            no-repeat;
                        background-size: contain;
                        margin-right: 16px;
                    }
                    .des {
                        font-size: 28px;
                        color: #646464;
                    }
                }
            }
        }
    }

    // 购买数量及金额
    .buy-info {
        width: 100%;
        height: 88px;
        background: #ffffff;
        margin-bottom: 2px;
        display: flex;
        align-items: center;
        .minus {
            display: block;
            width: 46px;
            height: 46px;
            background: url("../assets/image/minus.png") center no-repeat;
            background-size: contain;
            margin-left: 46px;
        }
        .num {
            width: 104px;
            text-align: center;
            font-size: 32px;
            color: #000000;
        }
        .add {
            display: block;
            width: 46px;
            height: 46px;
            background: url("../assets/image/add.png") center no-repeat;
            background-size: contain;
        }
        .price {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            padding-right: 76px;
            font-size: 36px;
            color: #000000;
            .count {
                font-size: 36px;
                color: #ff0000;
                font-family: Impact, Haettenschweiler, "Arial Narrow Bold",
                    sans-serif;
            }
        }
    }

    // 按钮组
    .btn-group {
        width: 100%;
        height: 114px;
        background: #ffffff;
        margin-bottom: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        .btn {
            display: block;
            width: 355px;
            height: 95px;
        }
        .left {
            background: url("../assets/image/lijigoumai.png") center no-repeat;
            background-size: contain;
            margin-right: 17px;
        }
        .right {
            background: url("../assets/image/xingyunmiandan.png") center
                no-repeat;
            background-size: contain;
        }
    }
}
</style>
