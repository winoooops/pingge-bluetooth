<template>
  <div>
    <div slot="header" style="text-align: center">
      <h1>平哥食品</h1>
    </div>
    <div v-for="(item, i) in tableData" :key="i">
      <table class="pingge-supply-table">
        <tr>
          <th>物料编码</th>
          <td width="25%">{{ item.materialCode }}</td>
          <th>物料名称</th>
          <td width="25%">{{ item.materialName }}</td>
        </tr>
        <tr>
          <th>物料规格</th>
          <td width="25%">{{ item.specification }}</td>
          <th>数量</th>
          <td width="25%">{{ item.quantity }}</td>
        </tr>
        <tr>
          <th>生产日期</th>
          <td width="25%">{{ item.manufacturer_date }}</td>
          <th>入库日期</th>
          <td width="25%">{{ item.stock_date }}</td>
        </tr>
        <tr>
          <th scope="row">生产厂家</th>
          <td>{{ item.manufacturer }}</td>
        </tr>
        <tr>
          <th scope="row">供应商</th>
          <td>{{ item.supplier }}</td>
        </tr>
      </table>
      <VueQR :text="JSON.stringify(item)" />
    </div>
  </div>
</template>
<script>
import VueQR from "vue-qr";

export default {
  name: "supplyQRCode",
  components: {
    VueQR,
  },
  data() {
    return {
      tableData: [
        {
          materialCode: "20210202_001",
          materialName: "泡鸭爪(辣)",
          specification: "26g",
          quantity: "0",
          manufacturer_date: "2021-02-01",
          manufacturer: "平哥食品",
          supplier: "供应商",
          stock_date: "2021-02-01",
        },
      ],
    };
  },
};
</script>
<style scoped>
.pingge-supply-table {
  border: 1px solid black;
  border-collapse: collapse;
  width: 100%;
}

.pingge-supply-table th,
td {
  border: 1px solid black;
  text-align: center;
}
</style>