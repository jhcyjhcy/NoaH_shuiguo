<template>
    <div>
        <!--顶部title区-->
        <v-pageTitle vtitle="每日记账"></v-pageTitle>

        <!--内容区-->
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
                </el-col>
                <!--右边按钮组区-->
                <el-col :xs="24" :sm="24" :md="9" :lg="9">
                    <el-button-group>
                        <el-button icon="plus" @click="addSingleOrder">单条增加</el-button>
                        <el-button icon="upload2" @click="uploadExcel">多条追加</el-button>
                        <el-button icon="arrow-down" @click="excelExport">Excel导出</el-button>
                    </el-button-group>
                </el-col>
            </el-row>
            <hr>
            <!--表格区-->
            <div class="orderTable">
                <el-table ref="multipleTable" :data="orderList" border tooltip-effect="dark" style="width: 100%" v-loading="listLoading" element-loading-text="拼命加载中" >
                    <el-table-column label="基地" prop="OrganizeName" width="120">
                    </el-table-column>
                    <el-table-column label="开销·（元）" prop="AccountsCost" width="170">
                        <template scope="scope">
                            <span>
                                <h2 class="money">￥{{scope.row.AccountsCost}}</h2>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="账单明目" prop="AccountsName" width="300">
                    </el-table-column>
                    <el-table-column label="日期" prop="CreateDate" width="200">
                    </el-table-column>
                    <el-table-column label="备注" prop="Description">
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
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[20, 50, 100]" :page-size="pageRows" layout="total,sizes, prev, pager, next" :total="total">
            </el-pagination>
        </div>

        <!--弹出编辑或新增表单-->
        <el-dialog title="每日记账" :visible.sync="dialogFormVisible" size="large">
            <el-form :model="singleOrderList" :inline="true" label-position="right" label-width="160px">
                <el-form-item label="基地">
                    <el-input v-model="singleOrderList.OrganizeName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="开销·（元）">
                    <el-input v-model="singleOrderList.AccountsCost"></el-input>
                </el-form-item>
                <el-form-item label="账单明目">
                    <el-input v-model="singleOrderList.AccountsName"></el-input>
                </el-form-item>
                <el-form-item label="日期">
                    <!--<el-input v-model="singleOrderList.CreateDate"></el-input>-->
                    <el-date-picker type="date" placeholder="选择日期" v-model="singleOrderList.CreateDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="singleOrderList.Description"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="boxCancel">取 消</el-button>
                <el-button type="primary" @click="boxOk">确 定</el-button>
            </div>
        </el-dialog>

        <!--弹出上传框-->
        <el-dialog title="追加数据添加" :visible.sync="dialogUploadVisible" size="mini">
            <el-upload class="upload-demo" drag :action="this.$store.state.dateRecordExcelImportUrl" multiple :on-success="uploadSuccess" :before-upload="beforeUploadValid" :on-error="uploadFail">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">只能上传Excel文件，且不超过2MB</div>
            </el-upload>
        </el-dialog>

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
            formCheck: {         //form 组合查询
                selectValue: '',  // 下拉项
                userInput: ''     //用户输入项
            },
            pageRows: this.$store.state.pageRows,    //每页显示的记录条数
            listLoading: true,  // 表格加载
            orderList: [],  //表格数据
            multipleSelection: [],   //多选项
            isMultipleSelect: false,  //是否已多选，控制“发货”botton的disabled
            inputRules: {        //表单valid验证规则
                userInput: [{ required: true, message: '请输入你要查询的内容', trigger: 'blur' }],
                selectValue: [{ required: true, message: '请选择分类', trigger: 'blur' }]
            },
            currentPage: 1,   // 当前页
            total: 0,   // 共多少条记录
            dialogFormVisible: false,  //弹出表单控制
            dialogUploadVisible: false, //弹出上传框
            singleOrderList: [],    //弹出编辑时，单挑数据项
            tempOrderList: [],       //临时保存订单列表，放弃保存时可以还原
            editForm: {         // 弹出表单
                name: '',
                region: ''
            },
            isEditTime:false  // 是否编辑状态
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
        // 拉数据方法
        fetchData() {
            this.listLoading = true;
            let _this = this;
            // ajax取订单数据
            axios.get(_this.$store.state.dateRecordJsonUrl, {
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
                    // console.log(response);
                    // console.log(typeof(response.data.rows));
                    if (response.data) {
                        // JSON.parse(jsonstr); //可以将json字符串转换成json对象 
                        // JSON.stringify(jsonobj); //可以将json对象转换成json对符串 
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
            axios.get(_this.$store.state.dateRecordSelectJsonUrl, {
                params: {
                    __RequestVerificationToken: this.$store.state.token  //查询时，带上token
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
        // 过滤订单数据操作
        filterList() {
            // 首先判断用户是否输入了内容
            this.$refs['formCheck'].validate((valid) => {
                if (valid) {
                    this.listLoading = true;
                    let _this = this;
                    // ajax过滤数据
                    axios.get(_this.$store.state.dateRecordJsonUrl, {
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
        //**********编辑、删除**********
        // index: 当前索引  0
        // row:   当前行对象 object
        edite(index, row) {
            // console.log(index);
            // console.log(row);
            // 打开弹出表单
            this.dialogFormVisible = true;
            // 绑定当前编辑列表数据对象
            this.singleOrderList = row;
            // 临时保存订单列表
            this.tempOrderList = this.copyArr(this.orderList);
            this.isEditTime = true;
        },
        del(index, row) {
            this.$confirm('删除该条【订单】记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                this.listLoading = true;
                this.ajaxDelOrder(row);
            }).catch(() => {
                this.$message({ type: 'info', message: '已取消操作' });
            });
        },
        // 弹出编辑框的取消button操作
        boxCancel() {
            this.dialogFormVisible = false;
            this.$message({ type: 'info', message: '已取消操作' });
            if(this.isEditTime){
               //还原未修改前的orderlist
                this.orderList = this.copyArr(this.tempOrderList); 
            }
            this.isEditTime = false;  
        },
        boxOk() {
            this.$confirm('是否保存 结果?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ajaxSaveOrder();
            }).catch(() => {
                if(this.isEditTime){
               //还原未修改前的orderlist
                    this.orderList = this.copyArr(this.tempOrderList); 
                }
                this.isEditTime = false;
            });
        },
        //保存修改了的账数据
        ajaxSaveOrder() {
            let _this = this;
            //ajax保存修改的数据
            // console.log(this.singleOrderList.AccountsId);
            let qs = require("qs");
            axios.post(this.$store.state.dateRecordSaveJsonUrl, qs.stringify({
                params: {
                    __RequestVerificationToken: this.$store.state.token,
                    keyValue: this.singleOrderList.OrderId, //单条订单ID
                    AccountsId: this.singleOrderList.AccountsId, //单条记录ID
                    Accounts: this.singleOrderList         //单条订单集
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
        // 删除账目
        ajaxDelOrder(row) {
            let _this = this;
            let qs = require("qs");
            axios.post(this.$store.state.dateRecordDelJsonUrl, qs.stringify({
                params: {
                    __RequestVerificationToken: this.$store.state.token,
                    keyValue: row.AccountsId //单条订单ID
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
        // **********按钮组的操作**********
        // 单条增加
        addSingleOrder() {
            // console.log(this.singleOrderList);
            // 初始化新增列表页面
            this.initNullOrderList();
            // 打开弹出表单
            this.dialogFormVisible = true;
        },
        // 初始化新增的列表页面
        initNullOrderList() {
            this.singleOrderList = {
                "AccountsId": "",
                "OrganizeId": "",
                "OrganizeName": "",
                "AccountsName": "",
                "AccountsCost": "",
                "AccountsDate": "",
                "Description": "",
                "CreateDate": "",
                "CreateUserId": "",
                "CreateUserName": "",
                "ModifyDate": "",
                "ModifyUserId": "",
                "ModifyUserName": ""
            };
        },
        // 追加数据
        uploadExcel() {
            // 打开追加数据上传框
            this.dialogUploadVisible = true;
        },
        // 上传验证格式
        beforeUploadValid(file) {
            //Excel的file类型：
            // xlsx:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
            // xls:application/vnd.ms-excel
            let isExcel = false;
            if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                isExcel = true;
            } else if (file.type === 'application/vnd.ms-excel') {
                isExcel = true;
            }
            // console.log(file);
            // console.log("******");
            // console.log(file.type);
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isExcel) {
                this.$message.error('上传文件只能是 EXCEL 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 2MB!');
            }
            return isExcel && isLt2M;
        },
        // 上传excel成功
        uploadSuccess() {
            // console.log("uploadSuccess");
            this.$message({ type: 'success', message: '操作成功!' });
            this.dialogUploadVisible = false;
            this.fetchData();
        },
        // 上传失败
        uploadFail() {
            // console.log("uploadFail");
            this.$message({ type: 'error', message: '上传失败!' });
            this.dialogUploadVisible = false;
        },
        // excel导出
        excelExport() {
            // console.log("excelExport");
            // this.$message({ type: 'success', message: '导出成功!' });
            //直接打开新窗口
            window.open(this.$store.state.dateRecordExcelExportUrl);
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

<style slot-scope>
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
</style>