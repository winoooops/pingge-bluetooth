<template>
  <div>
    <h1>平哥食品</h1>
    <table class="pingge-stock-table">
      <tr>
        <th scope="col">生产订单</th>
        <th scope="col">物料名称</th>
        <th scope="col">物料规格</th>
        <th scope="col">入库数量</th>
        <th scope="col">入库人</th>
        <th scope="col">入库时间</th>
      </tr>
      <tr v-for="(item, i) in tableData" :key="i">
        <td>{{ item.order }}</td>
        <td>{{ item.material_name }}</td>
        <td>{{ item.specification }}</td>
        <td>{{ item.quantity }}</td>
        <td>{{ item.stock_person }}</td>
        <td>{{ item.stock_date }}</td>
      </tr>
    </table>
    <div>
      <VueQR :text="uniqueCode(query)" />
    </div>
  </div>
</template>
<script>
import VueQR from "vue-qr";

export default {
  name: "stockQRCode",
  components: {
    VueQR,
  },
  data() {
    return {
      tableData: [
        {
          order: "6950320001611",
          material_name: "泡鸭爪(鲜)",
          specification: "26g",
          stock_quantity: "0",
          stock_person: "",
          stock_date: "",
        },
        {
          order: "6950320001628",
          material_name: "泡鸭爪(辣)",
          specification: "26g",
          stock_quantity: "0",
          stock_person: "",
          stock_date: "",
        },
      ],
      query: {
        stock_person: "0001",
        stock_date: "20210202",
      },
    };
  },
  methods: {
    uniqueCode(item) {
      return `${item.stock_date}_${item.stock_person}`;
    },
  },
};
</script>
<style scoped>
.pingge-stock-table {
  border: 1px solid black;
  border-collapse: collapse;
  width: 100%;
}

.pingge-stock-table th,
td {
  border: 1px solid black;
  text-align: center;
}
</style>