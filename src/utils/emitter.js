function broadcast(componentName, eventName, params) {
    // 在当前组件向下找到目标组件的实例
    this.$children.forEach(child => {
        // $options获取Vue实例的初始化选项
        const name = child.$options.name
        if (name === componentName) {
            child.$emit.apply(child, [eventName].concat(params))
        } else {
            broadcast.apply(child, [componentName, eventName].concat([params]))
        }
    });
}
export default {
    name: 'Emitter',
    methods: {
        // 多级父子组件通信
        dispatch(componentName, eventName) {
            // 在当前组件向上找到目标组件的实例
            let parent = this.$parent || this.$root
            let name = parent.$options.name
            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent

                if (parent) {
                    name = parent.$options.name
                }
            }
            // console.log([eventName].concat(params))
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat([...arguments].slice(2)))
            }
        },
        broadcast(componentName, eventName, params) {
            broadcast.call(this, componentName, eventName, params)
        }
    }
};
