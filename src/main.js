// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import ElementUI from "element-ui";
//引入element-ui的默认CSS样式
import "element-ui/lib/theme-default/index.css";
// import "@/utils/http"; //axois 拦截处理

Vue.use(ElementUI);
Vue.config.productionTip = false;

import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import store from "@/store/index";
import { Message } from "element-ui";
import LoginTimeOut from "@/utils/LoginTimeOut";

router.beforeEach((to, from, next) => {
  // 页面跳转前，先判断用户在当前页面是否还有未完成操作？
  // 有：不允许跳转
  // 无：可以跳转
  if (!store.state.canLeaveMenu) {
    Message({
      message: "还有未完成操作：请先【保存修改】后，再退出页面!",
      type: "error"
    });
    return false;
  }
  // console.log(store.state.canLeaveMenu);
  NProgress.start();
  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    if (store.state.token) {
      // 通过vuex state获取当前的token是否存在
      // 判断登录是否过期
      if (LoginTimeOut.isExpired("userinfo")) {
        console.log("登录过期");
        // 登录过期
        Message({
          message: "上次登录超过半小时了，请重新登录!",
          type: "error"
        });
        next("/login");
        //return false;
      } else {
        next();
        LoginTimeOut.maxAge(1000 * 60 * 30).set("userinfo", {
          name: "jhcy",
          age: "18"
        });
      }
    } else {
      next({
        path: "/login",
        query: {
          redirect: to.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next();
  }
  NProgress.done();
  // // 判断是否有token
  // if (localStorage.getItem("Admin-Token")) {
  //   // -------------有权限-------------
  //   // 避免已登录后，再进入登录页面
  //   // console.log(1+"有权限:"+to.path+":"+from.path)
  //   if (to.path === '/login') {
  //     // console.log(2+"有权限,并且访问了login:"+to.path)
  //     next({
  //       path: '/'
  //     });
  //   } else {
  //     // 进入页面
  //     // console.log(3+"有权限，没访问login:"+to.path)
  //     next();
  //   }
  //   NProgress.done(); // 结束Progress
  // } else {
  //   // -------------没有权限-------------
  //   // 如果是登录页面路径，就直接next()
  //   // console.log(4+"没权限:"+to.path)
  //   if (to.path === '/login') {
  //     // console.log(5+"没权限，访问了login:"+to.path)
  //     next();
  //   } else {
  //     // 不然就跳转到登录；
  //     // console.log(6+"没权限，访问了不该访问的:"+to.path)
  //     next('/login');
  //   }
  //   NProgress.done(); // 结束Progress
  // }
});

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  template: "<App/>",
  components: {
    App
  }
});
