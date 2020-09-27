<template>
  <div class="navbar" :class="{'notop':isWeixinBrower}">
        <span v-if="left" class="left-arrow" @click="$router.go(-1)">
             <i class="iconfont icon-zuojiantou"></i>
        </span>
    <div class="title">
      <slot name="title">{{title}}</slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Navbar",
    data() {
      return {
        isTeamLogin: false,
        isWeixinBrower:false,
      }
    },
    created() {
      if(navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1){
        this.isWeixinBrower = true
      }
    },
    mounted() {
      this.isTeamLogin = this.$store.state.isTeamLogin
    },
    props: {
      title: {
        default: ""
      },
      left: {
        default: true
      },
    },
  }
</script>

<style scoped lang="stylus">
  .navbar {
    position: fixed
    top: 0
    left: 0
    background-color: #F8F8F8
    width: 100%
    height: .88rem
    line-height: .88rem
    font-size: .36rem
    text-align: center
    color: #333333
    z-index 10

    .left-arrow {
      position: absolute;
      z-index 10
      height: .78rem;
      padding: 0 .4rem 0 .15rem
      left: 0
      color: #999999
    }

    .title {
      width: 100%
      display: block;
    }

    .right {
      position: absolute;
      top: 0.14rem
      right: .2rem;
      background-color: #EF8B02
      color: #fff
      font-size: .3rem
      width: 0.6rem
      height: 0.6rem
      line-height: .6rem
      border-radius 50%
      text-align: center
    }
  }
  .notop {
    top: 0
  }
</style>