<template>
  <div class="page-404">
    <div class="d2-mt">
      <p class="page-404_title">恭喜你，门票已成功激活！</p>
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
  }
  .d2-mt {
    width: 100%;
    height: 30%;
    background-image url("./../assets/img/success.png")
    background-size 100% 100%;
    font-size: .42rem;
    text-align center
    .page-404_title {
      color: #51e162
      line-height 70px;
      font-size: 20px;
    }
  }
</style>
