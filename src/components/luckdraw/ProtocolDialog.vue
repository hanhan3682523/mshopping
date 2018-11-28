<template>
    <div v-if="showProtocal" class="prptocol-dialog">
        <div class="prptocol">
            <div class="p-header">
                智购服务协议
                <a class="p-close" href="javascript:void(0)" @click="closeDialog"></a>
            </div>
            <!-- 协议内容 -->
            <div class="p-content">
                <p class="tindent2">欢迎申请使用杭州智购科技有限公司（以下简称“本公司”）提供的购买智购网联商城购物卡赠送“幸运免单”有奖销售平台服务（“幸运免单”指用户使用微信或支付宝支付一、三、五元不等金额购买智购网联商城购物卡，即赠送一次“幸运免单”抽奖活动，），本公司将严格遵循《中华人民共和国反不正当竞争法》管理条例。请您（下列简称为“用户”）仔细阅读以下内容。如用户不同意本服务条款任意内容，请勿继续使用幸运免单服务。如用户通过扫码进入点击“幸运免单”并勾选“我已阅读并同意《服务协议》”，即表示用户与本公司已达成协议，自愿接受本服务条款的所有内容。此后，用户不得以未阅读本服务条款内容作任何形式的抗辩。</p>
                <p class="title">一、用户使用“幸运免单”的前提条件</p>
                <p class="mb10">1、用户通过扫描售货机屏幕或者机身的二维码，微信或支付宝支付一、三、五元不等金额购买智购网联商城购物卡后获得赠送参与“幸运免单”活动资格。</p>
                <p class="mb10">2、用户在使用“幸运免单”时须具备相应的权利能力和行为能力，能够独立承担法律责任，如果用户在18周岁以下，必须在父母或监护人的监护下使用。</p>
                <p class="title">二、用户管理</p>
                <p>1、用户ID</p>
                <p class="mb10">用户扫码进入后，经过第三方授权登录（微信或支付宝）幸运免单时，本公司会为每位用户生成一个帐户ID，作为其使用幸运免单服务的唯一身份标识，用户需对其帐户项下的所有行为负责。</p>
                <p>2、用户资料</p>
                <p>用户在使用“幸运免单”服务时个人资料均来源于微信或支付宝，用户资料包括但不限于个人用户头像、昵称、性别等信息。</p>
                <p class="mb10">若用户帐号ID或帐号头像、昵称等资料存在违法信息的，本公司有权采取暂停使用等措施。</p>
                <p class="mb10">3、用户应当保证在使用“幸运免单”服务的过程中遵守诚实信用原则，不扰乱“幸运免单”服务的正常秩序，不得通过使用他人帐户、一人使用多个帐户、使用程序自动处理等非法方式损害他人或本公司的利益。</p>
                <p>4、若用户存在任何违法或违反本服务协议约定的行为，本公司有权视用户的违法或违规情况适用以下一项或多项处罚措施：</p>
                <p>（1）责令用户改正违法或违规行为；</p>
                <p>（2）中止、终止部分或全部服务；</p>
                <p>（3）取消用户“幸运免单”服务资格并取消商品的发放；</p>
                <p>（4）符合法律法规规定的情况下，本公司认为合适的其他措施。</p>
                <p class="mb10">若用户的行为造成本公司及其关联公司损失的，用户还应承担赔偿责任。</p>
                <p class="title">三、幸运免单的规则</p>
                <p>1、释义</p>
                <p class="mb10">用户需先选择并指定参与“幸运免单”的商品，支付一、三、五元不等金额购买智购网联商城购物卡后直接参与“幸运免单”活动。本公司根据用户提取0-10000的随机数  ，中奖的概率=支付金额除以商品总价。中奖种子数=中奖概率*10000。当随机数小于中奖种子数，即为中奖（本公司无权限控制），均则可获得用户选择并制定的商品。</p>
                <p class="mb10">2、本公司承诺遵循公平、公正、公开的原则运营幸运免单，确保所有用户在“幸运免单”中享受同等的权利与义务，结果向所有用户公示。</p>
                <p class="mb10">3、用户知悉，除本协议另有约定外，无论是否获得商品，用户用于购买智购网联商城购物卡并参与“幸运免单”的金额不能退回；其完全了解购买智购网联商城购物卡参与“幸运免单”活动的存在风险，本公司不保证用户参与“幸运免单”一定会获得商品。</p>
                <p class="mb10">4、用户通过购买智购网联商城购物卡参与“幸运免单”获得商品，用户可根据需求选择立即出货或存货，存货有效期180天，用户超出180天未取货的，视为放弃该商品，用户因此行为造成的损失，本公司不承担任何责任。</p>
                <p class="mb10">5、用户通过参与幸运免单获得的商品，如有质量问题，请联系当地商家。</p>
                <p>6、如果下列情形发生，本公司有权取消用户在幸运免单相关服务：</p>
                <p>（1）因不可抗力，本系统发生故障或遭受第三方攻击，或发生其他本公司无法控制的情形；</p>
                <p class="mb10">（2）根据本公司已经发布的或将来可能发布或更新的各类规则和规定取消的。</p>
                <p class="title">四、本服务协议的修改</p>
                <p>用户知晓本公司不时公布或修改的与本服务协议有关的规则、条款及公告是本服务协议的组成部分。本公司有权在必要时通过在幸运免单内发出公告等合理方式修改本服务协议，用户在享受各项服务时，应及时查阅了解修改的内容，并自觉遵守本服务协议。用户如继续使用本服务协议涉及的服务，则视为对修改内容的同意，如发生争议，以最新的服务协议为准；用户在不同意修改内容的情况下，有权停止使用本服务协议涉及的服务。如用户对本规则内容有任何疑问，可拨打客服电话（400—0227—188）</p>
                <p class="title">五、补充说明</p>
                <p>1、杭州智购科技有限公司仅作为第三方服务平台，为商家提供有奖销售方案和技术服务。</p>
                <p>2、智购网联商城购物卡为第三方提供，每单张面值为300元，用户通过累积购买满100元即可取卡，购物卡可在网联商城消费或抵扣使用。</p>
            </div>
            <!-- 同意 -->
            <div class="agree-p">
                <a class="agree-btn" href="javascript:void(0)" @click="agreePrptocol">同意并继续</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            //展示用户协议
            showProtocal:false
        }
    },
    methods:{
        /*
            关闭用户协议
        */
        closeDialog(){
            this.showProtocal = false;
        },

        /*
            同意用户协议
        */
        agreePrptocol(){
            this.showProtocal = false;
            this.$emit('agreeprotocol');
        }
    }
}
</script>

<style scoped lang="less">
.prptocol-dialog{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
    z-index: 50;
    padding-bottom: 20px;
    .prptocol{
        width: 730px;
        height: 950px;
        background: #ffffff;
        border-radius: 28px;
        .p-header{
            position: relative;
            height: 80px;
            line-height: 80px;
            font-size: 36px;
            color: #222222;
            text-align: center;
            font-weight: 700;
            .p-close{
                position: absolute;
                width: 42px;
                height: 42px;
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqBAMAAAA37dRoAAAAD1BMVEUAAAD////Pz8/Nzc3MzMwpOsoQAAAABHRSTlMAAUqdNnlE2wAAAHxJREFUKM/NkssNgCAQRKEDPxWY2ICRCpD+azISHBd4nnVPO8MLsB/n/hHTQmI9Bpk+xNtNm9w5RWWCfRBhUgM8uTk3wqJSFSpZo0U3aIFbNMNji2Z479ALTh2a4R59cfEGfg1/xlVgxdwd7CR3HSfE0+TJ85bwRvH2fR0ng+sjM6Zt/WcAAAAASUVORK5CYII=) no-repeat center;
                background-size: contain;
                top: 24px;
                right: 40px;
            }
        }

        .p-content{
            height: 750px;
            overflow-y: scroll;
            padding: 20px;
            background: #f5f5f5;
            p{
                font-size: 28px;
                line-height: 42px;
                color: #222;
            }
            //空两格
            .tindent2{
                text-indent:2em;
            }
            .title{
                font-weight: 600;
                margin: 20px 0 0 10px;
            }
            .mb10{
                margin-bottom: 18px;
            }
        }
        .agree-p{
            height: 120px;
            padding-top: 15px;
            .agree-btn{
                display: block;
                width: 680px;
                height: 90px;
                line-height: 90px;
                font-size: 36px;
                color: #fff;
                text-align: center;
                margin: 0 auto;
                background-image: linear-gradient(-90deg,#ff8f00 0,#f50 97%);
                border-radius: 28px;
            }
        }
    }
}
</style>
