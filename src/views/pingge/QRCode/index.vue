<template>
  <el-card>
    <div slot="header" style="text-align: center">
      <h1>平哥食品</h1>
    </div>
    <table class="pingge-table">
      <tr>
        <th>物料编码</th>
        <td width="25%"></td>
        <th>物料名称</th>
        <td width="25%"></td>
      </tr>
      <tr>
        <th>物料规格</th>
        <td width="25%"></td>
        <th>数量</th>
        <td width="25%"></td>
      </tr>
      <tr>
        <th>生产日期</th>
        <td width="25%"></td>
        <th>入库日期</th>
        <td width="25%"></td>
      </tr>
      <tr>
        <th scope="row">生产厂家</th>
        <td></td>
      </tr>
      <tr>
        <th scope="row">供应商</th>
        <td></td>
      </tr>
    </table>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
    };
  },
  activated() {
    console.log(wx);
  },
};
</script>
<style scoped>
.pingge-table {
  border: 1px solid black;
  border-collapse: collapse;
  width: 100%;
}

.pingge-table th,
td {
  border: 1px solid black;
  text-align: center;
}
</style>>
