<template>
  <div class="contents">
    <div :class="{ 's--signup': isChange, content: true }">
      <div class="form sign-in">
        <h2>欢迎回来</h2>
        <form action="">
          <label>
            <span :class="{ on_focus_span: inputs[0].isFocus }">用户名</span>
            <input
              type="text"
              @focus="onFocus(0)"
              autocomplete="username"
              v-model="loginData.userName"
            />
          </label>
          <label>
            <span :class="{ on_focus_span: inputs[1].isFocus }">密码</span>
            <input
              autocomplete="current-password"
              type="password"
              @focus="onFocus(1)"
              v-model="loginData.password"
            />
          </label>
          <button type="button" class="submit" @click.prevent="onLogin">
            登 录
          </button>
        </form>
      </div>
      <div class="sub-cont">
        <div class="img">
          <div class="img__text m--up">
            <h2>还未注册？</h2>
            <p>立即注册，体验代码生成器带来的便利！</p>
          </div>
          <div class="img__text m--in">
            <h2>已有帐号？</h2>
            <p>有帐号就登录吧！</p>
          </div>
          <div class="img__btn" @click.prevent="isChange = !isChange">
            <span class="m--up">注 册</span>
            <span class="m--in">登 录</span>
          </div>
        </div>
        <div class="form sign-up">
          <h2>立即注册</h2>
          <form action="">
            <label>
              <span
                v-if="!inputs[2].isError"
                :class="{
                  on_focus_span: inputs[2].isFocus,
                }"
                >用户名</span
              >
              <span v-else class="on_focus_span span_wrong"
                >用户名 ({{ inputs[2].message }})</span
              >
              <input
                type="text"
                @focus="onFocus(2)"
                @blur="onBlur(2)"
                autocomplete="username"
                v-model="resData.userName"
              />
            </label>

            <label>
              <span
                v-if="!inputs[3].isError"
                :class="{
                  on_focus_span: inputs[3].isFocus,
                }"
                >密码</span
              >
              <span v-else class="on_focus_span span_wrong"
                >密码 ({{ inputs[3].message }})</span
              >
              <input
                type="password"
                @focus="onFocus(3)"
                @blur="onBlur(3)"
                autocomplete="current-password"
                v-model="resData.password"
              />
            </label>
            <button type="button" class="submit" @click.prevent="onRes">
              注 册
            </button>
          </form>
        </div>
      </div>
    </div>
    <div style="text-align: center"></div>
  </div>
</template>
<script lang='ts'>
import { defineComponent, ref, Ref } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { PostReg, PostLogin } from "../api/api";

interface inputProps {
  isFocus: boolean;
  isError?: boolean;
  message?: string | number;
}
interface userInfo {
  userName: string;
  password: string;
}
export default defineComponent({
  name: "login",
  setup(props, context) {
    //全局注册router
    const router = useRouter();
    //登录注册控制
    let isChange: Ref<boolean> = ref(false);
    //聚焦事件
    type inputsProps = inputProps[];
    const inputs: Ref<inputsProps> = ref([
      {
        isFocus: false,
      },
      {
        isFocus: false,
      },
      {
        isFocus: false,
        isError: false,
        message: "请输入1~8位的用户名",
      },
      {
        isFocus: false,
        isError: false,
        message: "密码为包含大小写的8~16位字符",
      },
    ]);
    const onFocus = (i: number) => {
      inputs.value[i].isFocus = true;
    };
    const onBlur = (i: number) => {
      const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
      if (i === 2) {
        //用户名判断1~8个字符
        console.log(resData.value);
        resData.value.userName.trim().length <= 8 &&
        resData.value.userName.trim().length > 0
          ? (inputs.value[i].isError = false)
          : (inputs.value[i].isError = true);
      } else {
        //密码判断 大小写8~16
        inputs.value[i].isError = !passwordReg.test(
          resData.value.password.trim()
        );
      }
    };
    //发送请求
    //注册
    // 注册数据
    const resData: Ref<userInfo> = ref({
      userName: "",
      password: "",
    });
    const onRes = () => {
      if (
        resData.value.userName != "" &&
        resData.value.password != "" &&
        !inputs.value[2].isError &&
        !inputs.value[3].isError
      ) {
        //注册请求发送
        PostReg({
          username: resData.value.userName,
          password: resData.value.password,
        }).then((res) => {
          ElMessage.success("注册成功");
        });
      } else {
        onBlur(2);
        onBlur(3);
      }
    };
    //登录
    //登录数据
    const loginData: Ref<userInfo> = ref({
      userName: "",
      password: "",
    });
    const onLogin = () => {
      // todo 登陆获取
      PostLogin({
        username: loginData.value.userName,
        password: loginData.value.password,
      }).then(
        (res) => {
          ElMessage.success("登录成功");
          const token = res.data.access_token;
          localStorage.setItem("token", token);
          const reFreshToken = res.data.refresh_token;
          localStorage.setItem("reFreshToken", reFreshToken);
          router.push("/");
        },
        (error) => {
          ElMessage.warning("登录失败，请稍后再试");
        }
      );
    };
    return {
      //登录注册控制
      isChange,
      //聚焦事件
      inputs,
      onFocus,
      onBlur,
      //注册
      resData,
      onRes,
      //登录
      loginData,
      onLogin,
    };
  },
});
</script>

<style lang='less' scope>
.contents {
  position: relative;
  input,
  button {
    border: none;
    outline: none;
    background: none;
    font-family: "Open Sans", Helvetica, Arial, sans-serif;
  }

  .tip {
    font-size: 20px;
    margin: 40px auto 50px;
    text-align: center;
  }

  .content {
    overflow: hidden;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 900px;
    height: 550px;
    transform: translate(-50%, 10%);
    background: #fff;
  }

  .form {
    position: relative;
    width: 640px;
    height: 100%;
    transition: -webkit-transform 0.6s ease-in-out;
    transition: transform 0.6s ease-in-out;
    transition: transform 0.6s ease-in-out, -webkit-transform 0.6s ease-in-out;
    padding: 50px 30px 0;
  }

  .sub-cont {
    overflow: hidden;
    position: absolute;
    left: 640px;
    top: 0;
    width: 900px;
    height: 100%;
    padding-left: 260px;
    background: #fff;
    transition: -webkit-transform 0.6s ease-in-out;
    transition: transform 0.6s ease-in-out;
    transition: transform 0.6s ease-in-out, -webkit-transform 0.6s ease-in-out;
  }

  .content.s--signup .sub-cont {
    -webkit-transform: translate3d(-640px, 0, 0);
    transform: translate3d(-640px, 0, 0);
  }

  .submit {
    display: block;
    margin: 0 auto;
    width: 260px;
    height: 36px;
    border-radius: 30px;
    color: #fff;
    font-size: 15px;
    cursor: pointer;
  }

  .img {
    overflow: hidden;
    z-index: 2;
    position: absolute;
    left: 0;
    top: 0;
    width: 260px;
    height: 100%;
    padding-top: 360px;
  }

  .img:before {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    width: 900px;
    height: 100%;
    /* background-image: url(../images/bg.jpg); */
    background-size: cover;
    transition: -webkit-transform 0.6s ease-in-out;
    transition: transform 0.6s ease-in-out;
    transition: transform 0.6s ease-in-out, -webkit-transform 0.6s ease-in-out;
  }
  .img:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
  }

  .content.s--signup .img:before {
    -webkit-transform: translate3d(640px, 0, 0);
    transform: translate3d(640px, 0, 0);
  }

  .img__text {
    z-index: 2;
    position: absolute;
    left: 0;
    top: 50px;
    width: 100%;
    padding: 0 40px;
    text-align: center;
    color: #fff;
    transition: -webkit-transform 0.6s ease-in-out;
    transition: transform 0.6s ease-in-out;
    transition: transform 0.6s ease-in-out, -webkit-transform 0.6s ease-in-out;
  }

  .img__text h2 {
    margin-bottom: 10px;
    font-weight: 400;
  }

  .img__text p {
    font-size: 16px;
    line-height: 1.5;
  }

  .content.s--signup .img__text.m--up {
    -webkit-transform: translateX(520px);
    transform: translateX(520px);
  }
  .img__text.m--in {
    -webkit-transform: translateX(-520px);
    transform: translateX(-520px);
  }

  .content.s--signup .img__text.m--in {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }

  .img__btn {
    overflow: hidden;
    z-index: 2;
    position: relative;
    width: 100px;
    height: 36px;
    margin: 0 auto;
    background: transparent;
    color: #fff;
    text-transform: uppercase;
    font-size: 15px;
    cursor: pointer;
  }
  .img__btn:after {
    content: "";
    z-index: 2;
    position: absolute;
    left: 0;
    top: 0;
    width: 90%;
    height: 90%;
    border: 1px solid #fff;
    border-radius: 8px;
  }

  .img__btn span {
    position: absolute;
    left: -3px;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    transition: -webkit-transform 0.6s;
    transition: transform 0.6s;
    transition: transform 0.6s, -webkit-transform 0.6s;
  }

  .img__btn span.m--in {
    -webkit-transform: translateY(-72px);
    transform: translateY(-72px);
  }

  .content.s--signup .img__btn span.m--in {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }

  .content.s--signup .img__btn span.m--up {
    -webkit-transform: translateY(72px);
    transform: translateY(72px);
  }

  h2 {
    width: 100%;
    font-size: 26px;
    text-align: center;
  }

  label {
    display: block;
    width: 260px;
    margin: 25px auto 0;
    text-align: center;
    position: relative;
  }

  label span {
    position: absolute;
    left: 50%;
    display: inline-block;
    transform: translate(-50%);
    bottom: 5px;
    font-size: 16px;
    color: #909399;
    text-transform: uppercase;
    transition: all 0.4s;
  }
  .on_focus_span {
    width: 100%;
    font-size: 10px;
    bottom: 27px;
  }
  .span_wrong {
    color: rgb(172, 0, 0);
  }

  input {
    display: block;
    width: 100%;
    margin-top: 50px;
    padding-bottom: 5px;
    font-size: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.4);
    text-align: center;
  }

  .submit {
    margin-top: 65px;
    margin-bottom: 20px;
    background: #3370ff;
    text-transform: uppercase;
  }

  .fb-btn {
    border: 2px solid #d3dae9;
    color: #8fa1c7;
  }
  .fb-btn span {
    font-weight: bold;
    color: #455a81;
  }

  .sign-in {
    transition-timing-function: ease-out;
  }
  .content.s--signup .sign-in {
    transition-timing-function: ease-in-out;
    transition-duration: 0.6s;
    -webkit-transform: translate3d(640px, 0, 0);
    transform: translate3d(640px, 0, 0);
  }

  .sign-up {
    -webkit-transform: translate3d(-900px, 0, 0);
    transform: translate3d(-900px, 0, 0);
  }
  .content.s--signup .sign-up {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}
</style>