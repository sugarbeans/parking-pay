import Vue from "vue";
import Router from "vue-router";
import Home from "./components/HelloWorld";
Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: "/home",
            name: "home",
            meta: {
                keepAlive: false
            },
            component: Home
        },
        {
            path: "/error",
            name: "error",
            meta: {
                keepAlive: false
            },
            component: () => import('./components/Page404')
        },
        {
            path: "/",
            name: "/",
            meta: {
                keepAlive: false
            },
            component: Home
        },
    ]
});

router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title
        next() // 跳转
    }
    //滚到顶部
    window.scroll(0, 0);
    next() // 跳转
})

export default router
