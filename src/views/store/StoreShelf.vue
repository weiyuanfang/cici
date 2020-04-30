<!-- 书架组件 -->
<template>
  <div class="store-shelf">
    <shelf-title :title="$t('shelf.title')"></shelf-title>
    <scroll class="store-shelf-scroll-wrapper"
            :top="0"
            :bottom="scrollBottom"
            @onScroll="onScroll"
            ref="scroll">
      <shelf-search></shelf-search>
      <shelf-list :data="shelfList" @watchData="watchData"></shelf-list>
    </scroll>
    <shelf-footer></shelf-footer>
  </div>
</template>

<script>
  import ShelfTitle from '../../components/shelf/ShelfTitle'
  import { storeShelfMixin } from '../../utils/mixin'
  import Scroll from '../../components/common/Scroll'
  import ShelfSearch from '../../components/shelf/ShelfSearch'
  import ShelfList from '../../components/shelf/ShelfList'
  import ShelfFooter from '../../components/shelf/ShelfFooter'
  import { saveBookShelf } from '../../utils/localStorage';
  import { computeId } from '../../utils/store';

  export default {
    mixins: [storeShelfMixin],
    components: {
      Scroll,
      ShelfTitle,
      ShelfSearch,
      ShelfList,
      ShelfFooter
    },
    watch: {
      // 监听编辑模式，编辑模式下滚动条距底部需要产生48像素的距离
      isEditMode(isEditMode) {
        this.scrollBottom = isEditMode ? 48 : 0
        // console.log(this.$refs.scroll)
        // 此时子组件为收到更新
        this.$nextTick(() => {
          // 如果用在子组件上，引用就指向组件实例（即该组件this）
          this.$refs.scroll.refresh() // 重新改变Scroll组件高度
        })
      }
    },
    data() {
      return {
        scrollBottom: 0
      }
    },
    methods: {
      // 滚动页面的监听事件，ShelfTitle和ShelfSearch组件会进行监听
      onScroll(offsetY) {
        this.setOffsetY(offsetY)
      },
      watchData(newList) {
        newList = computeId(newList)
        this.setShelfList(newList)
        saveBookShelf(this.shelfList)
      }
    },
    mounted() {
      console.log('开始挂载了')
      console.log(this.$refs.scroll[0])
      // 获取书架列表数据
      this.getShelfList()
      // 初始化书架分类数据
      this.setShelfCategory([])
      // 设置vuex的currentType为1，表示当前位于书架，影响ShelfTitle状态
      this.setCurrentType(1)
    },
    destroyed() {
      console.log('被销毁了')
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .store-shelf {
    position: relative;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: white;
    .store-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
    }
  }
</style>
