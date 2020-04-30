<template>
  <ebook-dialog :title="title" ref="dialog">
<!--    Dialog插槽-->
<!--    点击移动到，弹出框内容-->
    <div class="dialog-list-wrapper" v-if="!ifNewGroup">
      <template v-for="(item, index) in categoryList">
        <div class="dialog-list-item"
             :class="{'is-add': item.edit  ? item.edit === 1 : false}"
             :key="index"
             @click="onGroupClick(item)"
             v-if="(item.edit === 2 && isInGroup) || item.edit !== 2 || !item.edit">
<!--          取消选择只有在分组中（isInGroup == true）时才显示-->
          <div class="dialog-list-item-text">{{item.title}}</div>
          <div class="dialog-list-icon-wrapper" v-if="isInGroup && shelfCategory.id === item.id">
<!--            选中对勾-->
            <span class="icon-check"></span>
          </div>
        </div>
      </template>
    </div>
    <div class="dialog-new-group-wrapper" v-else>
      <!--    新建分组，弹出框内容-->
      <div class="dialog-input-title-wrapper">
        <span class="dialog-input-title">{{$t('shelf.groupName')}}</span>
      </div>
      <div class="dialog-input-wrapper">
        <div class="dialog-input-inner-wrapper">
          <input type="text" class="dialog-input" v-model="newGroupName" ref="dialogInput">
<!--          输入框右侧 × 按钮-->
          <div class="dialog-input-clear-wrapper" @click="clear" v-show="newGroupName && newGroupName.length > 0">
            <span class="icon-close-circle-fill"></span>
          </div>
        </div>
      </div>
    </div>
    <div slot="btn" class="group-dialog-btn-wrapper">
      <div class="dialog-btn" @click="hide">{{$t('shelf.cancel')}}</div>
<!--      如果输入框没有内容，确认按钮不能点击-->
      <div class="dialog-btn" @click="createNewGroup" :class="{'is-empty': newGroupName && newGroupName.length === 0}"
           v-if="ifNewGroup">{{$t('shelf.confirm')}}
      </div>
    </div>
  </ebook-dialog>
</template>

<script>
  import EbookDialog from '../common/Dialog'
  import { storeShelfMixin } from '../../utils/mixin'
  import { removeAddFromShelf, appendAddToShelf } from '../../utils/store'
  import { saveBookShelf } from '../../utils/localStorage'

  export default {
    name: 'group-dialog',
    mixins: [storeShelfMixin],
    components: {
      EbookDialog
    },
    props: {
      showNewGroup: {
        type: Boolean,
        default: false
      },
      groupName: String
    },
    computed: {
      isInGroup() {
        return this.currentType === 2
      },
      defaultCategory() {
        return [
          {
            title: this.$t('shelf.newGroup'),
            edit: 1
          },
          {
            title: this.$t('shelf.groupOut'),
            edit: 2
          }
        ]
      },
      category() {
        return this.shelfList.filter(item => item.type === 2)
      },
      categoryList() {
        return [...this.defaultCategory, ...this.category]
      },
      title() {
        return !this.ifNewGroup ? this.$t('shelf.moveBook') : this.$t('shelf.newGroup')
      }
    },
    data() {
      return {
        ifNewGroup: false,
        newGroupName: ''
      }
    },
    methods: {
      show() {
        this.ifNewGroup = this.showNewGroup
        this.newGroupName = this.groupName
        this.$refs.dialog.show()
      },
      hide() {
        this.$refs.dialog.hide()
        setTimeout(() => {
          this.ifNewGroup = false
        }, 200)
      },
      onGroupClick(item) {
        if (item.edit && item.edit === 1) { // 新建分组
          this.ifNewGroup = true
        } else if (item.edit && item.edit === 2) {
          this.moveOutFromGroup(item) // 移除分组（只有在分组列表中才显示）
        } else {
          this.moveToGroup(item) // 移入分组
        }
      },
      clear() {
        this.newGroupName = ''
      },
      moveToGroup(group) { // group为选中的分组
        console.log(group)
        this.setShelfList(this.shelfList.filter(book => {
          // 将所有选中书籍从 shelfList移除
            // 1. 若该书籍在分组中
            if (book.itemList) { // 拥有itemList属性的为分组
              book.itemList = book.itemList.filter(subBook => this.shelfSelected.indexOf(subBook) < 0)
            }
            // 2. 若该书籍在书架列表中
            return this.shelfSelected.indexOf(book) < 0
          }))
          .then(() => {
            if (group && group.itemList) {
              group.itemList = [...group.itemList, ...this.shelfSelected] // 将选中书籍和当前分组itemList合并
            }
            // group.itemList.forEach((item, index) => {
            //   item.id = index + 1 // 更新书架中每本电子书的id
            // })
            this.simpleToast(this.$t('shelf.moveBookInSuccess').replace('$1', group.title))
            this.onComplete()
          })
      },
      moveOutFromGroup() {
        this.moveOutOfGroup(this.onComplete)
      },
      createNewGroup() {
        if (!this.newGroupName || this.newGroupName.length === 0) { // 要求分组名称不为空
          return
        }
        if (this.showNewGroup) { // showNewGroup 通过父组件传值的得到
          // 1. 修改分组名
          this.shelfCategory.title = this.newGroupName
          this.onComplete()
        } else {
          // 2. 新建一个分组对象
          const group = {
            id: this.shelfList[this.shelfList.length - 2].id + 1, // shelfList最后一个元素为 添加框
            itemList: [],
            selected: false,
            title: this.newGroupName,
            type: 2
          }
          let list = removeAddFromShelf(this.shelfList) // 删除最后的 添加框
          list.push(group) // 将group加入 list
          list = appendAddToShelf(list) // 重新添加最后的 添加框
          this.setShelfList(list)
            this.moveToGroup(group)
        }
      },
      onComplete() {
        saveBookShelf(this.shelfList)
        this.hide()
        this.setIsEditMode(false)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";

  .dialog-list-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    font-size: px2rem(14);
    @include scroll;
    .dialog-list-item {
      display: flex;
      padding: px2rem(15) 0;
      box-sizing: border-box;
      color: #666;
      &.is-add {
        color: $color-blue;
        &:active {
          color: $color-blue-transparent;
        }
      }
      &:active {
        color: rgba(102, 102, 102, .5)
      }
      .dialog-list-item-text {
        flex: 1;
      }
      .dialog-list-icon-wrapper {
        flex: 0 0 px2rem(30);
        color: $color-blue;
        @include right;
      }
    }
  }

  .dialog-new-group-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    .dialog-input-title-wrapper {
      font-size: px2rem(10);
      margin-top: px2rem(20);
    }
    .dialog-input-wrapper {
      width: 100%;
      padding: 0 0 px2rem(30) 0;
      box-sizing: border-box;
      .dialog-input-inner-wrapper {
        display: flex;
        width: 100%;
        padding: px2rem(10) 0;
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #eee;
        font-size: px2rem(14);
        color: #666;
        .dialog-input {
          flex: 1;
          border: none;
          &:focus {
            outline: none;
          }
        }
        .dialog-input-clear-wrapper {
          flex: 0 0 px2rem(30);
          color: #ccc;
          @include center;
          &:active {
            color: #999;
          }
        }
      }
    }
  }

  .group-dialog-btn-wrapper {
    width: 100%;
    @include center;
  }

  .dialog-btn {
    flex: 1;
    &.is-empty {
      color: rgba(255, 255, 255, .5);
    }
    &:active {
      color: rgba(255, 255, 255, .5)
    }
  }
</style>
