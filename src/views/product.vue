<template>
  <div class="product">
    <el-card style="height: 87vh">
      <!-- 头部 -->
      <template #header>
        <div class="card-header">
          <span class="title">工程服务</span>
          <el-button class="button" type="primary" @click="openDialog(null)"
            >添加</el-button
          >
        </div>
      </template>
      <!-- 数据页 -->
      <!-- 空状态 -->
      <el-empty v-show="list.length < 1" description="暂无内容" />
      <div class="item-box">
        <el-card
          class="item"
          v-for="item in list"
          :key="item.projectPackage"
          shadow="hover"
          @click="openDialog(item)"
        >
          <template #header>
            <div class="item-header">
              <span class="item-title">{{ item.projectName }}</span>
              <span class="item-version">{{ item.version }}</span>
            </div>
          </template>
          <div class="item-content">
            <div class="item-row">
              <span>项目包名：{{ item.projectPackage }}</span>
              <span>项目编码：{{ item.projectCode }}</span>
            </div>
            <div class="item-row">
              <span>作者：{{ item.author }}</span>
              <span>邮箱：{{ item.email }}</span>
            </div>
          </div>
        </el-card>
        <!-- 分页器 -->
        <el-pagination
          small
          background
          v-model:current-page="nowPage"
          layout="prev, pager, next, ->"
          :total="total"
          :page-size="pageSize"
          hide-on-single-page
          class="page"
        />
      </div>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      v-model="isDialog"
      :title="isAdd ? '添加项目' : '修改项目'"
      align-center
    >
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        :model="form"
        label-width="120px"
        inline
      >
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" />
        </el-form-item>
        <el-form-item label="项目包名" prop="projectPackage">
          <el-input v-model="form.projectPackage" />
        </el-form-item>
        <el-form-item label="项目编码" prop="projectCode">
          <el-input v-model="form.projectCode" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-if="!isAdd"
            class="button"
            type="danger"
            @click.prevent="onDelete"
            >删除</el-button
          >
          <el-button v-else @click="isDialog = false">取消</el-button>
          <el-button type="primary" @click="dialogConfig(ruleFormRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, Ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import {
  PostAddProduct,
  PostPageProduct,
  PutChangeProduct,
  DelProduct,
} from "../api/api";

export interface productForm {
  projectName: string;
  projectCode: string;
  projectPackage: string;
  version: string;
  author: string;
  email: string;
  id?: number;
  user?: {
    id: number;
    username: string;
  };
}
export default defineComponent({
  name: "dataSource",
  setup() {
    // 获取工程队列
    const total: Ref<number> = ref(0);
    const list: Ref<Array<productForm>> = ref([]);
    const pageSize: number = 6;
    const nowPage: Ref<number> = ref(1);
    watch(nowPage, () => {
      init(nowPage.value);
    });
    const init = (page: number) => {
      PostPageProduct({
        page,
        limit: 6,
      }).then((res) => {
        const data = res.data.data;
        total.value = data.total;
        list.value = data.list;
      });
    };
    init(1);
    // 对话框
    let isDialog: Ref<Boolean> = ref(false);
    let isAdd: Ref<Boolean> = ref(true);
    let currentId: Ref<number> = ref(0);
    const openDialog = (item: productForm | null = null) => {
      isDialog.value = !isDialog.value;
      // 判断是新增还是修改
      if (item) {
        isAdd.value = false;
        currentId.value = item.id as number;
        delete item.user;
        form.value = item;
      } else {
        isAdd.value = true;
        form.value = {
          projectName: "",
          projectCode: "",
          projectPackage: "",
          version: "",
          author: "",
          email: "",
        };
      }
    };
    // 删除事件
    const onDelete = () => {
      DelProduct(currentId.value);
      isDialog.value = false;
      init(nowPage.value);
    };
    //表单数据
    const ruleFormRef = ref<FormInstance>();
    let form: Ref<productForm> = ref({
      projectName: "",
      projectCode: "",
      projectPackage: "",
      version: "",
      author: "",
      email: "",
    });
    const rules = reactive<FormRules>({
      projectName: [
        { min: 1, max: 30, message: "长度在1~30之间", trigger: "blur" },
        { required: true, message: "必填！", trigger: "blur" },
      ],
      projectCode: [
        { min: 1, max: 30, message: "长度在1~30之间", trigger: "blur" },
        { required: true, message: "必填！", trigger: "blur" },
      ],
      projectPackage: [
        { min: 1, max: 30, message: "长度在1~30之间", trigger: "blur" },
        { required: true, message: "必填！", trigger: "blur" },
      ],
      version: [
        { min: 1, max: 30, message: "长度在1~30之间", trigger: "blur" },
        { required: true, message: "必填！", trigger: "blur" },
      ],
      author: [
        { min: 1, max: 30, message: "长度在1~30之间", trigger: "blur" },
        { required: true, message: "必填！", trigger: "blur" },
      ],
      email: [
        { required: true, message: "必填！", trigger: "blur" },
        { type: "email", message: "填入正确格式的邮箱", trigger: "blur" },
      ],
    });
    const dialogConfig = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          //判断是修改还是添加
          if (isAdd.value === true) {
            //确认 发请求
            PostAddProduct(form.value).then((res) => {
              init(1);
            });
          } else {
            PutChangeProduct(currentId.value, form.value);
          }

          isDialog.value = false;
        } else {
          console.log("error submit!", fields);
        }
      });
    };
    return {
      // 工程数据
      list,
      total,
      pageSize,
      nowPage,
      init,
      // 对话框
      isAdd,
      isDialog,
      openDialog,
      onDelete,
      //表单数据
      form,
      rules,
      ruleFormRef,
      dialogConfig,
    };
  },
});
</script>

<style lang='less'>
.product {
  height: 71.7vh;
  .card-header {
    display: flex;
    .title {
      flex: 1;
      line-height: 32px;
      font-size: 22px;
      font-weight: bold;
    }
  }
  .item-box {
    display: flex;
    position: relative;
    justify-content: space-between;
    flex-wrap: wrap;
    align-content: flex-start;
    height: 71.7vh;
    .page {
      position: absolute;
      bottom: 0;
      right: 0;
    }
    .item {
      width: 48%;
      margin-bottom: 14px;
      height: 155px;
      cursor: pointer;
      .item-header {
        display: flex;
        .item-title {
          font-weight: 700;
          flex: 1;
          font-size: 20px;
        }
        .item-version {
          flex: 1;
          font-size: 10px;
          text-align: right;
          line-height: 20px;
          color: #999;
        }
      }
      .item-content {
        .item-row {
          height: 35px;
          display: flex;
          span {
            flex: 1;
          }
        }
      }
    }
  }
}
</style>