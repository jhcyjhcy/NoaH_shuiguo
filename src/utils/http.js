import axios from "axios";
import qs from "qs";
import { Message } from "element-ui";
import stroe from '@/store';
import router from "@/router";

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 10000, // 请求超时时间 10秒
  responseType: "json",
  withCredentials: true, //是否允许带cookie
  paramsSerializer: function(params) {  //参数序列化
    return Qs.stringify(params);
  },
  headers: {
    // formData : http传送体文件类型
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  }
});

// request拦截器
// 让每个请求携带自定义token
service.interceptors.request.use(
  config => {
    // console.log("request-token:" + this.$store.state.token);
    // 在发送请求之前做某件事
    // qs序列化数据
    console.log("hi, i am a  http!");
    if (config.method === "post" || config.method === "put" || config.method === "delete") { 
      console.log('我们需要序列化');
      config.data = qs.stringify(config.data);
      console.log('序列化：'+config.data);
    }
    // 带上token
    if (localStorage.getItem("Admin-Token")) {
      config.headers["Admin-Token"] = localStorage.getItem("Admin-Token");
    }
    return config;
  },
  error => {
    // Do something with request error
    // console.log(error); // for debug
    // Promise.reject(error);
    Message({
      //  消息弹窗组件,类似toast
      showClose: true,
      message: error,
      type: "error.data.error.message"
    });
    return Promise.reject(error.data.error.message);
  }
);

// respone拦截器
// 这里拦截401错误，并重新跳入登页重新获取token
service.interceptors.response.use(
  response => {
    // console.log("response-token:" + this.$store.state.token);
    return response;
    /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    // const res = response.data;
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.data,
    //     type: "error",
    //     duration: 5 * 1000
    //   });

    //   // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     MessageBox.confirm("你已被登出，可以取消继续留在该页面，或者重新登录", "确定登出", {
    //       confirmButtonText: "重新登录",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }).then(() => {
    //       //   store.dispatch('FedLogOut').then(() => {
    //       //     location.reload()// 为了重新实例化vue-router对象 避免bug
    //       //   })
    //       // 退出，清空本地localStorage存储
    //       localStorage.clear();
    //       this.$store.commit("clear");
    //       this.$router.push("login");
    //     });
    //   }
    //   return Promise.reject("error");
    // } else {
    //   return response.data;
    // }
  },
  error => {
    // console.log("err" + error); // for debug
    // Message({
    //   message: error.message,
    //   type: "error",
    //   duration: 5 * 1000
    // });
    // return Promise.reject(error);
    if (error.response) {
      switch (error.response.status) {
        //授权失败后
        case 401:
          // 这里写清除token的代码
          localStorage.clear();
          this.$store.commit("clear");
          router.replace({
            path: "login",
            query: { redirect: router.currentRoute.fullPath } //登录成功后跳入浏览的当前页面
          });
      }
    }
    return Promise.reject(error.response.data);
  }
);

export default service;
// export default {
//   install: function(Vue, Option) {
//     Object.defineProperty(Vue.prototype, "$http", { value: service });
//   }
// };
