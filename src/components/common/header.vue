<template>
    <div class="header">
        <el-row :gutter="10">
            <!--Logo area-->
            <el-col :xs="12" :sm="12" :md="4">
                <div class="logo">  
                    <span class="logo_prefix"><i class="iconfont icon-huocang logoIcon"></i></span>
                    <router-link to="/"><span class="logo_suffix">{{this.$store.state.baseName}}</span></router-link>
                </div>
            </el-col>

            <!-- header right area-->
            <!--欢迎您-->
            <el-col :xs="{span:6,offset: 4}" :sm="{span:6,offset: 4}" :md="{span:4,offset: 14}">
                <div class="website">
                    <span>欢迎您:</span>
                    <span><strong>{{welcome}}</strong></span>
                </div>
            </el-col>

            <!--个人头像-->
            <el-col :xs="2" :sm="2" :md="2" >
                <div class="user-header">
                    <el-dropdown trigger="click" menu-align="start">
                        <img src="../../../static/images/b_header2.jpg" width="50px" />
                        <el-dropdown-menu slot="dropdown">
                            <!--<el-dropdown-item >
                                <div class="setting-div">
                                    <span class="setting-icon"><i class="material-icons">account_box</i></span> 
                                    <span class="setting-string"> Profile  个人</span>
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item divided>
                                <div class="setting-div">
                                    <span class="setting-icon"><i class="material-icons">settings</i></span> 
                                    <span class="setting-string"> Settings  设置</span>
                                </div>
                            </el-dropdown-item>-->

                            <el-dropdown-item>
                                <div class="setting-div">
                                    <span class="setting-icon" @click="logout"><i class="material-icons">assignment_return</i></span>
                                    <span class="setting-string" @click="logout"> Sign out  退出</span>
                                </div>                            
                            </el-dropdown-item>                        
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script>
import store from '@/store/index'
    export default {
        store,
        data() {
            return {
                name: 'jhcy',
                welcome: ''
            }
        },
        mounted(){
            // 获取登录用户的真实称呼
            // this.welcome = localStorage.getItem("Name");
            this.welcome = this.$store.state.name;
        },
        methods:{
            logout(){
                // 退出，清空本地localStorage存储
                localStorage.clear();
                this.$store.commit('clear');
                this.$router.push('login'); 
            }
        }
    }
</script>
<style scoped>
    .header {
        position: fixed;
        box-sizing: border-box;
        width: 100%;
        height:66px;
       
        font-size: 14px;
        line-height: 66px;
        background-color:#324157;
        box-shadow:2px 0 3px rgba(0,0,0,.5);
        z-index:1000;
        padding:0 32px 0 40px;
        overflow:hidden;
       
    }
    .header .logo{
        float: left;
        cursor:pointer;
        font-size: 22px;
    }
    .logo_prefix{
        color:#209e91;
    }
    .logo_suffix{
        color:#fff;
    }
    .header .search{
        float: left;
        color:#fff;
        font-size:14px;
    }
    .website span{
        display:inline-block;
        color:#209e91;
    }
    .website span:first-child{
        color:#fff;
    }
    .header-right{
        padding-top:25px;
        line-height:10px;
    }
    .header-right span{
        display:inline-block;
        margin-left:14px;
        font-size:18px;
        color:#fff;
        line-height:1px;
        height:18px;
        cursor:pointer;

    }
    .header-right span:hover{
        color:#209e91;

    }
    .user-header{
        line-height:10px;
        padding-top:7px;
        font-size:12px;
    }
    .user-header img{
        border-radius:50%;
        cursor:pointer;
    }
    .pop-image{
        display:block;
        float:left;
    }
    .pop-image img{
        border-radius:50%;
    }
    .pop-div{
        height:55px;
        clear:both;
    }
    .pop-content{
        display:block;
        font-size:12px;
        line-height:14px;
        padding-top:15px;
        margin-left:60px;
    }
    .pop-time{
        display:block;
        float:right;
        font-size:10px;
        color:#ccc;

    }
    .pop-title{
        font-size:12px;
        color:#209e91;
    }
    .task-div{
        clear:both;
        height:55px;
    }
    .task-span{
        display:block;
        float:left;
        font-size:12px
    }
    
    .task-content{  
        width:160px;
        line-height:16px;
        margin-left:10px;
        padding:5px;
    }
    .task-time{
        clear:both;
        float:right;
        color:#ccc;
        
    }
    .setting-div{
        height:30px;
        line-height:30px;
        clear:both;
    }
    .setting-div span{
        display:block;
        float:left;
        font-size:12px;
    }
    .setting-icon{
        padding-top:3px;
        padding-right:3px;
    }
    .logoIcon{
        font-size: 26px;
        margin-right: 3px;
    }
    


</style>
