<template>
    <div class="drag-wrap" ref="wrap" @dragenter.prevent @dragover.prevent>
<!--         @dragstart="onDragstart"-->
<!--         @dragend="onDragend"-->
<!--         @dragenter.prevent="onDragenter"-->
<!--         @dragover.prevent-->
<!--         @putChild="onPutChild"-->
<!--        阻止浏览器默认行为，不然会显示一个叉叉，不好看-->
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: 'DragWrap',
        props: {
            data: Array
        },
        data () {
            return {
                toDom: '', // 拖拽时进入的元素
                toIndex: -1, // 元素ID
                fromDom: '', // 拖拽起始的元素
                fromIndex: -1,
                operationType: 1,
                children: [] // 存放所有子组件元素的集合（更改前的树变化）
            }
        },
        created() {
            this.$on('dragstart', this.onDragstart) // 子组件会$emit触发dragstart，所以要先注册
            this.$on('dragenter', this.onDragenter) // 子组件会$emit触发dragenter，所以要先注册
            this.$on('dragend', this.onDragend) // 子组件会$emit触发dragend，所以要先注册
            this.$on('putChild', child => { // 这里的child对应的是子组件的this.$el
                this.children.push(child) // 将所有的子组件的Dom元素收集起来
            });
        },
        methods: {
            onDragstart(el, index) {
                console.log('dragstart触发一次', this.data)
                this.fromDom = el // 记录拖拽时开始的元素
                this.fromIndex = index
                // 改进增加时间限制
            },
            onDragenter(el, index) {
                // 改变页面的DOM
                this.toDom = el // 因为拖拽会不停的触发enter事件，所以进入的哪个元素也要记录下来
                this.toIndex = index
                if (this.fromDom === this.toDom) {
                    return
                }
                // 会被触发多次
                console.log('dragenter触发一次', this.data[this.fromIndex], this.data[this.toIndex])
                const parentNode = this.$refs.wrap.childNodes[0]
                const fromType = this.data[this.fromIndex].type || 2
                const toType = this.data[this.toIndex].type || 2
                if (fromType === 2 || (fromType === 1 && toType === 1)) {
                    this.operationType = 1
                } else if (fromType === 1 && toType === 2) {
                    this.operationType = 2
                }
                console.log(this.operationType)
                if (this.operationType === 1) {
                    // 如toDom是一本书，进行Dom移动
                    if (this.isPrevNode(this.fromDom, this.toDom)) { // to是否在from的前面
                        // fromDom插在toDom之前
                        parentNode.insertBefore(this.fromDom, this.toDom)
                    } else { // 否则就是在之后
                        // // fromDom插在toDom之后
                        parentNode.insertBefore(this.fromDom, this.toDom.nextSibling)
                    }
                }
                // 如果toDom是一个文件夹，将DOM删除
            },
            onDragend() {
                console.log('dragend触发一次')
                // DOM在页面中已经改变，现在需要改变数据了
                if (this.data.length === 0) return
                const realDomOrder = [...this.$el.childNodes[0].children]
                    .filter(child => child.classList.contains('drag-item'))
                this.getDataOrder(realDomOrder, this.children) // 对比两颗树
            },
            isPrevNode(from, to) {
                while (from.previousSibling != null) {
                    if (from.previousSibling === to) {
                        return true
                    }
                    from = from.previousSibling
                }
                return false
            },
            getDataOrder(realList, dragAfterList) {
                let newData = [];
                if (this.operationType === 1) {
                    const order = realList.map(realItem => { // 拿到打乱Dom树对应的序号
                        return dragAfterList.findIndex(dragItem => realItem === dragItem);
                    });
                    order.forEach((item, i) => { // 将原数组的数据按照打乱的序号赋值给新数组
                        newData[i] = this.data[item];
                    });
                } else if (this.operationType === 2) {
                    newData = this.data
                    if (newData[this.toIndex].itemList) {
                        let deleteArr = newData.splice(this.fromIndex, 1)
                        newData[this.toIndex].itemList.push(...deleteArr)
                    }
                }
                this.$emit('watchData', newData); // 新数组的顺序就对应打乱Dom的序号，派发出去
                this.operationType = 1
            }
        }
    }
</script>

<style scoped>

</style>
