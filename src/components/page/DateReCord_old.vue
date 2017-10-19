<template>
    <div>
        <v-pageTitle vtitle="每日记账"></v-pageTitle>

        <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <el-card class="box-card">
                    <!--form上半区-->
                    <el-form ref="form1" :inline="true" :model="formInline" :rules="inputRules">
                        <!--prop属性为外层form表单:model的属性.chidren的值-->
                        <el-form-item prop="selectValue">
                            <el-select v-model="formInline.selectValue" clearable placeholder="选择基地" size="10">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="content">
                            <el-input v-model="formInline.content" placeholder="输入账单明目" size="36"></el-input>
                        </el-form-item>
                        <el-form-item label="费用(元)">
                            <el-input-number :min="0" v-model="formInline.price" placeholder="费用(元)"></el-input-number size="25">
                        </el-form-item>
                        <el-form-item prop="date">
                            <el-date-picker v-model="formInline.date" type="date" placeholder="选择日期" size="8">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                    <!--form下半区-->
                    <el-form ref="form2" :model="formInline" class="demo-form-inline">
                        <el-row :gutter="20">
                            <el-col :xs="24" :sm="24" :md="18" :lg="18">

                                <el-form-item>
                                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="formInline.remark" placeholder="备注" size="large">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="6" :lg="6">
                                <el-form-item>
                                    <el-button type="primary" @click="add">记一笔</el-button>
                                    <el-button type="warning" @click="reset">清空</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>

                    <!--您填的内容是：<br>
                                                <p>账目：{{this.formInline.content}}</p>
                                                <p>花费：{{this.formInline.price}}</p>
                                                <p>日期：{{this.formInline.date}}</p>
                                                <p>备注：{{this.formInline.remark}}</p>-->
                    <hr>
                    <!--表格区-->
                    <div class="orderTable">
                        <el-table name="stockList" :data="orderList" border tooltip-effect="dark" style="width: 100%" v-loading="listLoading" element-loading-text="拼命加载中">
                            <el-table-column label="基地" prop="content" width="120">
                            </el-table-column>
                            <el-table-column label="开销·（元）" prop="price" width="170">
                                <template scope="scope">
                                    <span>
                                        <h2 class="money">￥{{scope.row.price}}.00</h2>
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="账单明目" prop="content" width="300">
                            </el-table-column>
                            <el-table-column label="日期" prop="date" width="200">
                            </el-table-column>
                            <el-table-column label="备注" prop="remark">
                            </el-table-column>
                            <!--固定列 操作-->
                            <el-table-column fixed="right" label="操作" width="100">
                                <template scope="scope">
                                    <el-button type="text" size="small" @click="edite(scope.$index, scope.row)">编辑</el-button>
                                    <el-button type="text" size="small" @click="del(scope.$index, scope.row)">删除</el-button>
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
            options: [{ value: 'OrderCode', label: '红心猕猴桃基地' },
            { value: 'Consignee', label: 'A基地' },
            { value: 'ExpressOrder', label: 'B基地' }],
            formInline: {
                selectValue: '',
                content: '',
                price: 0,
                date: '',
                remark: ''
            },
            pageRows: this.$store.state.pageRows,    //每页显示的记录条数
            listLoading: true,  // 表格加载
            orderList: [],  //表格数据
            inputRules: {        //表单日期下来valid验证规则
                content: [{ required: true, message: '请输入账目', trigger: 'change' }],
                date: [{ type: 'date', required: true, message: '日期要选咯', trigger: 'change' }],
                selectValue: [{ required: true, message: '按基地录入', trigger: 'change' }],
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
        // 拉取select框的基地列表
        this.fetchSelectValue();
    },
    methods: {
        // **********初始化操作**********
        // 拉数据方法
        fetchData() {
            this.listLoading = true;
            let _this = this;
            // ajax取订单数据
            axios.get(process.env.API_HOST+_this.$store.state.dateRecordJsonUrl, {
                params: {
                    token: this.$store.state.token,  //查询时，带上token
                    rows: this.pageRows,        //每页显示条数
                    page: this.currentPage,           //当前页码
                    sidx: 'CreateDate',  //排序列名
                    sord: 'desc'        //排序方式
                }
            })
                .then(function(response) {
                    //console.log(response);
                    if (response.data) {
                        _this.orderList = response.data.rows;
                        // 赋值分页
                        _this.total = response.data.records;  //总记录数
                        _this.currentPage = response.data.page; //当前页码
                    } else {
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
        // 获取select框中的基地列表
        fetchSelectValue() {
            let _this = this;
            // ajax取订单数据
            axios.get(process.env.API_HOST+_this.$store.state.dateRecordSelectJsonUrl, {
                params: {
                    token: this.$store.state.token  //查询时，带上token
                }
            })
                .then(function(response) {
                    //console.log(response);
                    if (response.data) {
                        // 赋值下拉框
                        _this.options = response.data.rows;
                        // 赋值分页
                        _this.total = response.data.records;  //总记录数
                        _this.currentPage = response.data.page; //当前页码
                    } else {
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
        // 业务操作
        //添加记录
        add() {
            this.$refs['form1'].validate((valid) => {
                if (valid) {
                    // this.$message({ message: '记账成功', type: 'success' });
                    // this.fetchData();
                    this.ajaxSave();
                } else {
                    this.$message({ type: 'info', message: '请填写完成' });
                    return false;
                }
            });
        },
        // 新增账单记录
        ajaxSave() {
            let _this = this;
            //ajax保存修改的数据
            axios.get(process.env.API_HOST+this.$store.state.orderSaveJsonUrl, {
                params: {
                    token: this.$store.state.token,
                    keyValue: '',           //新增记录时，保存为空
                    Accounts: this.formInline         // 新增的form集合
                }
            })
                .then(function(response) {
                    _this.$message({ type: 'error', message: response.data.message });
                    _this.fetchData();
                })
                .catch(function(err) {
                    _this.$message({ message: '远程连接出错，请联系管理员', type: 'warning' });
                    _this.fetchData();
                });
        },
        //清空
        reset() {
            this.$refs['form1'].resetFields();
            this.formInline.price = 0;
            this.formInline.remark = "";
        },
        //**********编辑、删除**********
        // index: 当前索引  0
        // row:   当前行对象 object
        edite(index, row) {
            // 打开弹出表单
            this.dialogFormVisible = true;
            // 绑定当前编辑列表数据对象
            this.singleOrderList = row;
            // 临时保存订单列表
            this.tempOrderList = this.copyArr(this.orderList);
        },
        del(index, row) {
            this.$confirm('删除该条【订单】记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                this.listLoading = true;
                this.ajaxDelOrder();
            }).catch(() => {
                this.$message({ type: 'info', message: '已取消操作' });
            });
        },
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