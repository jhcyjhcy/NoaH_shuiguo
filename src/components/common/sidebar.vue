<template>
    <div :class="isCollapse?'sidebarClose':'sidebarOpen'">
        <!--<el-radio-group v-model="isCollapse">
            <el-radio-button :label="true"><i class="el-icon-d-arrow-left"></i></el-radio-button>
            <el-radio-button :label="false" :plain="true"><i class="el-icon-d-arrow-right"></i></el-radio-button>
        </el-radio-group>-->
        <div class="collapButton">
            <el-button class="collapButton" type="text" @click="isCollapse=isCollapse?false:true" >
                <i class="el-icon-d-arrow-left" v-if="!isCollapse"></i>
                <i class="el-icon-d-arrow-right" v-if="isCollapse"></i>
            </el-button>
        </div>
        <!--menu说明
        default-active:当前默认激活的菜单项
        theme：默认菜单样式
        unique-opened：只能一个折叠打开
        router：激活导航时以 index 作为 path 进行路由跳转-->
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router  @open.native="handleOpen" @close="handleClose" :collapse="isCollapse">
            <!--首页-->
            <el-menu-item index="DashBoard">
                <!--<i class="el-icon-menu"></i>
                <span slot="title">导航二</span>-->
                <!--<span class="sb-icon"><i class="material-icons">home</i></span>-->
                <i class="material-icons sb-icon">home</i>
                <span class="sb-cn" slot="title">首页</span>
            </el-menu-item>
            <!--订单管理-->
            <el-menu-item index="OrderManage">
                <i class="material-icons">perm_data_setting</i>
                <span class="sb-cn" slot="title">订单管理</span>
            </el-menu-item>
            <!--发货管理-->
            <el-menu-item index="DeliverGoods">
                <i class="material-icons">pie_chart</i>
                <span class="sb-cn" slot="title">发货管理</span>
                <el-badge :value="this.$store.state.sendGoods" class="item">
                       <!--{{ this.$store.state.name }}-->
                </el-badge>
                
            </el-menu-item>
            <!--库存管理-->
            <el-submenu index="2">
                <template slot="title">              
                    <i class="material-icons">content_paste</i>
                    <span class="sb-cn" slot="title">库存管理</span>
                </template>

                <el-menu-item index="Stock">基地库存</el-menu-item>
                <el-menu-item index="StockRecord">库存操作记录</el-menu-item> 
            </el-submenu>
            <!--每日操作-->
            <el-submenu index="3">
                <template slot="title">              
                    <i class="material-icons">border_all</i>
                    <span class="sb-cn" slot="title">每日一瞥</span>
                </template>

                <el-menu-item index="DateCount">每日统计</el-menu-item>
                <el-menu-item index="DateReCord">每日记账</el-menu-item> 
            </el-submenu>
            <!--订单查询
            <el-menu-item index="CountChart">
                <span class="sb-icon"><i class="material-icons">border_all</i></span>
                <span class="sb-cn">每日统计</span>
            </el-menu-item>
            每日记账
            <el-menu-item index="DateReCord">
                <span class="sb-icon"><i class="material-icons">edit</i></span>
                <span class="sb-cn">每日记账</span>
            </el-menu-item>-->
            <!--<el-submenu index="2">
                <template slot="title">              
                    <span class="sb-icon"><i class="material-icons">perm_data_setting</i></span>
                    <span class="sb-cn">Components</span>
                </template>

                <el-menu-item index="EditorPage">Editor</el-menu-item>
                <el-menu-item index="MarkdownPage">Markdown</el-menu-item>
                <el-menu-item index="TodoList">TodoList</el-menu-item>  
            </el-submenu>

            <el-submenu index="3">
                <template slot="title">
                    <span class="sb-icon"><i class="material-icons">pie_chart</i></span>
                    <span class="sb-cn">charts</span>
                </template>
                <el-menu-item index="BasicCharts"> BasicCharts</el-menu-item>
            </el-submenu>

            <el-submenu index="4">
                <template slot="title">
                    <span class="sb-icon"><i class="material-icons">content_paste</i></span>
                    <span class="sb-cn">Form Elements</span>
                </template>
                <el-menu-item index="FormInput"> Form Inputs</el-menu-item>
                <el-menu-item index="FormLayouts">  Form Layouts</el-menu-item>
            </el-submenu>

             <el-submenu index="5">
                <template slot="title">
                    <span class="sb-icon"><i class="material-icons">border_all</i></span>
                    <span class="sb-cn">Tables</span>
                </template>
                <el-menu-item index="BasicTables"> Basic Tables</el-menu-item>  
            </el-submenu>-->

        </el-menu>
    </div>
</template>
<script>
import store from '@/store/index'
    export default {
        store,
        data(){
            return{
              isCollapse: false ,
              sidebar:'sidebarOpen', 
            }
        },
        methods:{
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
                //alert(1);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
                //alert(2);
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>
<style scoped>
    .sidebarClose{
        display: block;
        /*position: absolute;*/
        /*position: relative;*/
        /*float: left;*/
        flex: 0 0 70px;
        width: 70px;
        left: 0;
        top: 66px;
        bottom:0;
        background: #324157;
       
    }
    .sidebarOpen{
        display: block;
        /*position: absolute;*/
        flex: 0 0 200px;
        width: 200px;
        left: 0;
        top: 66px;
        bottom:0;
        background: #324157;
       
    }
    .sidebar > ul {
        height:100%;
    }

   .el-menu-item, .el-submenu__title{
       font-size:14px;
     
   }
   
    .material-icons {font-size:12px;}
    /*.item {
        margin-top: 10px;
        margin-right: 40px;
    }*/
    /*折叠菜单*/
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200;
        min-height: 400px;
    }
    .collapButton{
        width: 50px;
        height: 50px;
    }
</style>
