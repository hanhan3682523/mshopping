<template>
    <header class="header">
        <div class="header-wrap">
            <!-- 左侧箭头 -->
            <i class="left-icon"></i>
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
            <!-- 个人中心 -->
            <div class="my-center" @click="linkToMy">
                <i v-if="!getUserInfo.nickname" class="photo"></i>
                <img v-if="getUserInfo.nickname" class="photo" :src="getUserInfo.headimgurl" />
                <span class="des">个人中心</span>
            </div>
        </div>
    </header>
</template>

<script>
//公共方法
import {
    Common
} from '../../utils/common.js'
export default {
    props: ["title", "routerSrc"],
    data() {
        return {}
    },
    computed: {
        getMachineInfo() {
            return this.$store.getters.getMachineInfo;
        },
        //获取用户信息
        getUserInfo() {
            return Common.getSessionInfo('wechatinfo') || this.$store.getters.getUserInfo || {};
        }
    },
    methods: {
        //个人中心
        linkToMy() {
            let _this = this;
            if (Common.getSessionInfo('wechatinfo')) {
                _this.$router.push({ path: '/my/'+_this.getMachineInfo.machineId });
            } else {
                //先判断是否授权，未授权的话，调用授权接口
                _this.$store.dispatch('wechatAuth', {
                    isIndex: false
                });
            }
        },
    }
}
</script>

<style lang="less">
.header {
    height: 132px;
    background: #ffffff;
    border-bottom: 2px solid #d7d7d7;
    .header-wrap {
        height: 100%;
        display: flex;
        align-items: center;
        padding-left: 35px;
        // 左侧箭头
        .left-icon {
            display: block;
            width: 18px;
            height: 30px;
            background: url("../../assets/image/qiehuan.png") center no-repeat;
            background-size: contain;
            margin-right: 36px;
        }
        // 店信息
        .shop-info {
            display: flex;
            height: 100%;
            justify-content: center;
            flex-direction: column;
            flex: 1;
            .no-info {
                display: flex;
                margin-bottom: 12px;
                align-items: center;
                .icon {
                    display: block;
                    width: 25px;
                    height: 30px;
                    background: url("../../assets/image/shouhuoji.png") center
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
                    background: url("../../assets/image/dizhi.png") center
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
        // 个人中心
        .my-center {
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            padding-right: 46px;
            height: 100%;
            .photo {
                display: block;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: url("../../assets/image/touxiangdi.png") center
                    no-repeat;
                background-size: contain;
            }
            .des {
                font-size: 20px;
                color: #646464;
            }
        }
    }
}
</style>