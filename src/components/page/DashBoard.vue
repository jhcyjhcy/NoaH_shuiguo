<template>
    <div>
        <v-pageTitle vtitle="统计驾驶舱"></v-pageTitle>
        <div class="clear"></div>

        <el-row :gutter="20">
            <!--今日利润-->
            <el-col :xs="12" :sm="12" :md="12" :lg="6">
                <el-card class="box-card">
                    <el-row :gutter="6">
                        <el-col :xs="24" :sm="8" :md="8" :lg="8">
                            <div>
                                <el-progress type="circle" :percentage="dateSailMoney.percent" :width="80"></el-progress>
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="11" :md="12" :lg="12">
                            <div class="cart-string">
                                <span>今日销售·
                                    <span style="font-size:14px;">元</span>
                                </span>
                                <span>
                                    <h2 class="getMoney">￥{{dateSailMoney.money}}</h2>
                                </span>
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="5" :md="4" :lg="4">
                            <div>
                                <!--<i class="material-icons">replay</i>-->
                                <i class="iconfont icon-zhangdan dashIcon"></i>
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <!--今日订单-->
            <el-col :xs="12" :sm="12" :md="12" :lg="6">
                <el-card class="box-card">
                    <el-row :gutter="6">
                        <el-col :xs="24" :sm="8" :md="8" :lg="8">
                            <div>
                                <el-progress type="circle" :percentage="dateOrders.percent" :width="80"></el-progress>
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="11" :md="12" :lg="12">
                            <div class="cart-string">
                                <span>今日订单·
                                    <span style="font-size:14px;">单</span>
                                </span>
                                <span>
                                    <h2>{{dateOrders.num}}</h2>
                                </span>
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="5" :md="4" :lg="4">
                            <div>
                                <i class="material-icons">touch_app</i>
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <!--总利润·-->
            <el-col :xs="12" :sm="12" :md="12" :lg="6">
                <el-card class="box-card">
                    <el-row :gutter="6">
                        <el-col :xs="24" :sm="8" :md="8" :lg="8">
                            <div>
                                <el-progress type="circle" :percentage="totalSailMoney.percent" :width="80"></el-progress>
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="11" :md="12" :lg="12">
                            <div class="cart-string">
                                <span>今日花费·
                                    <span style="font-size:14px;">元</span>
                                </span>
                                <span>
                                    <h2 class="money">￥{{totalSailMoney.money}}</h2>
                                </span>
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="5" :md="4" :lg="4">
                            <div>
                                <!--<i class="material-icons">attach_money</i>-->
                                <i class="material-icons">replay</i>
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <!--销售总量-->
            <el-col :xs="12" :sm="12" :md="12" :lg="6">
                <el-card class="box-card">
                    <el-row :gutter="6">
                        <el-col :xs="24" :sm="8" :md="8" :lg="8">
                            <el-progress type="circle" :percentage="totalNum.percent" :width="80"></el-progress>
                            <!--<i class="iconfont icon-jifen dashIcon"></i>-->
                        </el-col>
                        <el-col :xs="24" :sm="11" :md="12" :lg="12">
                            <div class="cart-string">
                                <span>今日销量·
                                    <span style="font-size:14px;">斤</span>
                                </span>
                                <span>
                                    <h2>{{totalNum.num}}</h2>
                                </span>
                            </div>
                        </el-col>
                        <el-col :xs="24" :sm="5" :md="4" :lg="4">
                            <div>
                                <!--<i class="material-icons">person_outline</i>-->
                                <i class="iconfont icon-jifen dashIcon"></i>
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="12">
                <el-card class="box-chart">
                    <!--<pieChart></pieChart>-->
                    <dateOrder :dataOrder="dataOrder"></dateOrder>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12">
                <el-card class="box-chart">
                    <!--<lineChart></lineChart>-->
                    <weekMoney :dataOrder="dataOrder"></weekMoney>
                </el-card>
            </el-col>
        </el-row>

        <!--todoList  & mail & table-->
        <!--<el-row :gutter="20">
                    <el-col :xs="24" :sm="24" :md="24" :lg="8">
                        <el-card class="box-list">
                            To Do List<hr>
                            <TodoList></TodoList>
                        </el-card>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="10">
                        <el-card class="box-list">
                             BORDERED TABLE
                           <hr>
                           <borderTable></borderTable>
                        </el-card>
                    </el-col>

                    <el-col :xs="24" :sm="24" :md="24" :lg="6">
                        <el-card class="box-list">
                             Message List
                           <hr>
                           <MessageList></MessageList>
                        </el-card>
                    </el-col> 
                </el-row>-->
        <!--版权申明-->
        <vPageCopyright></vPageCopyright>
    </div>
</template>

<script>
import vPageTitle from '../common/pageTitle.vue';
import vPageCopyright from '../common/pageCopyright.vue';

import dateOrder from '../charts/dateOrder.vue';
import weekMoney from '../charts/weekMoney.vue';

import store from '@/store/index'
import axios from 'axios';

export default {
    store: store,
    data() {
        return {
            //percentage:10
            dataOrder: {},      // 传给子组件的props函数接口
            dateSailMoney:{     // 今日销售额
                percent:0,
                money:0
            },
            dateOrders:{     // 今日订单
                percent:0,
                num:0
            },
            totalSailMoney:{     // 总销售额
                percent:0,
                money:0
            },
            totalNum:{     // 销售总量
                percent:0,
                num:0
            }
        }
    },
    created() {
        let _this = this;
        // 创建时，去拉去统计图数据
        axios.get(_this.$store.state.dashBoradJsonUrl, {
            params: {
                __RequestVerificationToken: this.$store.state.token  //查询时，带上token
            }
        })
            .then(function(response) {
                // console.log(response.data);
                if (response.data) {
                    _this.dataOrder = response.data;
                    _this.dateSailMoney = response.data.dateSailMoney;
                    _this.dateOrders = response.data.dateOrders;
                    _this.totalSailMoney = response.data.totalSailMoney;
                    _this.totalNum = response.data.totalNum;
                }
            })
            .catch(function(err) {
                console.log(err);
            });
        // this.dataOrder = {
        //     data: ['芒果', '苹果', '梨子', '猕猴桃', '西瓜'],
        //     value: [
        //         { name: '芒果', data: [320, 302, 301, 334, 390, 330, 320], color: '#63bbb2' },
        //         { name: '苹果', data: [220, 182, 191, 234, 290, 330, 310], color: '#ef8989' },
        //         { name: '梨子', data: [530, 600, 301, 554, 490, 330, 710], color: '#6cc5df' },
        //         { name: '猕猴桃', data: [820, 832, 901, 934, 1290, 1330, 1320], color: '#b1ce4d' },
        //         { name: '西瓜', data: [520, 432, 601, 734, 990, 1130, 1020], color: '#b1ae4e' }
        //     ]
        // };
    },
    components: {
        vPageTitle, vPageCopyright,
        // barChart,pieChart,lineChart,radarChart,funnelChart,TodoList,borderTable,MessageList,
        dateOrder, weekMoney
    }
}
</script>

<style scoped>
.el-col {
    margin-bottom: 16px;
    text-align: center;
}

.material-icons {
    font-size: 80px;
    color: #ddd;
}

.box-card {
    height: 110px;
}

.cart-string {
    height: 100px;
    padding-top: 10px;
    font-size: 1.1rem;
}

.box-chart {
    height: 420px;
}

.box-list {
    height: auto;
    text-align: left;
}

.box-list hr {
    height: 1px;
    border: none;
    border-top: 1px dashed #ccc;
    margin-bottom: 5px;
    margin-top: 6px;
}

.dashIcon {
    font-size: 70px;
    opacity: 0.3;
}

.money {
    color: #D76565;
    font-size: 22px;
    font-weight: bold;
    margin: 0 10px;
}

.getMoney {
    color: #358a1a;
    font-size: 22px;
    font-weight: bold;
    margin: 0 10px;
}
</style>