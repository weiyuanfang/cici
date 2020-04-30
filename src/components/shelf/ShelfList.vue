<template>
  <drag-wrap class="shelf-list"
             :data="data"
             :style="{top: shelfListTop}"
             v-on="$listeners"
  >
<!--    transition-group是一个组件吗-->
    <transition-group name="list"
                      tag="div"
                      id="shelf-list">
      <drag-item class="shelf-list-item-wrapper"
                 v-for="(item, index) in data" :key="item.id"
                 :index="index"
                 :isDrag="item.type !== 3"
      >
        <shelf-item :data="item" :style="{height: itemHeight}"></shelf-item>
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{item.title}}</span>
        </div>
      </drag-item>
    </transition-group>
  </drag-wrap>
</template>

<script>
  import { storeShelfMixin } from '../../utils/mixin'
  import ShelfItem from './ShelfItem'
  import { realPx, px2rem } from '../../utils/utils'
  import DragItem from '../common/DragItem';
  import DragWrap from '../common/DragWrap';

  export default {
    mixins: [storeShelfMixin],
    components: {
      DragWrap,
      DragItem,
      ShelfItem
    },
    props: {
      data: Array
    },
    data () {
      return {
        screenWidth: window.innerWidth,
        timeOutId: null
      }
    },
    computed: {
      shelfListTop() {
        return px2rem(this.top) + 'rem'
      },
      itemWidth() {
        return (this.screenWidth - realPx(120)) / 3
      },
      itemHeight() {
        // w / 250 = h / 350
        // h = w / 250 * 350
        return this.itemWidth / 250 * 350 + 'px'
      }
    },
    methods: {
      controlHeight () {
        if (this.timeOutId) {
          // 删除上一次的定时器
          clearTimeout(this.timeOutId)
        }
        this.timeOutId = setTimeout(() => {
          console.log(window.innerWidth)
          this.screenWidth = window.innerWidth
        }, 100)
      }
    },
    mounted() {
      window.addEventListener('resize', this.controlHeight)
    },
    destroyed() {
      window.removeEventListener('resize', this.controlHeight)
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .shelf-list {
    position: absolute;
    left: 0;
    z-index: 100;
    width: 100%;
    #shelf-list {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .shelf-list-item-wrapper {
        flex: 0 0 33.33%;
        width: 33.33%;
        padding: px2rem(15);
        box-sizing: border-box;
        &.list-leave-active {
          display: none;
        }
        &.list-move {
          transition: transform .5s;
        }
        .shelf-list-title-wrapper {
          margin-top: px2rem(10);
        }
      }
    }
  }
</style>
