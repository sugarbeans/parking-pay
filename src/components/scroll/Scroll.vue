<template>
  <div class="scrollWrap" ref="scrollWrap">
    <div class="scrollContent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "Scroll",
    mounted() {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.scrollWrap, {
          click: true,
          mouseWheel: true,
          scrollbar: false,
          bounce: false
        })
      })
    },
    data () {
      return {
        scroll: ''
      }
    }
  }
</script>

<style scoped>
  .scrollWrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
</style>
