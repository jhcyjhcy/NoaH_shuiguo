<template>
    <div>
        <v-pageTitle vtitle="发货仓·打印订单"></v-pageTitle>
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
            </el-row>
            <hr>
            <!--表格区-->
            <div class="orderTable">
                <el-table ref="multipleTable" :data="orderList" border tooltip-effect="dark" style="width: 100%" v-loading="listLoading" element-loading-text="拼命加载中">
                    <!--折叠表格-->
                    <el-table-column type="expand">
                        <!--折叠区-->
                        <template scope="props">
                            <el-form label-position="left" inline class="demo-table-expand">
                                <el-form-item label="订单ID">
                                    <span>{{ props.row.OrderId }}</span>
                                </el-form-item>
                                <el-form-item label="订单号">
                                    <span>{{ props.row.OrderCode }}</span>
                                </el-form-item>
                                <el-form-item label="收件人姓名">
                                    <span>{{ props.row.Consignee }}</span>
                                </el-form-item>
                                <el-form-item label="收件人单位">
                                    <span>{{ props.row.ConsigneeCompany }}</span>
                                </el-form-item>
                                <el-form-item label="收件人手机">
                                    <span>{{ props.row.ConsigneeMobile }}</span>
                                </el-form-item>
                                <el-form-item label="收件人电话">
                                    <span>{{ props.row.ConsigneePhone }}</span>
                                </el-form-item>
                                <el-form-item label="收件人省">
                                    <span>{{ props.row.ConsigneeProvince }}</span>
                                </el-form-item>
                                <el-form-item label="收件人市">
                                    <span>{{ props.row.ConsigneeCity }}</span>
                                </el-form-item>
                                <el-form-item label="收件人区">
                                    <span>{{ props.row.ConsigneeDistrict }}</span>
                                </el-form-item>
                                <el-form-item label="收件人地址">
                                    <span>{{ props.row.ConsigneeAddress }}</span>
                                </el-form-item>
                                <el-form-item label="发件人姓名">
                                    <span>{{ props.row.Sender }}</span>
                                </el-form-item>
                                <el-form-item label="发件人单位（店铺）">
                                    <span>{{ props.row.SenderCompany }}</span>
                                </el-form-item>
                                <el-form-item label="发件人手机">
                                    <span>{{ props.row.SenderMobile }}</span>
                                </el-form-item>
                                <el-form-item label="发件人电话">
                                    <span>{{ props.row.SenderPhone }}</span>
                                </el-form-item>
                                <el-form-item label="发件人省">
                                    <span>{{ props.row.SenderProvince }}</span>
                                </el-form-item>
                                <el-form-item label="发件人市">
                                    <span>{{ props.row.SenderCity }}</span>
                                </el-form-item>
                                <el-form-item label="发件人区">
                                    <span>{{ props.row.SenderDistrict }}</span>
                                </el-form-item>
                                <el-form-item label="发件人地址">
                                    <span>{{ props.row.SenderAddress }}</span>
                                </el-form-item>
                                <el-form-item label="商品名称">
                                    <span>{{ props.row.GoodsName }}</span>
                                </el-form-item>
                                <el-form-item label="重量">
                                    <span>{{ props.row.GoodsWeight }}</span>
                                </el-form-item>
                                <el-form-item label="代收货款">
                                    <span>{{ props.row.GoodsAccounts }}</span>
                                </el-form-item>
                                <el-form-item label="商品数量">
                                    <span>{{ props.row.GoodsNumber }}</span>
                                </el-form-item>
                                <el-form-item label="备注">
                                    <span>{{ props.row.Description }}</span>
                                </el-form-item>
                                <el-form-item label="快递公司">
                                    <span>{{ props.row.Express }}</span>
                                </el-form-item>
                                <el-form-item label="快递单号">
                                    <span>{{ props.row.ExpressOrder }}</span>
                                </el-form-item>
                                <el-form-item label="打印时间">
                                    <span>{{ props.row.PrintTime }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <!--未折叠的表格-->
                    <!--序号-->
                    <!--<el-table-column type="index"  width="53">
                    </el-table-column>-->
                    <!--打印筛选-->
                    <el-table-column prop="Status" label="状态" width="130" :filters="[{text:'已打印',value:'2'}, {text:'未打印',value:'0'}]" :filter-method="filterTag" filter-placement="bottom-end">
                        <template scope="scope">
                            <!--<el-badge value="new" class="item"></el-badge>   value="新"-->
                            <el-tag :type="scope.row.Status === '2' ? 'success' : 'warning'" close-transition>{{scope.row.Status==='2'?'已打印':'未打印'}}</el-tag>
                        </template>

                    </el-table-column>
                    <el-table-column label="订单号" prop="OrderCode" width="150">
                    </el-table-column>
                    <el-table-column label="商品" prop="GoodsName" width="170">
                    </el-table-column>
                    <el-table-column label="收件人" prop="Consignee" width="120">
                    </el-table-column>
                    <el-table-column label="发件人" prop="Sender" width="120">
                    </el-table-column>
                    <el-table-column label="快递单号" prop="ExpressOrder" width="170">
                    </el-table-column>
                    <el-table-column label="打印时间" prop="dzsj" width="170">
                    </el-table-column>
                    <!--固定列 操作-->
                    <el-table-column fixed="right" label="操作" width="100">
                        <template scope="scope">
                            <el-button type="primary" size="small" :disabled="scope.row.Status === '2' ? true : false" @click="printDialog(scope.$index, scope.row)">打印</el-button>
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

        <!--弹出打印表单-->
        <el-dialog title="订单详情页" :visible.sync="dialogFormVisible" size="large">
            <el-form :model="singleOrderList" :inline="true" label-position="right" label-width="160px">
                <el-form-item label="订单号">
                    <el-input v-model="singleOrderList.OrderCode"></el-input>
                </el-form-item>
                <el-form-item label="收件人姓名">
                    <el-input v-model="singleOrderList.Consignee"></el-input>
                </el-form-item>
                <el-form-item label="收件人单位">
                    <el-input v-model="singleOrderList.ConsigneeCompany"></el-input>
                </el-form-item>
                <el-form-item label="收件人手机">
                    <el-input v-model="singleOrderList.ConsigneeMobile"></el-input>
                </el-form-item>
                <el-form-item label="收件人电话">
                    <el-input v-model="singleOrderList.ConsigneePhone"></el-input>
                </el-form-item>
                <el-form-item label="收件人省">
                    <el-input v-model="singleOrderList.ConsigneeProvince"></el-input>
                </el-form-item>
                <el-form-item label="收件人市">
                    <el-input v-model="singleOrderList.ConsigneeCity"></el-input>
                </el-form-item>
                <el-form-item label="收件人区">
                    <el-input v-model="singleOrderList.ConsigneeDistrict"></el-input>
                </el-form-item>
                <el-form-item label="收件人地址">
                    <el-input v-model="singleOrderList.ConsigneeAddress"></el-input>
                </el-form-item>
                <el-form-item label="发件人姓名">
                    <el-input v-model="singleOrderList.Sender"></el-input>
                </el-form-item>
                <el-form-item label="发件人单位（店铺）">
                    <el-input v-model="singleOrderList.SenderCompany"></el-input>
                </el-form-item>
                <el-form-item label="发件人手机">
                    <el-input v-model="singleOrderList.SenderMobile"></el-input>
                </el-form-item>
                <el-form-item label="发件人电话">
                    <el-input v-model="singleOrderList.SenderPhone"></el-input>
                </el-form-item>
                <el-form-item label="发件人省">
                    <el-input v-model="singleOrderList.SenderProvince"></el-input>
                </el-form-item>
                <el-form-item label="发件人市">
                    <el-input v-model="singleOrderList.SenderCity"></el-input>
                </el-form-item>
                <el-form-item label="发件人区">
                    <el-input v-model="singleOrderList.SenderDistrict"></el-input>
                </el-form-item>
                <el-form-item label="发件人地址">
                    <el-input v-model="singleOrderList.SenderAddress"></el-input>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input v-model="singleOrderList.GoodsName"></el-input>
                </el-form-item>
                <el-form-item label="重量">
                    <el-input v-model="singleOrderList.GoodsWeight"></el-input>
                </el-form-item>
                <el-form-item label="代收货款">
                    <el-input v-model="singleOrderList.GoodsAccounts"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="singleOrderList.GoodsNumber"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="singleOrderList.Description"></el-input>
                </el-form-item>
                <el-form-item label="快递公司">
                    <el-input v-model="singleOrderList.Express"></el-input>
                </el-form-item>
                <el-form-item label="快递单号">
                    <el-input v-model="singleOrderList.ExpressOrder"></el-input>
                </el-form-item>
                <el-form-item label="打印时间">
                    <el-input v-model="singleOrderList.PrintTime"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button @click="boxCancel">取 消</el-button>
                <el-button type="primary" @click="boxOk">保存并打印</el-button>
            </div>
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
            options: [{ value: 'OrderCode', label: '订单号' },
            { value: 'Consignee', label: '收件人' },
            { value: 'Sender', label: '发件人' },
            { value: 'GoodsName', label: '商品名称' },
            { value: 'Express', label: '快递公司' },
            { value: 'ExpressOrder', label: '快递单号' }],
            formCheck: {         //form 组合查询
                selectValue: '',  // 下拉项
                userInput: ''     //用户输入项
            },
            pageRows: this.$store.state.pageRows,    //每页显示的记录条数
            listLoading: true,  // 表格加载
            orderList: [],  //表格数据
            inputRules: {        //表单valid验证规则
                userInput: [{ required: true, message: '请输入你要查询的内容', trigger: 'blur' }],
                selectValue: [{ required: true, message: '请选择分类', trigger: 'blur' }]
            },
            currentPage: 1,   // 当前页
            total: 0,   // 共多少条记录
            dialogFormVisible: false,  //弹出表单控制
            singleOrderList: [],     //弹出单条记录集
            tempOrderList: []       //临时保存订单列表，放弃保存时可以还原
        }
    },
    components: {
        vPageTitle, vPageCopyright,
    },
    mounted() {
        // 加载完毕后，clear【发货管理】菜单上的badge
        this.$store.state.sendGoods = 0;
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
            axios.get(_this.$store.state.sendGoodsListJsonUrl, {
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
        // **********弹出操作**********
        // 弹出编辑框的按钮button操作
        boxCancel() {
            this.dialogFormVisible = false;
            this.$message({ type: 'info', message: '已取消操作' });
            //还原未修改前的orderlist
            this.orderList = this.copyArr(this.tempOrderList);
        },
        boxOk() {
            this.$confirm('是否【保存修改】并【打印】?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 做打印操作
                this.dialogFormVisible = false;
                this.$message({ type: 'success', message: '操作成功!' });
                this.fetchData();
            }).catch(() => {
                this.$message({ type: 'info', message: '已取消操作' });
            });

        },
        // 状态：打印、未打印  筛选
        filterTag(value, row) {
            // console.log(row.tag);
            // console.log(value);
            return row.Status === value;
        },
        //打印弹出
        printDialog(index, row) {
            // console.log(index);
            console.log(row);
            // 打开弹出表单
            this.dialogFormVisible = true;
            // 绑定当前编辑列表数据对象
            this.singleOrderList = row;
            // 临时保存订单列表
            this.tempOrderList = this.copyArr(this.orderList);
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