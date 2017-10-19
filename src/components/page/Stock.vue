<template>
    <div>
        <v-pageTitle vtitle="基地仓库存"></v-pageTitle>
        <el-card class="box-card">
            <el-row :gutter="20">
                <!--左边查询区-->
                <el-col :xs="24" :sm="24" :md="15" :lg="15">
                    <el-form ref="formCheck" :inline="true" :rules="inputRules" :model="formCheck">
                        <!--下拉条件区-->
                        <!--prop属性为外层form表单:model的属性.chidren的值-->
                        <el-form-item prop="selectValue" label=" " required>
                            <el-select v-model="formCheck.selectValue" clearable placeholder="请选择" size="10">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!--输入条件区-->
                        <el-form-item prop="userInput">
                            <el-input v-model="formCheck.userInput" placeholder="查询内容" size="35" @keyup.13.native="filterList"></el-input>
                        </el-form-item>
                        <!--查询按钮-->
                        <el-form-item>
                            <el-button type="success" @click="filterList">查询</el-button>
                            <el-button type="warning" @click="resetList">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <!--您选择内容是：{{formCheck.selectValue}}<br>
                                查询的内容是：{{formCheck.userInput}}-->
                    <!--<hoverRow></hoverRow>-->
                </el-col>
                <!--右边按钮组区-->
                <el-col :xs="24" :sm="24" :md="9" :lg="9">
                    <el-button-group>
                        <el-button type="primary" v-show="!isEditStauts" :disabled="isEditStauts" @click="toggleEdit(1)">修改库存</el-button>
                        <el-button type="success" v-show="isEditStauts" :disabled="!isEditStauts" @click="toggleEdit(0)">保存修改</el-button>
                        <el-button type="danger" v-show="isEditStauts" :disabled="!isEditStauts" @click="cancelSaveStrock">放弃修改</el-button>
                        <el-button icon="arrow-down" @click="excelExport">Excel导出</el-button>
                    </el-button-group>
                </el-col>
                <!--当前状态是编辑状态吗:{{this.isEditStauts}}-->
            </el-row>
            <hr>
            <!--表格区-->
            <div class="orderTable">
                <el-table name="stockList" :data="orderList" border tooltip-effect="dark" style="width: 100%" v-loading="listLoading" element-loading-text="拼命加载中">
                    <!--序号-->
                    <el-table-column type="index" width="55">
                    </el-table-column>
                    <el-table-column label="商品名称" prop="GoodsName">
                    </el-table-column>
                    <el-table-column label="基地" prop="OrganizeName" width="200">
                    </el-table-column>
                    <el-table-column label="数量" prop="Number" width="180">
                        <!--库存量修改 变换按钮区-->
                        <template scope="props">
                            <div v-show="isEditStauts">
                                <!--复核加减input区-->
                                <span class="money">
                                    <el-input-number size="small" v-model="props.row.Number"></el-input-number>
                                </span>
                            </div>
                            <div v-show="!isEditStauts">
                                {{props.row.Number}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="重量" prop="Weight" width="180">
                        <!--重量修改 变换按钮区-->
                        <template scope="props">
                            <div v-show="isEditStauts">
                                <!--复核加减input区-->
                                <span class="money">
                                    <el-input-number size="small" v-model="props.row.Weight"></el-input-number>
                                </span>
                            </div>
                            <div v-show="!isEditStauts">
                                {{props.row.Weight}}
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <!--分页区-->
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[20, 50, 100]" :page-size="pageRows" layout="total,sizes, prev, pager, next" :total="total">
            </el-pagination>
        </div>

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
            options: [{ value: 'GoodsName', label: '商品名称' },
            { value: 'OrganizeName', label: '库存基地' }],
            formCheck: {         //form 组合查询
                selectValue: '',  // 下拉项
                userInput: ''     //用户输入项
            },
            pageRows: this.$store.state.pageRows,    //每页显示的记录条数
            listLoading: true,  // 表格加载
            orderList: [],  //表格数据
            tempList: [],   //临时保存数据表
            inputRules: {        //表单valid验证规则
                userInput: [{ required: true, message: '请输入你要查询的内容', trigger: 'blur' }],
                selectValue: [{ required: true, message: '请选择分类', trigger: 'blur' }]
            },
            currentPage: 1,   // 当前页
            total: 0,   // 共多少条记录
            isEditStauts: false // 是否已开启编辑状态
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
            axios.get(_this.$store.state.stocklistJsonUrl, {
                params: {
                    __RequestVerificationToken: this.$store.state.token,  //查询时，带上token
                    rows: this.pageRows,        //每页显示条数
                    page: this.currentPage,           //当前页码
                    sidx: 'CreateDate',  //排序列名
                    sord: 'desc'        //排序方式
                    // queryJson:{
                    //     "condition":"OrderCode", //查询列
                    //     "keyword":"1004" //查询内容
                    // }
                }
            })
                .then(function(response) {
                    //console.log(response);
                    if (response.data) {
                        _this.orderList = response.data.rows;
                        // 赋值分页
                        _this.total = response.data.records;
                        _this.currentPage = response.data.page;
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
        // **********按条件搜索操作**********
        // 过滤订单数据操作
        filterList() {
            // 首先判断用户是否输入了内容
            this.$refs['formCheck'].validate((valid) => {
                if (valid) {
                    this.listLoading = true;
                    let _this = this;
                    // ajax过滤数据
                    axios.get(_this.$store.state.stocklistJsonUrl, {
                        params: {
                            __RequestVerificationToken: this.$store.state.token,
                            rows: this.pageRows,        //每页显示条数
                            page: this.currentPage,           //当前页码
                            sidx: 'CreateDate',  //排序列名
                            sord: 'desc',        //排序方式
                            queryJson: {
                                "condition": _this.formCheck.selectValue, //查询列
                                "keyword": _this.formCheck.userInput //查询内容
                            }
                        }
                    })
                        .then(function(response) {
                            //console.log(response);
                            if (response.data) {
                                _this.orderList = response.data.rows;
                                _this.total = response.data.total;
                                _this.currentPage = response.data.page;
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
                } else {
                    // valid失败，用户没有输入信息时
                    this.$message({ message: '请填写完整', type: 'warning' });
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
        // excel导出
        excelExport() {
            // console.log("excelExport");
            // this.$message({ type: 'success', message: '导出成功!' });
            //直接打开新窗口
            window.open(this.$store.state.stockExcelExportUrl);
        },

        // **********分页操作**********
        // 当记录条数增加时
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            // 数据驱动方式:操纵‘每页显示数量’变量
            this.pageRows = val;
            this.fetchData();
        },
        // 当页面变换时
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            // 数据驱动方式:操纵‘当前页’变量，即可改变取数据方式
            this.currentPage = val;
            this.fetchData();
        },

        // 业务操作
        // 开启关闭表格编辑状态
        toggleEdit(flag) {
            //1:编辑状态 0：查看状态
            // 如果不是编辑状态，开启编辑
            // console.log(this.orderList.length);
            if (flag === 1) {
                if (this.orderList.length === 0) {
                    this.$message({ type: 'info', message: '没有数据噢~！' });
                    return false;
                }
                this.isEditStauts = true;
                // 开启编辑后，先将数据临时存在tempList里,用自定义函数
                this.tempList = this.copyArr(this.orderList);
                // 开启后，控制用户不能自由离开,vuex来控制
                this.$store.commit('canLeave', false);
            } else {
                // 如果是编辑状态，则询问:是否保存编辑后的数据
                this.$confirm('未保存的数据修改将丢失,决定放弃吗?', '提示', {
                    confirmButtonText: '保存数据',
                    cancelButtonText: '放弃操作',
                    type: 'warning'
                }).then(() => {
                    // 用户保存并提交数据库存储修改
                    this.ajaxSaveStock();
                    // 保存后，无论成功与否，将状态置回
                    this.isEditStauts = false;
                    this.$store.commit('canLeave', true);
                }).catch(() => {
                    // 用户选择不提交修改，则将store里的临时数据覆盖已修改的数据
                    this.orderList = this.copyArr(this.tempList);
                    this.$message({ type: 'info', message: '放弃保存' });
                    this.isEditStauts = false;
                    this.$store.commit('canLeave', true);
                });
            }
        },
        cancelSaveStrock() {
            // 用户选择不提交修改，则将store里的临时数据覆盖已修改的数据
            this.orderList = this.copyArr(this.tempList);
            this.$message({ type: 'info', message: '放弃保存' });
            this.isEditStauts = false;
            this.$store.commit('canLeave', true);
        },
        //ajax保存修改后的stock数据
        ajaxSaveStock() {
            this.listLoading = true;
            let _this = this;
            //ajax保存修改的数据
            // console.log(this.singleOrderList);
            let qs = require("qs");
            axios.post(this.$store.state.stockSaveJsonUrl, qs.stringify({
                params: {
                    __RequestVerificationToken: this.$store.state.token,
                    StockIds: '',       //单条修改时传送的ID值,此时设空
                    data: this.orderList //   打包将批量传送到后端进行校验
                }
            }))
                .then(function(response) {
                    _this.dialogFormVisible = false;
                    _this.$message({ type: 'success', message: response.data.message });
                    _this.fetchData();
                })
                .catch(function(err) {
                    _this.dialogFormVisible = false;
                    _this.$message({ message: '远程连接出错，请联系管理员', type: 'warning' });
                    _this.fetchData();
                });
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
    text-align: center;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
}
</style>