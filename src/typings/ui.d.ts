declare namespace BaseUI {
    /**
     * 打造巨好用的项目灵魂组件 ——Scroll 组件
     */
    export interface Scroll {
        /**
         * 滚动的方向
         */
        direction?: 'vertical' | 'horizental'
        /**
         * 是否支持点击
         */
        click?: boolean
        /**
         * 是否刷新
         */
        refresh?: boolean
        /**
         * 是否上拉加载
         */
        pullUpLoading?: boolean
        /**
         * 是否下拉加载
         */
        pullDownLoading?: boolean
        /**
         * 滑动触发的回调函数
         */
        onScroll?: (pos: { x: number, y: number }) => void
        /**
         * 上拉加载逻辑
         */
        pullUp?: Function
        /**
         * 下拉加载逻辑
         */
        pullDown?: Function
        /**
         * 是否显示上拉 loading 动画
         */
        pullUpLoading?: boolean
        /**
         * 是否显示下拉 loading 动画
         */
        pullDownLoading?: boolean
        /**
         *  是否支持向上吸顶
         */
        bounceTop?: boolean
        /**
         * 是否支持向下吸底
         */
        bounceBottom?: boolean
        children?: React.ReactNode
        className?: string
    }
    /**
     * 横向组件
     */
    export interface Horizen {
        /**
         * 为接受的列表数据
         */
        list: Array<{
            key: string
            name: string
        }>
        /**
         * 为当前的 item 值
         */
        oldVal: string
        /**
         * 为列表左边的标题
         */
        title: string
        /**
         * 为点击不同的 item 执行的方法
         */
        onClick?: (key: string) => void
    }
    /**
     * 顶部导航
     */
    export interface Header {
        title?: string
        subtitle?: string
        /**
         * 是否开启跑马灯
         */
        isMarquee?: boolean
        onBack?: () => void
        onClick?: () => void
    }
}