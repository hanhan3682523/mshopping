<template>
    <!-- 未中奖 -->
    <div class="no-prize">
        <div class="dialog">
            <div class="no-prize-content">
                <i class="no-close"></i>
                <i class="icon"></i>
                <p class="des">竟然没有中奖，一定是姿势不对~</p>
                <div class="btn-group">
                    <a class="btn left" href="javascript:void(0);"></a>
                    <a class="btn right" href="javascript:void(0);" @click="tryAgain"></a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods:{
        tryAgain(){
            let _this = this;
            $('.draw-content .no-prize,.draw-content .prize').hide();
            setTimeout(function(){
                //直接跳到付款
                _this.$emit('tryagin');
            },10);
        }
    }
}
</script>

<style lang="less">
.no-prize{
    display: none;
    z-index: 52;
    .no-prize-content{
        width: 670px;
        height: 450px;
        background: #fff;
        border-radius: 8PX;
        position: relative;
        padding-top: 78px;
        .no-close{
            display: block;
            position: absolute;
            right: 18px;
            top: 26px;
            width: 60px;
            height: 60px;
            background-image: url('../../assets/image/luckdraw/close.png');
            background-size: 31px 31px;
            background-repeat: no-repeat;
            background-position: center;
        }
        .icon{
            display: block;
            width: 101px;
            height: 100px;
            background-image: url('../../assets/image/luckdraw/biaqing.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            margin: 0 auto;
        }
        .des{
            font-size: 28px;
            line-height: 28px;
            text-align: center;
            color: #000;
            margin-top: 48px;
        }
        .btn-group{
            display: flex;
            justify-content: center;
            margin-top: 68px;
            .btn{
                display: block;
                height: 74px;
                width: 224px;
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                &.left{
                    background-image: url('../../assets/image/luckdraw/wancheng.png');
                    margin-right: 36px;
                }
                &.right{
                    background-image: url('../../assets/image/luckdraw/jixu.png');
                }
            }
        }
    }
}
</style>
