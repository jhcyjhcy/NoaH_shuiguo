import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/common/Home";
// import DashBoard from '@/components/page/DashBoard';
// import Login from '@/components/page/Login';
// import OrderManage from '@/components/page/OrderManage';
// import DeliverGoods from '@/components/page/DeliverGoods';
// import Stock from '@/components/page/Stock';
// import DateCount from '@/components/page/DateCount';
// import StockRecord from '@/components/page/StockRecord';
// import DateReCord from '@/components/page/DateReCord';
const DashBoard = resolve => require(["@/components/page/DashBoard"], resolve);
const Login = resolve => require(["@/components/page/Login"], resolve);
const OrderManage = resolve =>
  require(["@/components/page/OrderManage"], resolve);
const DeliverGoods = resolve =>
  require(["@/components/page/DeliverGoods"], resolve);
const Stock = resolve => require(["@/components/page/Stock"], resolve);
const DateCount = resolve => require(["@/components/page/DateCount"], resolve);
const StockRecord = resolve =>
  require(["@/components/page/StockRecord"], resolve);
const DateReCord = resolve =>
  require(["@/components/page/DateReCord"], resolve);

Vue.use(Router);

export default new Router({
  mode: "hash", // 'history',
  base: __dirname,
  routes: [
    {
      path: "/",
      component: Home,
      // redirect: "/DashBoard",
      // meta: {
      //   requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      // },
      children: [
        {
          path: "",
          redirect: "/DashBoard"
        },
        {
          //首页
          path: "/DashBoard",
          component: DashBoard,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          //订单管理
          path: "/OrderManage",
          component: OrderManage,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          //发货管理
          path: "/DeliverGoods",
          component: DeliverGoods,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          //仓库管理
          path: "/Stock",
          component: Stock,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          //每日统计
          path: "/DateCount",
          component: DateCount,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          //仓库记录
          path: "/StockRecord",
          component: StockRecord,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        },
        {
          //每日记账
          path: "/DateReCord",
          component: DateReCord,
          meta: {
            requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
          }
        }
      ]
    },
    {
      path: "/login",
      component: Login
    },
    // 访问不到时，重新定位到login
    {
      path: "*",
      redirect: "/login"
    }
  ]
});
