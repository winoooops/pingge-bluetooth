<template>
  <div class="gprint">
    <div>
      <h1>当前连接状态：{{ currentDeviceName }}</h1>
    </div>
    <el-button type="primary" @click="init">初始化</el-button>
    <el-button type="success" @click="start">点击搜索蓝牙</el-button>
    <el-table
      :data="deviceList"
      style="width: 100%"
      @row-click="connect"
      element-loading-text="连接中"
      v-loading="loading"
    >
      <el-table-column prop="name" label="名称" width="" align="center">
      </el-table-column>
    </el-table>
    <el-input v-model="printText" placeholder="请输入打印内容"></el-input>
    <el-button type="success" @click="sendDataToDevice">打印</el-button>
    <el-button type="danger" @click="off">断开</el-button>
    <el-button type="primary" @click="printQRCode">打印二维码</el-button>
  </div>
</template>
<script>
import tsc, { jpPrinter } from "@/views/pingge/gprint/utils/tsc.js";
import { Toast } from "vant";

export default {
  name: "gprint",
  props: {
    printStr: {
      type: String,
      default: "",
    },
  },
  data: function () {
    return {
      msg: "test",
      deviceList: [],
      currentDeviceName: "无连接",
      currentDeviceID: "",
      currentServiceID: "",
      currentCharacteristicId: "",
      loading: false,
      showCode: false,
      printText: "",
      printer: {},
    };
  },

  methods: {
    off() {
      this.deviceList = [];
      this.currentDeviceName = "";
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {},
      });

      wx.getConnectedBluetoothDevices({
        success: function (res) {
          res.devices.forEach((element) => {
            wx.closeBLEConnection({
              deviceId: element.deviceId,
              success: function (res) {
                alert("关闭" + element.name);
                wx.closeBluetoothAdapter({
                  success: function (res) {
                    console.log(res);
                  },
                });
              },
            });
          });
        },
        fail: function () {
          alert("请先初始化蓝牙");
        },
      });
    },

    connect(row, column, event) {
      this.loading = true;

      this.currentDeviceID = row.deviceId;

      wx.createBLEConnection({
        // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
        deviceId: this.currentDeviceID,
        success: (res) => {
          this.loading = false;

          wx.stopBluetoothDevicesDiscovery({
            success: (res) => {},
          });
          wx.getBLEDeviceServices({
            // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
            deviceId: this.currentDeviceID,
            success: (res) => {
              alert("连接成功");
              this.currentDeviceName = row.name;

              res.services.forEach((element) => {
                wx.getBLEDeviceCharacteristics({
                  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
                  deviceId: this.currentDeviceID,
                  // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
                  serviceId: element.uuid,
                  success: (res) => {
                    var characteristics = res.characteristics;
                    characteristics.forEach((characteristic) => {
                      if (
                        characteristic.properties.write &&
                        characteristic.properties.read &&
                        characteristic.properties.notify &&
                        characteristic.properties.indicate
                      ) {
                        this.currentServiceID = element.uuid;
                        this.currentCharacteristicId = characteristic.uuid;
                      }
                    });
                  },
                });
              });
            },
          });
        },
        fail: (res) => {
          alert("连接失败");
        },
      });
    },
    sendDataToDevice() {
      if (this.printText == "") {
        alert("请先输入打印内容");
        return;
      }
      var currentDeviceID = this.currentDeviceID;
      var currentServiceID = this.currentServiceID;
      var characteristicId = this.currentCharacteristicId;
      console.log("currentDeviceID" + currentDeviceID);
      console.log("currentServiceID" + currentServiceID);
      console.log("characteristicId" + characteristicId);

      var command = tsc.jpPrinter.createNew();
      command.setSize(100, 100);
      command.setGap(2);
      command.setCls();
      command.setText(80, 350, "TSS24.BF2", 3, 3, this.printText);
      command.setPagePrint();
      var uint8Buf = Array.from(command.getData());
      function split_array(datas, size) {
        var result = {};
        var j = 0;
        for (var i = 0; i < datas.length; i += size) {
          result[j] = datas.slice(i, i + size);
          j++;
        }
        console.log(result);
        return result;
      }

      var sendloop = split_array(uint8Buf, 20);

      function realWriteData(sendloop, i) {
        var data = sendloop[i];
        if (typeof data == "undefined") {
          alert("打印成功");
        }
        var buffer = new ArrayBuffer(data.length);
        var dataView = new DataView(buffer);
        for (var j = 0; j < data.length; j++) {
          dataView.setUint8(j, data[j]);
        }

        wx.writeBLECharacteristicValue({
          // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
          deviceId: currentDeviceID,
          // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
          serviceId: currentServiceID,
          // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
          characteristicId: characteristicId,
          // 这里的value是ArrayBuffer类型
          value: buffer,
          success: function (res) {
            realWriteData(sendloop, i + 1);
          },
          fail: function (res) {
            alert("打印失败，请先连接设备");
          },
        });
      }
      var i = 0;
      realWriteData(sendloop, i);
    },

    start() {
      wx.startBluetoothDevicesDiscovery({
        success: (res) => {
          wx.onBluetoothDeviceFound((res) => {
            wx.getBluetoothDevices({
              success: (res) => {
                var tempDeviceList = [];
                res.devices.forEach((element) => {
                  if (element.name != "") {
                    tempDeviceList.push(element);
                  }
                });
                this.deviceList = tempDeviceList;
              },

              fail: function (res) {},
              complete: function (res) {},
            });
          });
        },
      });
    },

    init() {
      this.$axios({
        url: "http://172.16.33.142:9999/wxconfig/test",
        method: "GET",
      }).then((result) => {
        console.log(result);
        var apilist = [
          "openBluetoothAdapter",
          "getBluetoothAdapterState",
          "onBluetoothAdapterStateChange",
          "startBluetoothDevicesDiscovery",
          "stopBluetoothDevicesDiscovery",
          "getBluetoothDevices",
          "onBluetoothDeviceFound",
          "getConnectedBluetoothDevices",
          "closeBluetoothAdapter",
          "writeBLECharacteristicValue",
        ];
        const timestmp = result.data.timestamp;
        const signature = result.data.signature;
        const noncestr = result.data.noncestr;
        console.log(window.location.href);
        wx.config({
          beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: "ww2727102957210a7b", // 必填，企业微信的corpID
          timestamp: timestmp, // 必填，生成签名的时间戳
          nonceStr: noncestr, // 必填，生成签名的随机串
          signature: signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
          jsApiList: apilist, // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
        });

        wx.checkJsApi({
          jsApiList: apilist, // 需要检测的JS接口列表，所有JS接口列表见附录2,
        });
        wx.ready(function () {
          wx.openBluetoothAdapter({
            success: (res) => {
              alert("初始化成功");
            },
            fail: function (res) {
              alert("请先打开蓝牙");
            },
          });
        });
      });
    },

    // sendQRCode() {
    //   console.log(this.$props.printStr);
    // },
    // printQRCode() {
    //   Toast("正在打印二维码");
    //   this.printer = jpPrinter.createNew();
    //   this.printer.setSize(100, 100);
    //   this.printer.setGap(2);
    //   this.printer.setCls();
    //   this.printer.setQR(20, 20, "L", 4, "A", 0, this.printStr);
    //   this.printer.setPagePrint();
    //   let uint8_buffer = Array.from(this.printer.getData());
    //   let sendloop = this.split_array(uint8_buffer, 20);
    //   console.log(sendloop);
    //   let i = 0;
    //   this.realWriteData(sendloop, i);
    // },

    printQRCode() {
      var currentDeviceID = this.currentDeviceID;
      var currentServiceID = this.currentServiceID;
      var characteristicId = this.currentCharacteristicId;

      var command = tsc.jpPrinter.createNew();
      command.setSize(100, 100);
      command.setGap(2);
      command.setCls();
      // command.setText(80, 350, "TSS24.BF2", 3, 3, this.printText);
      command.setQR(20, 20, "L", 4, "A", 0, this.printStr);
      command.setPagePrint();
      var uint8Buf = Array.from(command.getData());
      function split_array(datas, size) {
        var result = {};
        var j = 0;
        for (var i = 0; i < datas.length; i += size) {
          result[j] = datas.slice(i, i + size);
          j++;
        }
        console.log(result);
        return result;
      }

      var sendloop = split_array(uint8Buf, 20);

      function realWriteData(sendloop, i) {
        var data = sendloop[i];
        if (typeof data == "undefined") {
          alert("打印成功");
        }
        var buffer = new ArrayBuffer(data.length);
        var dataView = new DataView(buffer);
        for (var j = 0; j < data.length; j++) {
          dataView.setUint8(j, data[j]);
        }

        wx.writeBLECharacteristicValue({
          // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
          deviceId: currentDeviceID,
          // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
          serviceId: currentServiceID,
          // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
          characteristicId: characteristicId,
          // 这里的value是ArrayBuffer类型
          value: buffer,
          success: function (res) {
            realWriteData(sendloop, i + 1);
          },
          fail: function (res) {
            alert("打印失败，请先连接设备");
          },
        });
      }
      var i = 0;
      realWriteData(sendloop, i);
    },

    split_array(data, size) {
      var result = {};
      var j = 0;
      for (var i = 0; i < data.length; i += size) {
        result[j] = data.slice(i, i + size);
        j++;
      }
      console.log(result);
      return result;
    },
    realWriteData(sendloop, i) {
      var data = sendloop[i];
      if (typeof data == "undefined") {
        alert("打印成功");
      }
      var buffer = new ArrayBuffer(data.length);
      var dataView = new DataView(buffer);
      for (var j = 0; j < data.length; j++) {
        dataView.setUint8(j, data[j]);
      }

      wx.writeBLECharacteristicValue({
        // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
        deviceId: this.currentDeviceID,
        // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
        serviceId: this.currentServiceID,
        // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
        characteristicId: this.characteristicId,
        // 这里的value是ArrayBuffer类型
        value: buffer,
        success: function (res) {
          this.realWriteData(sendloop, i + 1);
        },
        fail: function (res) {
          alert("打印失败，请先连接设备");
        },
      });
    },
  },
  mounted() {},
};
</script>
<style scoped>
.gprint {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>