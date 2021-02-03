<template>
  <div id="app">
    <header>
      <router-link to="/gprint">打印机设置</router-link>
      <router-link to="scan">二维码</router-link>
    </header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: "App",
};
</script>

<style>
</style>
