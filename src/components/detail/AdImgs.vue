<template>
    <div class="recommend">
        <!-- <a class="link" href="javascript:void(0);">
            <span class="des">广告</span>
            <img src="https://oss.suning.com/aps/aps_learning/image/429081201/20181017/9a2bb58f3adb40ad83445479610e558f.jpg?from=mobile">
        </a> -->
        <yd-slider autoplay="3000">
            <yd-slider-item v-for="(item, index) in adList" :key="index">
                <router-link :to="{ name: 'Detail', params: {machineId:$route.params.machineId,goodsId: item.SourceId}}">
                    <a class="link" href="javascript:void(0);">
                        <span class="des">广告</span>
                        <img :src="item.SourceUrl">
                    </a>
                </router-link>
            </yd-slider-item>
        </yd-slider>
    </div>
</template>

<script>
//域名
import host from '../../utils/host';
export default {
    data(){
        return {
            adList:[]
        }
    },
    methods:{
        getList(){
            let _this = this;
            //获取广告
            let _url =host.shopping +  '/api/Hi/GetAd';
            let _param = {
                machineId:_this.$route.params.machineId
            };
            _this.$get(_url,_param).then(function(res){
                // let _list = [];
                // _list = [
                //     {
                //         img:'http://static.ydcss.com/uploads/ydui/1.jpg',
                //         link:'https://m.suning.com'
                //     },{
                //         img:'http://static.ydcss.com/uploads/ydui/2.jpg',
                //         link:'https://m.suning.com'
                //     },{
                //         img:'http://static.ydcss.com/uploads/ydui/3.jpg',
                //         link:'https://m.suning.com'
                //     }
                // ];
                if(res && res.RetObj && res.RetObj.length > 0){
                    _this.adList =res.RetObj;
                }
            });
        }
    },
    created(){
        this.getList();
    }
}
</script>

<style lang="less">
//广告
.recommend {
    text-align: center;
    padding-bottom: 50px;
    padding-top: 22px;
    .yd-slider{
        width: 700px;
        height: 300px;
        margin: 0 auto;
    }
    .link {
        display: inline-block;
        position: relative;
        width: 700px;
        height: 300px;
        .des {
            display: block;
            width: 70px;
            height: 40px;
            background: rgba(0, 0, 0, 0.3);
            line-height: 40px;
            position: absolute;
            color: #ffffff;
            font-size: 20px;
            right: 0;
            top: 0;
        }
        img {
            width: 700px;
            height: 300px;
            border-radius: 8px;
        }
    }
}
</style>
