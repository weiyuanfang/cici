<template>
  <transition name="fade">
    <div class="popup" v-if="popupVisible">
        <div class="popup-bg" @click.stop.prevent="hide"></div>
      <transition name="popup-slide-up">
        <div class="popup-wrapper" v-show="visible">
          <div class="popup-title" v-if="title && title.length > 0">{{title}}</div>
          <div class="popup-btn"
               :class="{'danger':item.type==='danger'}"
               v-for="(item, index) in btn"
               :key="index"
               @click="item.click">{{item.text}}
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'popup',
    props: {
      title: String,
      btn: Array
    },
    data() {
      return {
        popupVisible: false,
        visible: false
      }
    },
    methods: {
      show() {
        // popupVisible和visible同时为true的话，浏览器会一次性渲染，利用setTimeout异步强制触发重绘就可以看到动画
        this.popupVisible = true
        // this.$nextTick(() => {
        //   this.visible = true
        // })
        this.visible = true
        setTimeout(() => {

        })
      },
      hide() {
        this.visible = false
        this.$nextTick(() => {
          this.popupVisible = false
        })
        // setTimeout(() => {
        //   this.popupVisible = false
        // }, 200) // 为什么要延迟200ms
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2000;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .4);
    .popup-bg {
      width: 100%;
      height: 100%;
    }
    .popup-wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 2000;
      width: 100%;
      background: white;
      .popup-title {
        width: 100%;
        height: px2rem(44);
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(12);
        line-height: px2rem(14);
        padding: px2rem(15);
        box-sizing: border-box;
        color: #999;
        @include center;
      }
      .popup-btn {
        width: 100%;
        height: px2rem(60);
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(16);
        color: #666;
        font-weight: bold;
        @include center;
        &.danger {
          color: $color-pink;
        }
      }
    }
  }
</style>
