<template>
  <div>
    <table class="pingge-table">
      <tr>
        <th scope="">物料编码</th>
        <td></td>
        <th>物料名称</th>
        <td></td>
      </tr>
      <tr>
        <th>物料规格</th>
        <td></td>
        <th>数量</th>
        <td></td>
      </tr>
      <tr>
        <th>生产日期</th>
        <td></td>
        <th>入库日期</th>
        <td></td>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
    };
  },
};
</script>
<style scoped>
.pingge-table {
  border: 1px solid black;
  border-collapse: collapse;
  width: 300px;
}

.pingge-table th,
td {
  border: 1px solid black;
  text-align: center;
}

/* table th td {
  border: 2px solid blue;
  border-collapse: collapse;
} */

/* th td {
  text-align: center;
  padding: 5px;
} */
</style>>
