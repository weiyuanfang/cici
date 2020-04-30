<template>
<!--    监听三个事件-->
<!--    dragstart：拖拽开始时触发-->
<!--    dragend：拖拽结束时触发-->
<!--    dragenter：被拖拽的组件进入当前组件时，触发-->
<!--    stop：防止冒泡-->
<!--    $slots.drag存在，如果有设置具名插槽，当前整个不能被拖拽-->
    <div class="drag-item"
         @dragstart.stop="onDragstart"
         @dragenter.stop="onDragenter"
         @dragend.stop="onDragend"
         :draggable="isDrag"
        >
        <slot></slot>
    </div>
</template>

<script>
    import Emitter from '../../utils/emitter'
    export default {
        name: 'DragItem',
        mixins: [Emitter],
        props: {
            index: Number,
            isDrag: Boolean
        },
        methods: {
            onDragstart() {
                this.$el.style.opacity = 0.3;
                // 从当前组件this找到目标组件DragWrap
                this.dispatch('DragWrap', 'dragstart', this.$el, this.index); // 触发dragstart
            },
            onDragenter() {
                this.dispatch('DragWrap', 'dragenter', this.$el, this.index); // 触发dragenter
            },
            onDragend() {
                this.$el.style.opacity = 1;
                this.dispatch('DragWrap', 'dragend'); // 触发dragend
            }
        },
        mounted() {
            this.dispatch('DragWrap', 'putChild', this.$el); // this.$el为当前组件实例对应的真实Dom。
            // 触发DragWrap这个组件上的putChild方法，参数是当前组件的真实Dom
        }
    }
</script>

<style scoped>
    .drag-item {
        animation: shake .3s;
    }
    @keyframes shake {
        0% {
            transform: translate3d(-10%, 0, 0);
        }
        50% {
            transform: translate3d(10%, 0, 0);
        }
        100% {
            transform: translate3d(0, 0, 0);
        }
    }
</style>
