<template>
  <div class="page-404">
    <p class="page-404_title">page not found</p>
    <div class="d2-mt">
      抱歉，页面无法找到，请稍后访问！
    </div>
  </div>
</template>

<style lang="stylus" scoped>
  .page-404 {
    background: linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%), radial-gradient(at top center, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.40) 120%) #989898;
    background-blend-mode: multiply,multiply;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .page-404_title {
      font-size: 20px;
      color: #FFF;
    }
  }
  .d2-mt {
    color: #fff;
    font-size: .42rem;
  }
</style>
