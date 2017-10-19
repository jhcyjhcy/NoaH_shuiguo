<template>
    <div>
        <v-pageTitle vtitle="库存事务记录"></v-pageTitle>

        <el-card class="box-card">
            <el-row :gutter="20">
                <!--左边查询区-->
                <el-col :xs="24" :sm="24" :md="13" :lg="13">
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
                            <el-input v-model="formCheck.userInput" placeholder="查询内容" size="25" @keyup.13.native="filterList"></el-input>
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
                <el-col :xs="24" :sm="24" :md="11" :lg="11">
                    <el-button-group>
                        <el-button type="primary" @click="inStock">进仓</el-button>
                        <el-button type="primary" @click="outStock">损耗</el-button>
                        <el-button type="success" icon="arrow-down" @click="templateDownload">批量模板下载</el-button>
                        <el-button icon="plus" @click="uploadInStock">批量进仓</el-button>
                        <el-button icon="minus" @click="uploadOutStock">批量损耗</el-button>
                    </el-button-group>
                </el-col>
            </el-row>
            <hr>
            <!--表格区-->
            <div class="orderTable">
                <el-table ref="multipleTable" :data="orderList" border tooltip-effect="dark" style="width: 100%" v-loading="listLoading" element-loading-text="拼命加载中">
                    <el-table-column label="订单号" prop="OrderCode" width="150">
                    </el-table-column>
                    <el-table-column label="商品" prop="GoodsName">
                    </el-table-column>
                    <el-table-column label="基地" prop="OrganizeName" width="180">
                    </el-table-column>
                    <el-table-column label="数量" prop="Number" width="120">
                    </el-table-column>
                    <el-table-column label="重量" prop="Weight" width="120">
                    </el-table-column>
                    <el-table-column label="单价" prop="Price" width="120">
                        <template scope="scope">
                            <h3>￥{{scope.row.Price}}</h3>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作方式" prop="Status" width="120">
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
        <!--分页区-->
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[20, 50, 100]" :page-size="pageRows" layout="total,sizes, prev, pager, next" :total="total">
            </el-pagination>
        </div>

        <!--进仓弹出页面-->
        <el-dialog title="仓库·进仓" :visible.sync="inStockFormVisible" size="large">
            <el-form :model="inStockList" :inline="true" label-position="right" label-width="160px">
                <el-form-item label="订单号">
                    <el-input v-model="inStockList.OrderCode"></el-input>
                </el-form-item>
                <el-form-item label="商品">
                    <el-input v-model="inStockList.GoodsName"></el-input>
                </el-form-item>
                <el-form-item label="基地">
                    <el-input v-model="inStockList.OrganizeName"></el-input>
                </el-form-item>
                <el-form-item label="数量">
                    <el-input v-model="inStockList.Number"></el-input>
                </el-form-item>
                <el-form-item label="重量">
                    <el-input v-model="inStockList.Weight"></el-input>
                </el-form-item>
                <el-form-item label="单价">
                    <el-input v-model="inStockList.Price"></el-input>
                </el-form-item>
                <!--<el-form-item label="操作方式">
                    <el-input v-model="inStockList.Status" value="0"></el-input>
                </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="inStockBoxCancel">取 消</el-button>
                <el-button type="primary" @click="inStockBoxOk">确 定</el-button>
            </div>
        </el-dialog>
        <!--损耗的弹出页面-->
        <el-dialog title="仓库·损耗" :visible.sync="outStockFormVisible" size="large">
            <el-form :model="outStockList" :inline="true" label-position="right" label-width="160px">
                <el-form-item label="订单号">
                    <el-input v-model="outStockList.OrderCode"></el-input>
                </el-form-item>
                <el-form-item label="商品">
                    <el-input v-model="outStockList.GoodsName"></el-input>
                </el-form-item>
                <el-form-item label="基地">
                    <el-input v-model="outStockList.OrganizeName"></el-input>
                </el-form-item>
                <el-form-item label="数量">
                    <el-input v-model="outStockList.Number"></el-input>
                </el-form-item>
                <el-form-item label="重量">
                    <el-input v-model="outStockList.Weight"></el-input>
                </el-form-item>
                <el-form-item label="单价">
                    <el-input v-model="outStockList.Price"></el-input>
                </el-form-item>
                <!--<el-form-item label="操作方式">
                    <el-input v-model="outStockList.Status" value="2"></el-input>
                </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="outStockBoxCancel">取 消</el-button>
                <el-button type="primary" @click="outStockBoxOk">确 定</el-button>
            </div>
        </el-dialog>

        <!--批量进仓弹出框 上传组件-->
        <el-dialog title="进仓批量操作" :visible.sync="inStockUploadVisible" size="mini">
            <el-upload class="upload-demo" drag :action="this.$store.state.inStockUploadUrl" multiple :on-success="inStockUploadSuccess" :before-upload="beforeUploadValid" :on-error="uploadFail">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">只能上传Excel文件，且不超过2MB</div>
            </el-upload>
        </el-dialog>

        <!--批量损耗弹出框 上传组件-->
        <el-dialog title="损耗批量操作" :visible.sync="outStockUploadVisible" size="mini">
            <el-upload class="upload-demo" drag :action="this.$store.state.outStockUploadUrl" multiple :on-success="outStockUploadSuccess" :before-upload="beforeUploadValid" :on-error="uploadFail">
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
            options: [{ value: 'orderno', label: '订单号' },
            { value: 'goodName', label: '商品名称' },
            { value: 'goodBase', label: '基地' },
            { value: 'option', label: '操作方式' }],
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
            // dialogFormVisible: false,  //弹出表单控制
            inStockFormVisible: false,  //弹出进仓页面
            outStockFormVisible: false,  //弹出损耗页面
            inStockUploadVisible: false, //进仓批量
            outStockUploadVisible: false, //损耗批量
            // singleOrderList:[],
            inStockList: [],     //进仓数据list
            outStockList: [],    //损耗数据list
            editForm: {         // 弹出表单
                name: '',
                region: ''
            }
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
            axios.get(_this.$store.state.stockRecordJsonUrl, {
                params: {
                    __RequestVerificationToken: this.$store.state.token,  //查询时，带上token
                    rows: this.pageRows,        //每页显示条数
                    page: this.currentPage,           //当前页码
                    sidx: 'CreateDate',  //排序列名
                    sord: 'desc'        //排序方式
                }
            })
                .then(function(response) {
                    //console.log(response);
                    if (response.data) {
                        _this.orderList = response.data.store;
                        // 赋值分页
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
        // **********按条件搜索操作**********
        // 过滤订单数据操作
        filterList() {
            // 首先判断用户是否输入了内容
            this.$refs['formCheck'].validate((valid) => {
                if (valid) {
                    // console.log(1);
                    // console.log(valid);
                    // this.$message({message: '成功',type: 'success'})
                    this.listLoading = true;
                    let _this = this;
                    // ajax过滤数据
                    axios.get(_this.$store.state.orderlistFilterJsonUrl, {
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
        //**********右边导航按钮区**********
        // 进仓
        inStock() {
            this.inStockFormVisible = true;
            this.inStockList = [];
        },
        // 损耗
        outStock() {
            this.outStockFormVisible = true;
            this.outStockList = [];
        },
        // 批量进仓
        uploadInStock() {
            this.inStockUploadVisible = true;
        },
        // 批量损耗
        uploadOutStock() {
            this.outStockUploadVisible = true;
        },
        // 弹出进仓的按钮button操作
        inStockBoxCancel() {
            this.inStockFormVisible = false;
            this.$message({ type: 'info', message: '已取消操作' });
        },
        inStockBoxOk() {
            this.$confirm('是否保存 结果?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ajaxSaveStock(this.inStockList,this.inStockFormVisible,0);
                // this.inStockFormVisible = false;
                // this.$message({ type: 'success', message: '操作成功!' });
                // this.fetchData();
            }).catch(() => {
                this.inStockList = [];
                this.$message({ type: 'info', message: '已取消操作' });
            });

        },
        //弹出损耗的按钮button操作
        outStockBoxCancel() {
            this.outStockFormVisible = false;
            this.$message({ type: 'info', message: '已取消操作' });
        },
        outStockBoxOk() {
            this.$confirm('是否保存 结果?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ajaxSaveStock(this.outStockList,this.outStockFormVisible,2);
            }).catch(() => {
                this.outStockList = [];
                this.$message({ type: 'info', message: '已取消操作' });
            });

        },
        //进仓or损耗 保存ajax操作
        ajaxSaveStock(list,stockForm,flag){
            let _this = this;
            list.Status = flag;
            //ajax保存修改的数据
            // console.log(this.singleOrderList);
            let qs = require("qs");
            axios.post(this.$store.state.stockRecordSaveJsonUrl, qs.stringify({
                params: {
                    __RequestVerificationToken: this.$store.state.token,
                    keyValue: list.StockDetailId, //单条订单ID
                    StockDetail: list         //单条订单集
                }
            }))
                .then(function(response) {
                    _this.outStockFormVisible = false;
                    _this.inStockFormVisible = false;
                    _this.$message({ type: 'success', message: response.data.message });
                    _this.fetchData();
                })
                .catch(function(err) {
                    _this.outStockFormVisible = false;
                    _this.inStockFormVisible = false;
                    _this.$message({ message: '远程连接出错，请联系管理员', type: 'warning' });
                    _this.fetchData();
                });
        },
        // **********上传组件**********
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
            console.log(file);
            console.log("******");
            console.log(file.type);
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isExcel) {
                this.$message.error('上传文件只能是 EXCEL 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 2MB!');
            }
            return isExcel && isLt2M;
        },
        // 进仓上传excel成功
        inStockUploadSuccess() {
            this.$message({ type: 'success', message: '操作成功!' });
            this.inStockUploadVisible = false;
            this.fetchData();
        },
        // 损耗上传excel成功
        outStockUploadSuccess() {
            this.$message({ type: 'success', message: '操作成功!' });
            this.outStockUploadVisible = false;
            this.fetchData();
        },
        // 上传失败
        uploadFail() {
            console.log("uploadSuccess");
            this.$message({ type: 'error', message: '上传失败!' });
            this.inStockUploadVisible = false;
            this.outStockUploadVisible = false;
        },
        //批量模板下载
        templateDownload() {
            // this.$message({ type: 'success', message: '导出成功!' });
            //直接打开新窗口
            window.open(this.$store.state.stockRecordExcelExportUrl);
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
</style>