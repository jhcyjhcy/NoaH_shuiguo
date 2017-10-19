<template>
    <div>
        <v-pageTitle vtitle="每日统计"></v-pageTitle>

        <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <el-card class="box-card">
                    <!--左边查询区-->
                    <el-form ref="formCheck" :inline="true" :rules="inputRules" :model="formCheck">
                        <!--下拉条件区-->
                        <!--prop属性为外层form表单:model的属性.chidren的值-->
                        <el-form-item prop="selectValue" label="选择查询日期" required>
                            <el-date-picker v-model="formCheck.selectValue" type="date" placeholder="按每日">
                            </el-date-picker>
                        </el-form-item>
                        <!--查询按钮-->
                        <el-form-item>
                            <el-button type="success" @click="filterList">查询</el-button>
                            <el-button type="warning" @click="resetList">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <!--您选择的日期是：{{this.formCheck.selectValue}}-->
                    <hr>
                    <!--表格区-->
                    <div class="orderTable">
                        <el-table name="stockList" :data="orderList" border tooltip-effect="dark" style="width: 100%" v-loading="listLoading" element-loading-text="拼命加载中">
                            <el-table-column label="基地" prop="goodBase">
                            </el-table-column>
                            <el-table-column label="日开销·（元）" prop="dateUseMoney" width="200">
                                <template scope="scope">
                                    <span>
                                        <h2 class="money">￥{{scope.row.dateUseMoney}}.00</h2>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="日订单总量·（单）" prop="orderNum" width="200">
                            </el-table-column>
                            <el-table-column label="日销售总量·（斤）" prop="sailNum" width="180">
                            </el-table-column>
                            <el-table-column label="日销售总价·（元）" prop="sailMoneyNum" width="180">
                                <template scope="scope">
                                    <span>
                                        <h2 class="getMoney">￥{{scope.row.sailMoneyNum}}.00</h2>
                                    </span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
                <!--分页区-->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[20, 50, 100]" :page-size="pageRows" layout="total,sizes, prev, pager, next" :total="total">
            </el-pagination>
            </el-col>
        </el-row>

        <!--版权申明-->
        <vPageCopyright></vPageCopyright>
    </div>
</template>

<script>
import vPageTitle from '../common/pageTitle.vue';
import vPageCopyright from '../common/pageCopyright.vue';

import store from '@/store/index'
import axios from 'axios';

export default {
    store,  //vuex 状态数据
    data() {
        return {
            formCheck: {         //form 组合查询
                selectValue: ''  // 下拉项
            },
            pageRows: this.$store.state.pageRows,    //每页显示的记录条数
            listLoading: true,  // 表格加载
            orderList: [],  //表格数据
            inputRules: {        //表单日期下来valid验证规则
                selectValue: [{ type: 'date', required: true, message: '请选择您想查询的日期', trigger: 'change' }]
            },
            currentPage: 1,   // 当前页
            total: 0   // 共多少条记录
        }
    },
    components: {
        vPageTitle, vPageCopyright,
    },
    mounted() {
    },
    created() {
        // 创建表格组件时，拉取数据
        this.fetchData();
    },
    methods: {
        // **********初始化操作**********
        // 拉数据方法
        fetchData() {
            this.listLoading = true;
            let _this = this;
            // ajax取订单数据
            axios.get(_this.$store.state.dateCountJsonUrl, {
                params: { 
                    __RequestVerificationToken: this.$store.state.token  //查询时，带上token
                 }
            })
                .then(function(response) {
                    //console.log(response);
                    if (response.data) {
                        _this.orderList = response.data.rows;
                        // 赋值分页
                        _this.total = response.data.records;
                        _this.currentPage = response.data.page;
                    }else{
                        _this.$message({ message: response.data.message, type: 'error' });
                    }
                    _this.listLoading = false;
                })
                .catch(function(err) {
                    // console.log(err);
                    _this.$message({ message: '远程连接出错，请联系管理员', type: 'warning' });
                    _this.listLoading = false;
                });
        },
        // **********按条件搜索操作**********
        // 过滤订单数据操作
        filterList() {
            // 首先判断用户是否输入了内容
            this.$refs['formCheck'].validate((valid) => {
                if (valid) {
                    this.listLoading = true;
                    let _this = this;
                    // ajax过滤数据
                    axios.get(_this.$store.state.dateCountJsonUrl, {
                        params: {
                            date: this.formCheck.selectValue
                        }
                    })
                        .then(function(response) {
                            if (response.data) {
                                _this.orderList = response.data.rows;
                                _this.total = response.data.total;
                                _this.currentPage = response.data.page;
                            }
                            _this.listLoading = false;
                        })
                        .catch(function(err) {
                            // console.log(err);
                            _this.$message({ message: '远程连接出错，请联系管理员', type: 'warning' });
                            _this.listLoading = false;
                        });
                } else {
                    // valid失败，用户没有输入信息时
                    return false;
                }
            });
        },
        // 重置操作
        resetList() {
            //重置所有input和select到初始值
            this.$refs['formCheck'].resetFields();
            this.fetchData();
        },

        // **********分页操作**********
        // 当选择记录【显示数量】变换时
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            // 数据驱动方式:操纵‘每页显示数量’变量
            this.pageRows = val;
            this.fetchData();
        },
        // 【页码翻页】时，取后台数据
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            // 数据驱动方式:操纵‘当前页’变量，即可改变取数据方式
            this.currentPage = val;
            this.fetchData();
        },

        // 工具函数：数组（内含对象）的复制
        copyArr(arr) {
            return arr.map((e) => {
                if (typeof e === 'object') {
                    return Object.assign({}, e)
                } else {
                    return e
                }
            })
        }
    }
}
</script>

<style scoped>
.box-card {
    font-size: 12px;
}

.box-card hr {
    height: 1px;
    border: none;
    border-top: 1px dashed #ccc;
    margin-bottom: 10px;
    margin-top: 6px;
}




/*覆盖form表单底部margin*/

.el-col {
    margin-bottom: 0px;
}

.orderTable {
    font-size: 12px;
}



/*表格样式*/

.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf !important;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
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