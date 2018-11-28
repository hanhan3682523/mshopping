<template>
    <!-- 抽奖弹框 -->
    <div class="prize">
        <div class="warp dialog">
            <div class="wrapper">
                <i class="animation"></i>
                <div class="draw">
                    <div class="list">
                        <div class="goods"></div>
                        <div class="goods"></div>
                        <div class="goods"></div>
                    </div>
                </div>
                <i class="close" @click="closeDialog"></i>
            </div>
            <div class="result">
                <div class="success"></div>
                <div class="goods-res">
                    <div class="img">
                        <img :src="message.goodsImg">
                    </div>
                    <div class="des">
                        <p class="p1">已中奖</p>
                        <p class="p2">请在取货口取货</p>
                    </div>
                </div>
                <a class="get-goods" href="javascript:void(0);"></a>
                <a class="again" href="javascript:void(0);"></a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['message'],
    methods:{
        closeDialog(){
            $('.draw-content .prize').hide();
        }
    }
}
</script>

<style lang="less">
@keyframes showHide{
    from{
        opacity: 1;
    }to{
        opacity: 0;
    }
}
.prize{
    display: none;
    .warp{
        display: flex;
        justify-content: center;
        .wrapper{
            width: 563px;
            height: 653px;
            background: url('../../assets/image/luckdraw/labaji.png') center no-repeat;
            background-size: contain;
            position: relative;
            .draw{
                width: 420px;
                margin: 244px auto 0 auto;
                .list{
                    display: flex;
                    justify-content: space-between;
                    height: 196px;
                    overflow: hidden;
                    .goods{
                        width: 134px;
                        height: 588px;
                        background-size: 134px 100%;
                        background-position: left top;
                        background-repeat: repeat-y;
                    }
                }
            }
            .animation{
                position: absolute;
                display: block;
                width: 513px;
                height: 295px;
                background: url('../../assets/image/luckdraw/labajideng.png') center no-repeat;
                background-size: contain;
                left: 25px;
                top: 200px;
                animation:showHide 0.8s linear infinite;
            }
        }
        .result{
            display: none;
            width: 450px;
            height: 339px;
            background: url('../../assets/image/luckdraw/biaoqiandi.png') center no-repeat;
            background-size: contain;
            z-index: 51;
            margin-top: -46px;
            padding-top: 18px;
            position: relative;
            .success{
                width: 427px;
                height: 48px;
                background: url('../../assets/image/luckdraw/renpinbaofa.png') center no-repeat;
                background-size: contain;
                margin: 0 auto;
                position: absolute;
                top: -72px;
            }
            .goods-res{
                display: flex;
                align-items: center;
                padding-left: 40px;
                .img{
                    width: 120px;
                    height: 120px;
                    margin-right: 20px;
                    img{
                        width: 120px;
                        height: 120px;
                    }
                }
                .des{
                    text-align: center;
                    .p1{
                        font-size: 30px;
                        color: #ff3c3c;
                    }
                    .p2{
                        font-size: 30px;
                        color: #646464;
                    }
                }
            }
            .get-goods{
                display: block;
                width: 280px;
                height: 70px;
                background: url('../../assets/image/luckdraw/lijiquhuo.png') center no-repeat;
                background-size: contain;
                margin: 4px auto 30px auto;
            }
            .again{
                display: block;
                width: 280px;
                height: 70px;
                background: url('../../assets/image/luckdraw/zaihaiyiba.png') center no-repeat;
                background-size: contain;
                margin: 0 auto;
            }
        }
    }
}
</style>
