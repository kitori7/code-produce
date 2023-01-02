<template>
  <div class="data-source">
    <!-- 左边 -->
    <el-card class="l-content">
      <template #header>
        <div class="card-header">
          <span class="title">数据源</span>
          <el-button size="small" type="primary" @click="openDialog()"
            >添加</el-button
          >
        </div>
      </template>
      <!-- 空状态 -->
      <el-empty v-show="list.length < 1" description="暂无内容" />
      <el-card
        class="item"
        shadow="hover"
        v-for="item in list"
        :key="item.conName"
        @click="getTable(item.id, item.conName)"
      >
        <div class="item-header">
          <span class="item-title">{{ item.conName }}</span>
          <span class="item-version">{{ item.dbType }}</span>
        </div>
        <div class="item-content">
          <el-tooltip :content="item.conUrl" effect="light" placement="top">
            <div class="item-url">数据库URL：{{ item.conUrl }}</div></el-tooltip
          >
          <div class="btn-box">
            <el-button type="success" size="small" @click.stop="onTest(item.id)"
              >测试</el-button
            >
            <el-button type="info" size="small" @click.stop="openDialog(item)"
              >修改</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click.stop="onImport(item.id)"
              >导入</el-button
            >
          </div>
        </div>
      </el-card>
      <!-- 分页器 -->
      <el-pagination
        small
        background
        layout="prev, pager, next, ->"
        :total="total"
        :page-size="pageSize"
        v-model:current-page="nowPage"
        hide-on-single-page
        class="page"
      />
    </el-card>
    <!-- 右边 -->
    <el-card class="r-content">
      <template #header>
        <div class="card-header">
          <span class="title">表</span>
          <el-button
            type="primary"
            @click="onGenerator"
            v-show="tableList.length >= 1"
            >生成代码</el-button
          >
        </div>
      </template>
      <!-- 空状态 -->
      <el-empty v-show="tableList.length < 1" description="暂无内容" />
      <el-checkbox-group v-model="tableIds">
        <div class="table-item" v-for="item in tableList" :key="item.tableId">
          <el-checkbox size="large" :label="item.tableId"></el-checkbox>
          <div @click="openDrawer(item)" class="table-title">
            <el-icon style="position: relative; top: 3px; margin: 0 5px 0 10px"
              ><Tickets
            /></el-icon>
            <span>{{ item.tableName }}</span>
          </div>
        </div>
      </el-checkbox-group>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      v-model="isDialog"
      :title="isAdd ? '添加数据源' : '修改数据源'"
      align-center
    >
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        :model="form"
        label-width="120px"
        inline
      >
        <el-form-item label="数据源名称" prop="conName">
          <el-input v-model="form.conName" />
        </el-form-item>

        <el-form-item label="数据源地址" prop="conUrl">
          <el-input v-model="form.conUrl" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" />
        </el-form-item>
        <el-form-item label="数据源类型" prop="dbType">
          <el-select v-model="form.dbType" placeholder="选择数据源类型">
            <el-option label="MySQL" value="MySQL" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button
            v-if="!isAdd"
            class="button"
            type="danger"
            @click="onDelete"
            >删除</el-button
          >
          <el-button v-else @click="isDialog = false">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 导入对话框 -->
    <el-dialog v-model="isImport" destroy-on-close @closed="importList = []">
      <template #header>
        <div>
          <h1>导入字段</h1>
          <el-input
            placeholder="搜索当前选中数据源的表"
            size="small"
            class="search"
            v-model="search"
          >
            <template #append>
              <el-button type="primary" @click="onSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
      </template>
      <el-collapse accordion @change="multipleSelection = []">
        <el-collapse-item v-for="item in importList" :key="item.datasourceId">
          <template #title>
            <div>{{ item.tableName }}</div>
            <div class="btn-box">
              <el-button
                type="primary"
                class="btn"
                size="small"
                @click.stop="onSync(item.tableName)"
                >同步</el-button
              >
              <el-button
                type="primary"
                size="small"
                class="btn"
                @click.stop="
                  onImportbtn(item.tableName, item.comment, item.datasourceId)
                "
                >导入</el-button
              >
            </div>
          </template>
          <el-table
            ref="multipleTableRef"
            :data="item.fieldVos"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="40" />
            <el-table-column prop="fieldName" label="字段名称" width="130">
            </el-table-column>
            <el-table-column prop="fieldType" label="字段类型" width="100" />
            <el-table-column
              prop="primaryPk"
              align="center"
              label="是否为主键"
              width="100"
            />
            <el-table-column prop="fieldDefault" label="默认值" />
            <el-table-column
              prop="fieldComment"
              label="字段注释"
              show-overflow-tooltip
            />
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
    <!-- 抽屉 -->
    <el-drawer
      v-model="isDrawer"
      direction="rtl"
      size="65%"
      destroy-on-close
      @closed="fieldList = []"
    >
      <template #header>
        <h1><b>字段</b></h1>
      </template>
      <template #default>
        <el-table
          ref="multipleTableRef"
          :data="fieldList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column prop="fieldName" label="字段名称" width="130">
          </el-table-column>
          <el-table-column prop="fieldType" label="字段类型" width="100" />
          <el-table-column
            prop="primaryPk"
            align="center"
            label="是否为主键"
            width="100"
          />
          <el-table-column
            prop="fieldDefault"
            label="默认值"
            show-overflow-tooltip
          />
          <el-table-column
            prop="fieldComment"
            label="字段注释"
            show-overflow-tooltip
          />
          <el-table-column prop="fakerType" label="模拟类型">
            <template #default="scope">
              <div>
                <el-select
                  placeholder="选择模拟类型"
                  v-model="fieldList[scope.$index].fakerType"
                  @change="onSelect"
                  ><el-option label="默认值" value="NONE"></el-option
                  ><el-option label="自增长" value="INCREASE"></el-option
                  ><el-option label="固定值" value="FIXED"></el-option
                  ><el-option label="随机" value="RANDOM"></el-option
                  ><el-option label="雪花" value="SNOWFLOWER"></el-option
                  ><el-option label="正则" value="RULE"></el-option
                ></el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="fakerParam" label="模拟参数">
            <template #default="scope">
              <div>
                <el-select
                  v-model="fieldList[scope.$index].fakerParam"
                  v-if="fieldList[scope.$index].fakerType === 'RANDOM'"
                  placeholder="选择随机类型"
                >
                  <el-option label="姓名" value="NAME"></el-option
                  ><el-option label="城市" value="CITY"></el-option
                  ><el-option label="邮箱" value="EMAIL"></el-option
                  ><el-option label="URL" value="URL"></el-option
                  ><el-option label="IP地址" value="IP"></el-option
                  ><el-option label="数值" value="INTEGER"></el-option
                  ><el-option label="小数" value="DECIMAL"></el-option
                  ><el-option label="大学" value="UNIVERSITY"></el-option
                  ><el-option label="日期" value="DATE"></el-option
                  ><el-option label="手机号" value="PHONE"></el-option
                ></el-select>
                <el-input
                  v-else
                  v-model="fieldList[scope.$index].fakerParam"
                  placeholder="可选"
                ></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-drawer
          v-model="isInnerDrawer"
          direction="ltr"
          size="35%"
          append-to-body
          destroy-on-close
          title="生成数据"
        >
          <div class="infinite-list" style="overflow: auto">
            <el-card title="JSON" class="data-card">
              <template #header>
                <span>JSON语句</span>
                <el-button
                  type="primary"
                  style="float: right; transform: translate(0px, -10px)"
                  @click="copyInfo(JSON.stringify(PostJson, null, 2))"
                  >复制</el-button
                >
              </template>
              <pre
                class="pre"
                style="
                  font-size: 16px;
                  font-family: '微软雅黑', 'Helvetica Neue', Helvetica, Arial,
                    sans-serif;
                "
                >{{ JSON.stringify(PostJson, null, 2) }}</pre
              >
            </el-card>
            <el-card title="JSON" class="data-card">
              <template #header>
                <span>insert语句</span>
                <el-button
                  type="primary"
                  style="float: right; transform: translate(0px, -10px)"
                  @click="copyInfo(PostSql)"
                  >复制</el-button
                >
              </template>
              <p
                class="pre"
                style="
                  white-space: pre-wrap;
                  line-height: 30px;
                  font-size: 16px;
                "
              >
                {{ PostSql }}
              </p>
            </el-card>
          </div>
        </el-drawer>
      </template>
      <template #footer>
        <div>
          <el-input-number v-model="dataNum" min="1"></el-input-number>
          <el-button type="primary" size="large" @click="onData"
            >生成数据</el-button
          >
        </div>
      </template>
    </el-drawer>
    <!-- 生成代码对话框 -->
    <el-dialog v-model="isGenerator" title="生成代码" destroy-on-close>
      <el-form label-position="top" :model="generatorForm">
        <el-form-item label="数据库名称" required
          ><el-select disabled :placeholder="currentName"></el-select
        ></el-form-item>
        <el-form-item label="工程名称" required
          ><el-select v-model="generatorForm.product" placeholder="选择工程">
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.projectName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="代码类型" required
          ><el-select placeholder="选择工程" v-model="generatorForm.type">
            <el-option label="JAVA" value="JAVA"></el-option>
            <el-option label="TYPESCRIPT" value="TYPESCRIPT"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span>
          <el-button @click="isGenerator = false">取消</el-button>
          <el-button type="primary" @click="onGeneratorbtn">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, ref, Ref, watch } from "vue";
import { FormInstance, FormRules, ElTable, ElMessage } from "element-plus";
import useClipboard from "vue-clipboard3";
import {
  PostGetDatasouce,
  PostAddDatasouce,
  PutChangeDatasouce,
  DelDatasouce,
  GetTest,
  GetTableList,
  GetSearch,
  PostTableAdd,
  GetTableListed,
  PostSync,
  GetProductList,
  PostCode,
  PostData,
} from "../api/api";
import { productForm } from "./product.vue";

interface dataSource {
  dbType: string;
  conName: string;
  conUrl: string;
  username?: string;
  password?: string;
  id?: number;
  user?: {
    id?: string;
    username: string;
  };
}
interface field {
  datasourceId: string;
  tableName: string;
  fieldName: string;
  fieldType: string;
  fieldComment: string;
  fieldDefault: string | null;
  primaryPk: number;
  fakerType?: string;
  fakerParam?: string;
}
interface tableList {
  tableName: string;
  comment: string;
  datasourceId: number;
  fieldVos?: Array<field>;
}
interface tableListed {
  comment: string;
  datasource: dataSource;
  tableFields: Array<field>;
  tableId: number;
  tableName: string;
}
interface generatorForm {
  datasource: number;
  product: string;
  type: string;
}
export default defineComponent({
  name: "dataSource",
  setup() {
    // 分页器
    const total: Ref<number> = ref(0);
    const pageSize: number = 4;
    const nowPage: Ref<number> = ref(1);
    const list: Ref<Array<dataSource>> = ref([]);
    // 获取数据
    watch(nowPage, () => {
      getList(nowPage.value);
    });
    const getList = (page: number) => {
      PostGetDatasouce({
        page,
        limit: 4,
      }).then((res) => {
        const data = res.data.data;
        total.value = data.total;
        list.value = data.list;
      });
    };
    getList(1);

    // 对话框
    let isDialog: Ref<boolean> = ref(false);
    let isAdd: Ref<Boolean> = ref(true);
    let currentId: Ref<number> = ref(0);
    const openDialog = (item: dataSource | null = null) => {
      isDialog.value = true;
      if (item) {
        isAdd.value = false;
        currentId.value = item.id as number;
        currentName.value = item.conName;
        delete item.user;
        form.value = item;
      } else {
        isAdd.value = true;
        form.value = {
          dbType: "",
          conName: "",
          conUrl: "",
          username: "",
          password: "",
        };
      }
    };
    const onTest = (id: number | undefined) => {
      if (id)
        GetTest(id).then((res) => {
          if (res.data.code == 1024) {
            ElMessage.error(res.data.msg);
          } else if (res.data.code == 0) {
            ElMessage.success(res.data.msg);
          }
        });
    };
    const onDelete = () => {
      DelDatasouce(currentId.value).then((res) => {
        getList(nowPage.value);
      });

      isDialog.value = false;
    };
    const submitForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate((valid, fields) => {
        if (valid) {
          // 添加
          if (isAdd.value) {
            PostAddDatasouce(form.value).then((res) => {
              getList(1);
            });
          } else {
            // 修改
            PutChangeDatasouce(currentId.value, form.value);
          }
          isDialog.value = false;
        } else {
          console.log("error submit!", fields);
        }
      });
    };

    // 导入对话框
    const importList: Ref<tableList[]> = ref([]);
    const onImport = (id: number | undefined) => {
      isImport.value = true;
      if (id) {
        currentId.value = id;
        GetTableList(id).then((res) => {
          importList.value = res.data.data;
        });
      }
    };
    const onImportbtn = (
      tableName: string,
      comment: string,
      datasourceId: number
    ) => {
      if (multipleSelection.value) {
        const fieldVos = JSON.parse(JSON.stringify(multipleSelection.value));
        const data: any = [{ tableName, comment, datasourceId, fieldVos }];
        PostTableAdd(data).then((res) => {
          ElMessage.success("导入成功");
        });
      } else {
        ElMessage.warning("请选择需要导入的字段");
      }
    };
    const onSync = (tableName: string) => {
      PostSync(currentId.value, [tableName]).then(() =>
        ElMessage.success("同步成功")
      );
    };
    const isImport: Ref<boolean> = ref(false);
    //获取表
    const tableList: Ref<tableListed[]> = ref([]);
    const getTable = (id: number | undefined, name: string) => {
      if (id) {
        currentId.value = id;
        currentName.value = name;
        GetTableListed(id).then((res) => {
          const list: tableListed[] = res.data.data;
          tableList.value = list;
        });
      }
    };

    //搜索
    const search: Ref<string> = ref("");
    const onSearch = () => {
      if (search.value == "") {
        ElMessage.warning("请输入内容");
      } else if (currentId.value == 0) {
        ElMessage.warning("请选择数据源");
      } else {
        GetSearch(currentId.value, search.value).then((res) => {
          importList.value = [];
          importList.value[0] = res.data.data;
        });
      }
    };
    //表单
    const ruleFormRef = ref<FormInstance>();
    const form: Ref<dataSource> = ref({
      dbType: "",
      conName: "",
      conUrl: "",
      username: "",
      password: "",
    });
    const rules = reactive<FormRules>({
      conName: [
        { required: true, message: "必填！", trigger: "blur" },
        { min: 1, max: 30, message: "长度在1~30之间", trigger: "blur" },
      ],
      conUrl: [{ required: true, message: "必填！", trigger: "blur" }],
      username: [
        { required: true, message: "必填！", trigger: "blur" },
        { min: 1, max: 30, message: "长度在1~30之间", trigger: "blur" },
      ],
      password: [
        { required: true, message: "必填！", trigger: "blur" },
        { min: 1, max: 30, message: "长度在1~30之间", trigger: "blur" },
      ],
      dbType: [{ required: true, message: "必填！", trigger: "blur" }],
    });
    //复制
    const { toClipboard } = useClipboard();
    const copyInfo = async (info: string) => {
      try {
        await toClipboard(info);
        ElMessage.success("复制成功");
      } catch (e) {
        ElMessage.warning("您的浏览器不支持复制");
      }
    };
    //抽屉
    const isDrawer: Ref<boolean> = ref(false);
    const fieldList: Ref<field[]> = ref([]);
    let currentTableName: string = "";
    let isInnerDrawer: Ref<boolean> = ref(false);
    let PostJson: Ref<string> = ref("");
    let PostSql: Ref<string> = ref("");
    const openDrawer = (item: tableListed) => {
      //获取字段
      if (item.tableFields) {
        const list: field[] = item.tableFields.filter((v) => {
          return (v.fakerType = "NONE");
        });
        fieldList.value = list;
        currentTableName = item.tableName;
      }
      isDrawer.value = true;
    };
    const onData = () => {
      console.log(fieldList.value, multipleSelection.value);
      let data = {
        tableName: currentTableName,
        fakerNum: dataNum.value,
        fieldList: multipleSelection.value,
      };
      data = JSON.parse(JSON.stringify(data));
      PostData(data).then((res) => {
        isInnerDrawer.value = true;
        PostJson.value = res.data.data.dataList;
        PostSql.value = res.data.data.sql;
      });
    };
    let dataNum: Ref<number> = ref(1);
    const isSelectFrom: Ref<boolean> = ref(false);
    const onSelect = (val: string) => {
      if (val === "RANDOM") {
        isSelectFrom.value = true;
        fieldList.value.forEach((v) => {
          if (v.fakerType === "RANDOM") {
            v.fakerParam = "NAME";
          }
        });
      } else {
        isSelectFrom.value = false;
      }
    };
    const multipleTableRef = ref<InstanceType<typeof ElTable>>();
    //已选择选项
    const multipleSelection = ref<field[]>([]);
    const handleSelectionChange = (val: field[]) => {
      multipleSelection.value = val;
      console.log(multipleSelection.value);
    };
    //生成代码
    let isGenerator: Ref<boolean> = ref(false);
    const generatorForm: Ref<generatorForm> = ref({
      datasource: 0,
      product: "",
      type: "",
    });
    const currentName: Ref<string> = ref("");
    const productList: Ref<productForm[]> = ref([]);
    const tableIds: Ref<number[]> = ref([]);
    const onGenerator = () => {
      isGenerator.value = true;
      generatorForm.value.datasource = currentId.value;
      GetProductList().then((res) => {
        productList.value = res.data.data;
      });
    };
    const onGeneratorbtn = () => {
      if (tableIds.value.length === 0) {
        ElMessage.warning("请选择需要生成代码的表");
      } else {
        const data = JSON.parse(JSON.stringify(generatorForm.value));
        const datas = JSON.parse(JSON.stringify(tableIds.value));
        const { datasource, product, type } = data;
        PostCode(datasource, product, type, datas).then((res) => {
          window.open(res.data.data, "_blank");
        });
      }
    };
    return {
      //假数据
      list,
      // 分页器
      pageSize,
      nowPage,
      total,
      // 对话框
      isDialog,
      isAdd,
      onTest,
      onDelete,
      openDialog,
      submitForm,
      // 导入对话框
      isImport,
      onImport,
      onImportbtn,
      importList,
      onSync,
      //获取表
      getTable,
      //搜索
      search,
      onSearch,
      //表单
      form,
      rules,
      ruleFormRef,
      // 复制
      copyInfo,
      //抽屉
      isDrawer,
      openDrawer,
      onData,
      onSelect,
      isSelectFrom,
      dataNum,
      isInnerDrawer,
      PostJson,
      PostSql,
      //获取表
      tableList,
      //获取字段
      fieldList,
      //表格
      multipleTableRef,
      multipleSelection,
      handleSelectionChange,
      //生成代码
      onGenerator,
      isGenerator,
      productList,
      generatorForm,
      onGeneratorbtn,
      currentName,
      tableIds,
    };
  },
});
</script>

<style lang='less'>
.data-card {
  margin-bottom: 20px;
}
.data-source {
  display: flex;
  width: 100%;
  height: 71.7vh;
  justify-content: space-between;

  .el-dialog__header {
    position: relative;
    .el-input {
      position: absolute;
      right: 150px;
      top: 15px;
      width: 200px;
    }
  }
  .el-input-number {
    margin-right: 70px;
    transform: translate(0px, 5px);
  }
  .el-collapse-item__header {
    position: relative;
    .btn-box {
      position: absolute;
      right: 30px;
      top: -2px;
    }
  }
  .card-header {
    display: flex;
    .title {
      flex: 1;
      line-height: 32px;
      font-size: 22px;
      font-weight: bold;
    }
  }
  .l-content {
    width: 38%;
    height: 87vh;
    position: relative;
    .cart-header {
      display: flex;
    }
    .page {
      position: absolute;
      bottom: 10px;
    }
    .item {
      position: relative;
      cursor: pointer;
      width: 100%;
      margin-bottom: 15px;
      height: 128px;
      .item-header {
        display: flex;
        border-bottom: 1px solid #999;
        padding-bottom: 7px;
        .item-title {
          font-weight: 700;
          flex: 1;
          font-size: 17px;
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
        padding-top: 13px;
        .item-url {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        div {
          height: 30px;
        }
        .btn-box {
          float: right;
        }
      }
    }
  }
  .r-content {
    width: 60%;
    height: 87vh;
    .card-header {
      display: flex;
      .el-input-group {
        width: 35%;
      }
    }
    .table-item {
      cursor: pointer;
      width: 100%;
      height: 40px;
      font-size: 20px;
      transition: all 0.2s;
      border-radius: 3px;
      margin-bottom: 5px;
      line-height: 40px;
      .table-title {
        display: inline-block;
        width: 80%;
      }
      .el-checkbox__label {
        display: none;
      }
      &:hover {
        box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 10px 0px,
          rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
      }
    }
  }
}
</style>