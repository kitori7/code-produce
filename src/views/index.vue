<template>
  <div class="common-layout">
    <el-container class="index-content">
      <el-header>
        <el-menu
          class="el-menu-demo"
          mode="horizontal"
          :ellipsis="false"
          background-color="#3370ff"
          text-color="#fff"
          active-text-color="#fff"
        >
          <div class="w">
            <span class="title">代码生成器</span>
            <div class="flex-grow" />
            <el-button class="btn" size="large" @click="LoginOut">
              登出</el-button
            >
          </div>
        </el-menu>
      </el-header>
      <!-- 侧边栏 -->
      <el-container>
        <el-aside width="200px">
          <el-menu default-active="1" class="el-menu-vertical-demo">
            <router-link to="field">
              <el-menu-item index="1">
                <el-icon><location /></el-icon>
                <template #title> 字段服务 </template>
              </el-menu-item>
            </router-link>
            <router-link to="dataSource">
              <el-menu-item index="2">
                <el-icon><FullScreen /></el-icon>
                <template #title>数据源服务</template>
              </el-menu-item>
            </router-link>
            <router-link to="product">
              <el-menu-item index="3">
                <el-icon><document /></el-icon>
                <template #title>工程服务</template>
              </el-menu-item>
            </router-link>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { defineComponent, onBeforeMount } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { PostRemove, Refresh } from "../api/api";

export default defineComponent({
  name: "index",
  components: {},
  setup() {
    const router = useRouter();
    //登出
    const LoginOut = () => {
      router.push("/login");
      PostRemove();
      localStorage.removeItem("token");
      localStorage.removeItem("reFreshToken");
    };
    //判断是否登陆
    const token = localStorage.getItem("token");
    onBeforeMount(() => {
      const onRefresh = () => {
        Refresh().then((res) => {
          const token = res.data.access_token;
          localStorage.setItem("token", token);
        });
      };
      if (token) {
        onRefresh();
      } else {
        //todo 跳转路由
        router.push("/login");
      }
    });
    return {
      LoginOut,
    };
  },
});
</script>

<style lang='less'>
.flex-grow {
  flex-grow: 1;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  height: 90vh;
}
.el-menu-vertical-demo {
  height: 80vh;
}
.el-menu-demo {
  height: 60px;
  .title {
    line-height: 60px;
    font-size: 20px;
    font-weight: bold;
    color: #fff;
  }
  .btn {
    line-height: 60px;
    transform: translate(0, 25%);
  }
}
.w {
  padding: 0 30px;
  width: 100%;
  display: flex;
}
.el-header {
  padding: 0 !important;
}
</style>