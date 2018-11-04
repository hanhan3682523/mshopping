<template>
    <div class="draw-content">
        <div class="draw-wrap">
            <!-- 返回按钮 -->
            <a class="go-back" href="javascript:history.go(-1);"></a>
            <!-- 幸运免单 -->
            <div class="page-title"></div>
            <!-- 中奖概率 -->
            <div class="draw-info">
                <!-- 问号 -->
                <a class="doubt" href="javascript:void(0);"></a>
                <p class="title">本次中奖概率</p>
                <p class="probability">{{probability}}%</p>
                <!-- 按钮组 -->
                <div class="btn-group">
                    <a class="btn btn1 select" href="javascript:void(0);" data-price="1.00" @click="setPercent"></a>
                    <a v-if="parseInt(goodsPrice,10)>3" class="btn btn2" href="javascript:void(0);" data-price="3.00" @click="setPercent"></a>
                    <a v-if="parseInt(goodsPrice,10)>5" class="btn btn3" href="javascript:void(0);" data-price="5.00" @click="setPercent"></a>
                </div>
                <!-- 商品详情 -->
                <div class="good-info">
                    <div class="info">
                        <div class="img">
                            <img :src="goodsImg">
                        </div>
                        <div class="name-price">
                            <p class="name">{{goodsName}}</p>
                            <div class="price">
                                <span class="span1">抽奖价格: ￥{{drawPrice}}</span>
                                <span class="span2">￥{{goodsPrice}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 开始 -->
            <div class="start">
                <p class="des">采用绝对公平公正的算法</p>
                <a class="go-btn" href="javascript:void(0);" @click="pageInfo"></a>
            </div>
        </div>
        <!-- 用户条款 -->
        <div class="xieyi">
            <i class="icon select"></i>
            <span class="des">我已阅读并同意用户条款</span>
            <a class="check" href="javascript:void(0);">点击查看</a>
        </div>
        <!-- 抽奖弹框 -->
        <Draw :message="{goodsImg,goodsName}" />
        <!-- 未中奖弹框 -->
        <NoPrize />
        <!--134抽奖图片宽度 588指3张图片*高度196 -->
        <canvas id="myCanvas" width="134" height="588">
        </canvas>
    </div>

</template>

<script>
let canvas = null;
let context = null;
//图片宽度
let _width = 134;
//图片高度
let _height = 196;
//域名
import host from '../utils/host.js'
//公共方法
import { Common } from '../utils/common.js'
//头部组件
import Draw from '../components/luckdraw/Draw'
import NoPrize from '../components/luckdraw/NoPrize'
import imgs1 from '@/assets/image/1.png'
import imgs2 from '@/assets/image/2.png'
import imgs3 from '@/assets/image/3.png'
let imgObj = {
    "1": imgs1,
    "2": imgs2,
    "3": imgs3
};
export default {
    //使用的组件
    components: {
        Draw,
        NoPrize
    },
    data() {
        return {
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
            //抽奖价格
            drawPrice: '1.00',
            //支付信息
            payParams: null,
            //订单编号
            ProductJson: ''
        }
    },
    computed: {
        //获取机器信息
        getMachineInfo(){
            return Common.getSessionInfo('machineInfo') || {};
        },
        //中奖概率
        probability() {
            return parseInt((this.drawPrice / this.goodsPrice) * 100, 10);
        }
    },
    methods: {
        /*
            计算中奖概率
        */
        setPercent(e) {
            let _this = this;
            $('.draw-content .draw-info .btn-group .btn').removeClass('select');
            $(e.target).addClass('select');
            _this.drawPrice = e.target.getAttribute('data-price');
        },

        /*
            支付
        */
        pageInfo() {
            let _this = this;
            _this.$dialog.loading.open('支付中...');
            //用户信息
            let _info = Common.getSessionInfo('wechatinfo');
            // 获取授权信息
            if (_info) {
                //获取支付信息
                _this.getPayInfo(_info);
            } else {
                //设置授权code
                _this.$store.dispatch('wechatAuth', {
                    isIndex: false
                });
                _this.$dialog.loading.close();
            }
        },

        /*
            获取支付信息
       */
        getPayInfo(info) {
            let _this = this;
            //立即购买
            let _url = host.shopping + "/api/Hi/PostDataW?machineId=" + _this.machineId + '&openId=' + info.openid + '&hiPara=' + parseInt(_this.drawPrice, 10);
            let listProductPay = [{
                TradeAmount: _this.drawPrice,
                Number: '1',
                WaresId: _this.goodsId,
                WaresName: _this.goodsName,
                IsGroup: '0'
            }];
            $.ajax({
                type: 'POST',
                contentType: "application/json;charset=utf-8",
                dataType: 'json',
                url: _url,
                data: JSON.stringify(listProductPay),
                success: function (res) {
                    try {
                        //订单编号
                        _this.ProductJson = res.RetObj.ProductJson;
                        //支付信息
                        _this.payParams = JSON.parse(res.RetObj.RequestData);
                        _this.callPay();
                    } catch (e) {
                        _this.$dialog.loading.close();
                        _this.$dialog.toast({
                            mes: '支付失败',
                            timeout: 1500,
                            icon: 'error'
                        });
                    }
                },
                error: function () {
                    _this.$dialog.loading.close();
                }
            });
        },

        /*
            调起微信支付
        */
        callPay() {
            let _this = this;
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', _this.onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', _this.onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', _this.onBridgeReady);
                }
            } else {
                _this.onBridgeReady();
            }
        },

        /*
            支付
        */
        onBridgeReady() {
            let _this = this;
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', _this.payParams,
                function (res) {
                    _this.$dialog.loading.close();
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        // 使用以上方式判断前端返回,微信团队郑重提示：
                        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                        _this.$dialog.toast({
                            mes: '支付成功',
                            timeout: 1500,
                            icon: 'success',
                            callback: () => {
                                _this.$dialog.loading.open('准备开始抽奖');
                                //获取嗨的结果
                                _this.getTradeStatus(1);
                            }
                        });
                    } else {
                        _this.$dialog.toast({
                            mes: '支付失败',
                            timeout: 1500,
                            icon: 'error'
                        });
                    }
                }
            );
        },

        /*
            根据订单号取嗨的结果
        */
        getTradeStatus(index) {
            let _this = this;
            //根据订单号取嗨的结果
            let _url = host.shopping + "/api/Hi/GetTradeStatusByTradeNo?tradeNo=" + _this.ProductJson;
            $.ajax({
                type: 'POST',
                contentType: "application/json;charset=utf-8",
                dataType: 'json',
                url: _url,
                success: function (res) {
                    //抽奖状态 0：等待  1：嗨中了 2：没嗨中 3：其他错误
                    let _status = res.RetObj;
                    if (_status == 0) {
                        //当经过4s轮训后，还是为0，则当未中奖处理
                        if (index >= 5) {
                            _this.gameStart(false);
                        } else {
                            setTimeout(function () {
                                _this.getTradeStatus(index + 1);
                            }, 1000);
                        }
                    } else if (_status == 1) {
                        // 1：嗨中了
                        _this.gameStart(true);
                    } else if (_status == 2) {
                        //2：没嗨中
                        _this.gameStart(false);
                    } else {
                        //3：其他错误
                        _this.gameStart(false);
                    }
                },
                error: function () {
                }
            });
        },

        /*
            开始抽奖动画
            result:抽奖结果 '111' 中奖  '112' 未中奖
        */
        gameStart(isWin) {
            this.$dialog.loading.close();
            $('.draw-content .result').hide();
            $('.draw-content .prize').show();
            setTimeout(function () {
                $('.draw-content .goods').luckDraw(_height, isWin ? '111' : '113', function () {
                    if (isWin) {
                        //中奖
                        $('.result').show(300);
                    } else {
                        //未中奖
                        $('.draw-content .no-prize').show(300);
                    }
                });
            }, 500);
        },

        /*
            合成背景图片
        */
        drawImg(index) {
            let _this = this;
            if (index <= 3) {
                let image = new Image();
                image.onload = function () {
                    context.drawImage(image, 0, (index - 1) * _height, _width, _height);
                    _this.drawImg(index + 1);
                }
                image.src = imgObj[index];
            } else {
                console.log('结束');
                let _img = canvas.toDataURL('image/png');
                $('.goods').css('background-image', 'url(' + _img + ')');
            }
        },

        /*
            绑定页面元素点击事件
        */
        bindClick() {
            let _this = this;
            //立即取货
            $(document).off('click', '.draw-content .prize .get-goods');
            $(document).on('click', '.draw-content .prize .get-goods', function () {
                _this.openConfrim();
            });

            //抽奖框关闭
            $(document).on('click', '.draw-content .prize .close,.draw-content .prize .again', function () {
                $('.draw-content .prize').hide();
            });

            //未中奖弹框框关闭
            $(document).on('click', '.draw-content .no-prize .no-close,.draw-content .no-prize .btn', function () {
                $('.draw-content .no-prize,.draw-content .prize').hide();
            });
        },

         /*
            确认提货
        */
        openConfrim() {
            let _this = this ;
            this.$dialog.confirm({
                title: '温馨提示',
                mes: `您确定取货吗？如果您不在 ${this.getMachineInfo.machineAddress} 机器旁边，将可能造成商品丢失。`,
                opts: () => {
                    //立即取货
                    _this.getGoods();
                }
            });
        },

        /*
            立即取货
        */
        getGoods() {
            let _this = this;
            _this.$dialog.loading.open('正在取货...');
            //立即购买
            let _url = host.shopping + "/api/Hi/PickupImmediately?tradeNo=123" + _this.ProductJson;
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
                                mes: '取货成功',
                                timeout: 1500,
                                icon: 'success',
                                callback: () => {
                                    $('.draw-content .prize').hide();
                                }
                            });
                        },6000);
                    } else {
                        _this.$dialog.loading.close();
                        _this.$dialog.toast({
                            mes: '取货失败',
                            timeout: 1500,
                            icon: 'error'
                        });
                    }
                },
                error: function (err) {
                    _this.$dialog.loading.close();
                    _this.$dialog.toast({
                        mes: '取货失败',
                        timeout: 1500,
                        icon: 'error'
                    });
                }
            });
        }
    },
    created() {
        let _this = this;
        _this.goodsId = _this.$route.params.goodsId;
        _this.machineId = _this.$route.params.machineId;
        //读取所有的商品列表
        let _goodsList = _this.$store.getters.getGoodsList;
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
    mounted() {
        canvas = $('#myCanvas')[0];
        context = canvas.getContext('2d');
        //合成背景图片
        this.drawImg(1);
        //绑定页面元素点击事件
        this.bindClick();
    }
}
</script>

<style lang="less">
#myCanvas {
    width: 134px;
    height: 588px;
    background-color: red;
    border: 0;
    display: none;
}
.draw-content {
    width: 100%;
    background: url("../assets/image/luckdraw/di4di750x1204.png") center
        no-repeat;
    background-size: cover;
    height: 100%;
    .draw-wrap {
        width: 100%;
        height: 100%;
        position: relative;
        padding-top: 84px;
        .go-back {
            position: absolute;
            display: block;
            width: 134px;
            height: 75px;
            background: url("../assets/image/luckdraw/fanhuianniu.png") center
                no-repeat;
            background-size: contain;
            left: 16px;
            top: 18px;
        }
        .page-title {
            width: 438px;
            height: 154px;
            background: url("../assets/image/luckdraw/xingyunmiandan.png")
                center no-repeat;
            background-size: contain;
            margin: 0 auto;
        }
        .draw-info {
            width: 640px;
            height: 582px;
            background: url("../assets/image/luckdraw/haidi.png") center
                no-repeat;
            background-size: contain;
            margin: 10px auto 0 auto;
            position: relative;
            .doubt {
                position: absolute;
                display: block;
                width: 40px;
                height: 40px;
                background: url("../assets/image/luckdraw/wenhao.png") center
                    no-repeat;
                background-size: contain;
                right: 118px;
                top: 106px;
            }
            .title {
                text-align: center;
                color: #bf7d0a;
                font-size: 32px;
                line-height: 32px;
                padding-top: 38px;
            }
            .probability {
                text-align: center;
                color: #ff3c3c;
                font-size: 80px;
                line-height: 80px;
                padding-top: 48px;
            }
            // 按钮组
            .btn-group {
                display: flex;
                justify-content: space-evenly;
                padding: 0 15px;
                margin-top: 40px;
                .btn {
                    display: block;
                    width: 192px;
                    height: 95px;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: contain;
                    position: relative;
                }
                .btn1 {
                    background-image: url("../assets/image/luckdraw/hai1f.png");
                    &.select {
                        background-image: url("../assets/image/luckdraw/hai1.png");
                    }
                    &.select::after {
                        content: "";
                        width: 44px;
                        height: 44px;
                        display: block;
                        background: url("../assets/image/luckdraw/duihao.png")
                            center no-repeat;
                        background-size: contain;
                        position: absolute;
                        right: -8px;
                        top: -14px;
                    }
                }
                .btn2 {
                    background-image: url("../assets/image/luckdraw/hai3f.png");
                    &.select {
                        background-image: url("../assets/image/luckdraw/hai3.png");
                    }
                    &.select::after {
                        content: "";
                        width: 44px;
                        height: 44px;
                        display: block;
                        background: url("../assets/image/luckdraw/duihao.png")
                            center no-repeat;
                        background-size: contain;
                        position: absolute;
                        right: -8px;
                        top: -14px;
                    }
                }
                .btn3 {
                    background-image: url("../assets/image/luckdraw/hai5f.png");
                    &.select {
                        background-image: url("../assets/image/luckdraw/hai5.png");
                    }
                    &.select::after {
                        content: "";
                        width: 44px;
                        height: 44px;
                        display: block;
                        background: url("../assets/image/luckdraw/duihao.png")
                            center no-repeat;
                        background-size: contain;
                        position: absolute;
                        right: -8px;
                        top: -14px;
                    }
                }
            }
            .good-info {
                width: 470px;
                height: 183px;
                background: url("../assets/image/luckdraw/biaoqian.png") center
                    no-repeat;
                background-size: contain;
                margin: 28px auto 0 auto;
                padding-top: 32px;
                .info {
                    display: flex;
                    width: 408px;
                    height: 120px;
                    margin-left: 26px;
                    .img {
                        img {
                            width: 120px;
                            height: 120px;
                        }
                        margin-right: 10px;
                    }
                    .name-price {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        flex: 1;
                        .name {
                            font-size: 30px;
                            line-height: 30px;
                            color: #000000;
                            margin-bottom: 32px;
                        }
                        .price {
                            .span1 {
                                font-size: 26px;
                                color: #ff0000;
                            }
                            .span2 {
                                font-size: 26px;
                                color: #969696;
                                float: right;
                                text-decoration: line-through;
                            }
                        }
                    }
                }
            }
        }
        .start {
            .des {
                color: #fefae6;
                font-size: 32px;
                line-height: 32px;
                margin-top: 12px;
                text-align: center;
            }
            .go-btn {
                display: block;
                width: 380px;
                height: 95px;
                background: url("../assets/image/luckdraw/mashanghai.png")
                    center no-repeat;
                background-size: contain;
                margin: 22px auto 0 auto;
            }
        }
    }

    //条款
    .xieyi {
        width: 100%;
        height: 80px;
        display: flex;
        position: fixed;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        align-items: center;
        padding-left: 30px;
        .icon {
            display: block;
            width: 40px;
            height: 40px;
            background: url("../assets/image/luckdraw/unselect.png") center
                no-repeat;
            background-size: contain;
            margin-right: 24px;
            &.select {
                background: url("../assets/image/luckdraw/select.png") center
                    no-repeat;
                background-size: contain;
            }
        }
        .des {
            color: #ffffff;
            font-size: 28px;
        }
        .check {
            flex: 1;
            color: #40b2e8;
            font-size: 28px;
            text-align: right;
            padding-right: 40px;
        }
    }
}
.dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 50;
    .close {
        display: block;
        position: absolute;
        right: -64px;
        top: -84px;
        width: 84px;
        height: 84px;
        background-image: url("../assets/image/luckdraw/guanbi.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
}
</style>
