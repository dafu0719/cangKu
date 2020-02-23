<template>
  <div id="app">
      <keep-alive >
        <router-view />
      </keep-alive>
  </div>
</template>  

<style lang="less">
html,body,#app{
  background-color: #ededed;
  height: 100%;
}
#app{
  height: 100%;
}
</style>
