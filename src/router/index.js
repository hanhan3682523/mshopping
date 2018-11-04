import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/view/Index'
import Detail from '@/view/Detail'
import My from '@/view/My'
import LuckDraw from '@/view/LuckDraw'

Vue.use(Router)

var router = new Router({
    routes: [{
            path: '/',
            name: 'Index',
            component: Index
        },
        {
            path: '/detail/:machineId/:goodsId',
            name: 'Detail',
            component: Detail
        },
        {
            path: '/my/:machineId',
            name: 'My',
            component: My,
            meta: {
                title: '个人中心'
            }
        },
        {
            path: '/luckdraw/:machineId/:goodsId',
            name: 'LuckDraw',
            component: LuckDraw,
            meta: {
                title: '幸运免单'
            }
        }
    ]
});

//修改title
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
    console.log('url1111:', location.href);
    /* 路由发生变化修改页面title */
    let _href = location.href;
    if (_href.indexOf('/?code=') > -1) {
        let _array1 = _href.split('?');
        let _newHref = _array1[0]+'?'+_array1[2]+'&'+ _array1[1].replace('#/','');
        window.history.pushState({}, 0, _newHref);
    }
});

export default router;
