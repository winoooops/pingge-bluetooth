<template>
  <div>
    <!-- <headNavBar title="打印模版" backUrl="/"> </headNavBar> -->
    <!-- <printerConfig @onLabelSelected="handleTabChange" ref="printer" /> -->
    <printer :printStr="targetStr" />
    <div class="qrcodes" style="margin-top: 20px">
      <van-tabs v-model="activeTab" @click="onTabClick">
        <van-tab title="物料标签" name="supply-tab">
          <supplyQRCode ref="supply" />
        </van-tab>
        <van-tab title="成品标签" name="stock-tab">
          <stockQRCode ref="stock" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
// import { jpPrinter } from "@/views/pingge/utilities/sPrint/printer/tsc.js";
import printer from "../gprint/index";
import supplyQRCode from "./supplyQRCode";
import stockQRCode from "./stockQRCode";
import { Toast } from "vant";

export default {
  name: "sPrint",
  components: {
    stockQRCode,
    supplyQRCode,
    printer,
  },
  data() {
    return {
      activeTab: "supply-tab",
      targetStr: "",
    };
  },
  methods: {
    // handleTabChange(label) {
    //   Toast(`已选择: ${label}`);
    //   if (label === "物料标签") {
    //     this.activeTab = "supply-tab";
    //     this.$nextTick(() => {
    //       console.log(this.$refs.supply.tableData);
    //       this.$refs.printer.targetString = JSON.stringify(
    //         this.$refs.supply.tableData
    //       );
    //     });
    //   } else {
    //     this.activeTab = "stock-tab";
    //     this.$nextTick(() => {
    //       console.log(Object.values(this.$refs.stock.query));
    //       this.$refs.printer.targetString = JSON.stringify(
    //         Object.values(this.$refs.stock.query)
    //       );
    //     });
    //   }
    // },
    onTabClick(name, title) {
      Toast(`已选择: ${title}`);
      this.$nextTick(() => {
        this.targetStr = JSON.stringify(
          title === "物料标签"
            ? this.$refs.supply.tableData
            : Object.values(this.$refs.stock.query)
        );
        console.log(this.targetStr);
      });
    },
  },
  mounted() {},
};
</script>J