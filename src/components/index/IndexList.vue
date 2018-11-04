<template>
    <div>
        <div class="index-list">
            <yd-tab v-model="selectTab" :callback="fn" :prevent-default="false" :item-click="itemClick" active-color="#ff3c3c" font-size="0.24rem" color="#646464" height="0.8rem">
                <yd-tab-panel v-for="(item,index) in items" :label="item.label" :key="index"></yd-tab-panel>
            </yd-tab>
        </div>
        <yd-infinitescroll :callback="loadList" ref="goodsListScroll">
            <article class="goods-list" slot="list">
                <a v-for="(item, index) in getList" :key="index" class="goods-list-item" v-if="item.CurrStock>0" @click="linkToDetail(getMachineInfo.machineId,item.goodsId)">
                    <!-- <router-link :to="{ name: 'Detail', params: {
                        machineId:getMachineInfo.machineId,
                        goodsId: item.goodsId
                        }}"> -->
                    <div class="goods-list-img">
                        <img slot="goodsImg" :src="item.goodsImg">
                    </div>
                    <div class="goods-list-title">
                        <span slot="goodsName">{{item.goodsName.substring(0,3)}}</span>
                    </div>
                    <div class="goods-list-price">
                        <span class="price"><em>¥</em>{{item.goodsPrice}}</span>
                    </div>
                    <!-- </router-link> -->
                </a>
            </article>
            <!-- 数据全部加载完毕显示 -->
            <span slot="doneTip">~~~~我是有底线的~~~~</span>
        </yd-infinitescroll>
    </div>
</template>

<script>
import Vue from 'vue';
import IndexList from './IndexList'
import { Tab, TabPanel } from 'vue-ydui/dist/lib.rem/tab';
import { Loading } from 'vue-ydui/dist/lib.rem/dialog';
//公共方法
import { Common } from '../../utils/common.js'
Vue.component(Tab.name, Tab);
Vue.component(TabPanel.name, TabPanel);
Vue.prototype.$dialog = {
    loading: Loading,
};
export default {
    data() {
        return {
            //当前选中项
            selectTab: 0
        }
    },
    computed: {
        getMachineInfo() {
            return this.$store.getters.getMachineInfo;
        },
        items() {
            return this.$store.getters.getGoodsCategory;
        },
        getList() {
            return this.$store.getters.getGoodsList;
        }
    },
    methods: {
        fn(label, key) {
            //切换时触发
        },
        //Tab页签点击事件
        itemClick(key) {
            //如果当前已选中，就不刷新
            if (key == this.selectTab) {
                return;
            }
            this.selectTab = key;
            let _this = this;
            _this.$dialog.loading.open('数据加载中');
            _this.$store.dispatch('getGoodsListAjax', {
                _this: _this,
                refresh: true,
                type: _this.items[key].content
            });
        },
        //商品点击事件
        linkToDetail(machineId, goodsId) {
            let _this = this;
            if (Common.getSessionInfo('wechatinfo')) {
                _this.$router.push({ path: '/detail/' + machineId + '/' + goodsId });
            } else {
                //先判断是否授权，未授权的话，调用授权接口
                _this.$store.dispatch('wechatAuth', {
                    isIndex: false
                });
            }
        },
        loadList() {
            var _this = this;
            _this.$store.dispatch('getGoodsListAjax', {
                _this: _this,
                refresh: false
            });
        }
    },
    mounted() {
        console.log('加载数据');
        //初始化页面完成后自动执行
        var _this = this;
        _this.$dialog.loading.open('数据加载中');
        _this.$store.dispatch('getGoodsCategoryAjax');
        _this.$store.dispatch('getGoodsListAjax', {
            _this: _this,
            refresh: true
        });
    }
}
</script>

<style lang="less">
.goods-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 38px;
    padding-left: 38px;
    .goods-list-item {
        display: block;
        width: 216px;
        height: 308px;
        border-radius: 12px;
        background-color: #ffffff;
        margin-right: 16px;
        margin-bottom: 12px;
        .goods-list-img {
            height: 0;
            width: 100%;
            padding: 50% 0;
            overflow: hidden;
            img {
                width: 100%;
                margin-top: -50%;
                border: none;
                display: block;
                padding: 14px 8px 8px 8px;
            }
        }

        .goods-list-title {
            text-align: center;
            margin-top: 8px;
            .title {
                font-size: 24px;
                color: #000000;
            }
        }

        .goods-list-price {
            text-align: center;
            margin-top: 18px;
            .price {
                font-size: 24px;
                color: #ff0000;
            }
        }
    }
}
</style>
