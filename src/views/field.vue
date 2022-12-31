<template>
  <div class="field">
    <el-card>
      <!-- //头部 -->
      <template #header>
        <div class="card-header">
          <span class="title">字段服务</span>
        </div>
      </template>
      <div class="field-content">
        <el-table :data="list" max-height="71.5vh" border stripe>
          <el-table-column prop="columnType" label="字段名称" />
          <el-table-column prop="javaType" label="java类型" />
          <el-table-column prop="javaPackageName" label="java包名" />
          <el-table-column prop="jsType" label="js类型" />
          <el-table-column prop="jsPackageName" label="js包名" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { GetFieldType } from "../api/api";
interface field {
  id: number;
  columnType: string;
  javaType: string;
  javaPackageName: string | null;
  jsPackageName: string | null;
  jsType: string;
}
export default defineComponent({
  name: "field",
  setup() {
    const list: Ref<field[]> = ref([]);
    const getList = () => {
      GetFieldType().then((res) => {
        const newList: field[] = Object.values(res.data.data);
        newList.forEach((v) => {
          if (v.javaPackageName == null) {
            v.javaPackageName = "空";
          }
          if (v.jsPackageName == null) {
            v.jsPackageName = "空";
          }
        });
        list.value = newList;
      });
    };
    getList();
    return {
      list,
    };
  },
});
</script>

<style lang='less'>
.field {
  .card-header {
    display: flex;
    .title {
      flex: 1;
      line-height: 32px;
      font-size: 22px;
      font-weight: bold;
    }
  }
}
</style>