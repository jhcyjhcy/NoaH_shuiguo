import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const code = {
  9000: '无权访问',
  9001: '登录时效',
};

// const UrlApi = 'http://192.168.2.233:6688';
// const UrlApi = 'http://localhost';
// console.log(process.env.BASE_API);
// const UrlApi = process.env.BASE_API;

const state = {
  username: localStorage.getItem("Username"), // 登录的用户名
  token: localStorage.getItem("Admin-Token"), // 令牌
  name: localStorage.getItem("Name"), // 登录用户的称呼
  baseName:localStorage.getItem("BaseName"), // 基地名称
  sendGoods: 0, //发送了的货物
  canLeaveMenu: true, //判断页面的操作是否完成，能否离开
  pageRows: 20, //每页显示的记录条数配置
  excelUploadUrl: 'https://jsonplaceholder.typicode.com/posts/', //excel订单追加的地址
  

// 登录json区
  loginJsonUrl: process.env.BASE_API+'/Login/CheckLogin', //登录json
  validPicUrl: process.env.BASE_API+'/Login/VerifyCode', //登录验证码
// 驾驶舱json区
  dashBoradJsonUrl:process.env.BASE_API+'/Report/GetDashbordOrderEchart',  //驾驶舱的数据请求
// 订单管理json区
  orderlistJsonUrl:process.env.BASE_API+'/Order/GetPageListJson', //取订单数据json
  orderlistFilterJsonUrl: process.env.BASE_API+'/Order/GetPageListJson', //过滤订单数据后的json
  orderSaveJsonUrl:process.env.BASE_API+'/Order/SaveForm',  //订单保存json
  orderDelJsonUrl:process.env.BASE_API+'/Order/RemoveForm',  //订单删除json
  orderSendGoodsJsonUrl:process.env.BASE_API+'/Order/GetSendedPageList',  //订单发货
  orderExcelExportUrl:process.env.BASE_API+'/Order/ExportOrderList', //订单excel导出
  orderExcelImportUrl:process.env.BASE_API+'/Order/ImportsOrderList', //订单excel导入
// 发货管理json区
  sendGoodsListJsonUrl:process.env.BASE_API+'/Order/GetSendedPageListJson',   //发货管理列表
// 仓库管理json区
  stocklistJsonUrl: process.env.BASE_API+'/Stock/GetPageListJson', //基地仓库的json
  stockSaveJsonUrl:process.env.BASE_API+'/Stock/SaveForm',  //保存仓库数量修改
  stockExcelExportUrl:process.env.BASE_API+'/Stock/ExportStockList', //导出库存
// 仓库记录json区
  stockRecordJsonUrl: process.env.BASE_API+'/StockDetail/GetPageListJson', //库存明细记录json
  stockRecordSaveJsonUrl: process.env.BASE_API+'/StockDetail/SaveForm', //库存明细 保存json
  stockRecordExcelExportUrl:process.env.BASE_API+'/StockDetail/ExportStockDetailList', //库存记录模板导出
  inStockUploadUrl: process.env.BASE_API+'/StockDetail/ImportStockDetailsList', //excel仓库批量进仓地址
  outStockUploadUrl: process.env.BASE_API+'/StockDetail/ImportsLossStockDetailList', //excel仓库批量损耗地址
// 每日统计json区
  dateCountJsonUrl: process.env.BASE_API+'/Report/GetDaySummarize', //每日统计json
// 每日记账json区
  dateRecordJsonUrl: process.env.BASE_API+'/Accounts/GetPageList', //每日记账json
  dateRecordSaveJsonUrl:process.env.BASE_API+'/Accounts/SaveForm', //每日记账保存
  dateRecordDelJsonUrl:process.env.BASE_API+'/Accounts/RemoveForm', //每日记账删除
  dateRecordSelectJsonUrl:process.env.BASE_API+'/Organizer/GetListJson', //查询时，基地列表
  dateRecordExcelExportUrl:process.env.BASE_API+'/Accounts/ExportAccountsList',  //每日记账导出
  dateRecordExcelImportUrl:process.env.BASE_API+'/Accounts/ImportAccountsList' // 每日记账导入
};

const mutations = {
  clear(state) {
    state.username = '';
    state.token = '';
    state.name = '';
  },
  // 修改canLeaveMenu变量，控制是否可以离开当前页
  canLeave(state, value) {
    state.canLeaveMenu = value;
  }
}

export default new Vuex.Store({
  code,
  state,
  mutations
});
