<template>
    <div class="index-wrap">
        <!-- <div style="word-break: break-all;">{{url}}</div>
        <br>
        <div style="word-break: break-all;">{{getUrl}}</div> -->
        <!-- 头部 -->
        <IndexHeader />
        <!-- 商品列表 -->
        <IndexList />
        <!-- 返回顶部 -->
        <yd-backtop></yd-backtop>
    </div>
</template>

<script>
//头部组件
import IndexHeader from '../components/index/IndexHeader'
//商品列表
import IndexList from '../components/index/IndexList'

export default {
    //使用的组件
    components: {
        IndexHeader,
        IndexList
    },
    data() {
        return {
            url: location.href
        }
    },
    computed: {
        getUrl() {
            return this.$store.getters.getUrl;
        }
    },
    methods: {

    },
    beforeCreate(){
        console.log('code6666666666:', location.href);
        this.url = this.url + '新URL地址：' + location.href;
        let _code = '';
        if (location.href.indexOf('code=') > -1) {
            let _str = location.href.split('code=')[1];
            _code = _str.split('&')[0];
        }
        //设置授权code
        this.$store.commit('setAuthCode', _code);
        //设置机器信息
        this.$store.commit('setMachineId', location.href.split("machineId=")[1].split("&")[0]);
        //授权信息
        this.$store.dispatch('wechatAuth', {
            isIndex: false
        });
        //获取机器信息
        this.$store.dispatch('getMachineInfo');
    },
    mounted() {
        if(location.href.indexOf('debug=true')>-1){
            try{
                sessionStorage.setItem('debug','true');
            }catch(e){
                alert('不支持sessionStorage');
            }
        }
    }
}
</script>

<style lang="less">
.index-wrap {
}
</style>