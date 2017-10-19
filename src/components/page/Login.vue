<template>
  <div class="login-container">
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="login-form">
      <h3 class="title">水果基地系统登录</h3>
      <el-form-item prop="username">
        <el-input name="username" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.username" autoComplete="on" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码"></el-input>
      </el-form-item>
      <el-row :gutter="20">
        <el-col :xs="18" :sm="18" :md="18" :lg="18">
          <el-form-item prop="verifycode">
            <el-input name="verifycode" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.verifycode" autoComplete="on" placeholder="验证码一定要填,点击可刷新" witdh="100"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="6" :sm="6" :md="6" :lg="6">
          <!--<img :src="validPic" />-->
          <el-tooltip effect="dark" content="点击更换验证码" placement="right">
            <a href="javascript:;">
              <img id="validPic" :src="validPic" @click="requestValidPic" /></a>
          </el-tooltip>

        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin('loginForm')">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { isvalidUsername } from '@/utils/validate'
import { Message } from 'element-ui';
import axios from 'axios';
import store from '@/store/index'
import LoginTimeOut from '@/utils/LoginTimeOut'
// import http from "@/utils/http"; 
// Vue.use(http);

export default {
  name: 'login',
  store: store,
  data() {
    return {
      loading: false,
      validPic: this.$store.state.validPicUrl,  //验证码图片
      loginForm: {
        username: '',
        password: '',
        verifycode: '',
        autologin: 0
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
        verifycode: [{ required: true, trigger: 'blur', message: '验证码还是要输入噢！' }]
      }
    }
  },
  mounted() {
    // this.loginForm.username = this.$store.state.token;
    this.requestValidPic();
  },
  methods: {
    handleLogin(loginForm) {
      //loading加载
      this.loading = true;
      // 首先验证是否填写
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          let _this = this;
          // console.log(_this.$store.state.loginJsonUrl);
          // ajax判断用户名和密码
          // console.log(process.env.API_HOST);
          axios.get(_this.$store.state.loginJsonUrl,
            {
              params: this.loginForm
            })
            .then(function(response) {
              // console.log(_this.loginForm);
              let data = response.data;
              // console.log(data);
              if (data.result === 'success') {
                // 登录成功
                // 设置token
                localStorage.setItem("Admin-Token", data.token);
                localStorage.setItem("Username", data.username);
                localStorage.setItem("Name", data.name);
                localStorage.setItem("BaseName", data.basename);
                // 设置store
                _this.$store.state.token = data.token;
                _this.$store.state.username = data.username;
                _this.$store.state.name = data.name;
                _this.$store.state.baseName = data.basename;
                // 设置登录超时时间 毫秒*秒*分*时 1天=1000 * 60 * 60 * 24
                // 登录超时时间：30分钟
                LoginTimeOut.maxAge(1000 * 60 * 30).set('userinfo', {
                  name: data.username,
                  age: '18'
                });
                //提示并跳转
                _this.$message({ message: '登录成功', type: 'success' });
                _this.loading = false;
                _this.$router.push('/DashBoard');
              } else {
                //登录失败
                _this.$message({ message: data.message, type: 'error' });
                _this.$refs['loginForm'].resetFields();
                _this.loading = false;
              }
            })
            .catch(function(err) {
              // 远程200失败,不在请求2xx范围内
              _this.$message({ message: '远程连接出错，请联系管理员', type: 'warning' });
              _this.loading = false;
              return false;
            });
        } else {
          // 未输入信息
          this.$message({ message: '请填写完整', type: 'warning' });
          this.loading = false;
          return false;
        }
      });
    },
    requestValidPic() {
      // console.log(this.$store.state.validPicUrl);
      this.validPic = this.$store.state.validPicUrl + "?time=" + Math.random();
      // document.getElementById('validPic').src = this.$store.state.validPicUrl + "?time=" + Math.random();
    }
  }
}
</script>

<style>
.login-container {
  height: 100%;
  background-color: #2d3a4b;
}



/*input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #eee;
      height: 47px;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
    }*/

.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 10px;
}

.title {
  font-size: 26px;
  font-weight: 400;
  color: #eee;
  margin: 0px auto 40px auto;
  text-align: center;
  font-weight: bold;
}

.login-form {
  position: absolute;
  left: 0;
  right: 0;
  width: 400px;
  padding: 35px 35px 15px 35px;
  margin: 120px auto;
}



/*.el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }*/
</style>
