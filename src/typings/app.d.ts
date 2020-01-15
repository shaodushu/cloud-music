declare namespace CloudMusic {
    export interface Recommend {
        id: number
        picUrl: string
        playCount: number
        name: string
    }

    export interface Songs {
        id: number
        name: string
        ar: any[]
        al: {
            picUrl: string
        }
    }
    export interface SongsList {
        collectCount?: number
        showCollect: boolean
        showBackground: boolean
        songs: Array<Songs>
        /**
         * 接受触发动画的函数
         */
        musicAnimation: (x: number, y: number) => void
    }

    export interface Player {
        song: Songs
        /**
         * 是否全屏
         */
        fullScreen: boolean
        /**
         * 是否播放
         */
        playing: boolean
        /**
         * 播放占比
         */
        percent: number
        /**
         * 总时长
         */
        duration: number
        /**
         * 播放时间
         */
        currentTime: number
        /**
         * 切换全屏状态
         */
        toggleFullScreen: (state: boolean) => void
        /**
         * 切换播放状态
         */
        togglePlaying: (e: React.MouseEvent, state: boolean) => void
        /**
         * 进度条变化
         */
        onProgressChange?: (precent: number) => void
        /**
         * 切换是否显示播放列表
         */
        togglePlayList: (state: boolean) => void
    }

    export interface MiniPlayer extends Player { }

    export interface NormalPlayer extends Player {
        /**
         * 播放模式
         * sequence: 0;
         * loop: 1;
         * random: 2.
         */
        mode: 0 | 1 | 2
        currentLyric: any | null
        /**
         * 即时歌词
         */
        currentPlayingLyric: string
        /**
         * 当前行数
         */
        currentLineNum: number
        /**
         * 上一首
         */
        onPrev: () => void
        /**
         * 下一首
         */
        onNext: () => void
        /**
         * 改变播放模式
         */
        changeMode: () => void
    }

    export interface ProgressBarTouch {
        /**
         * 为 true 表示滑动动作开始了
         */
        initiated: boolean
        /**
         * 滑动开始时横向坐标
         */
        startX: number
        /**
         * 当前 progress 长度
         */
        left: number
    }

    export interface BScroll extends HTMLElement {
        /**
         * 作用：scroll 横轴坐标。
         */
        x: number
        /**
         * 作用：scroll 纵轴坐标。
         */
        y: number
        /**
         * 作用：scroll 最大横向滚动位置。
         * 备注：scroll 横向滚动的位置区间是 0 - maxScrollX，并且 maxScrollX 是负值。
         */
        maxScrollX: number
        /**
         * 作用：scroll 最大纵向滚动位置。
         * 备注：scroll 纵向滚动的位置区间是 0 - maxScrollY，并且 maxScrollY 是负值。
         */
        maxScrollY: number
        /**
         * 作用：判断 scroll 滑动过程中的方向（左右）。
         * 备注：-1 表示从左向右滑，1 表示从右向左滑，0 表示没有滑动。
         */
        movingDirectionX: number
        /**
         * 作用：判断 scroll 滑动过程中的方向（上下）。
         * 备注：-1 表示从上往下滑，1 表示从下往上滑，0 表示没有滑动。
         */
        movingDirectionY: number
        /**
         * 作用：判断 scroll 滑动结束后相对于开始滑动位置的方向（左右）。
         * 备注：-1 表示从左向右滑，1 表示从右向左滑，0 表示没有滑动。
         */
        directionX: number
        /**
         * 作用：判断 scroll 滑动结束后相对于开始滑动位置的方向（上下）。
         * 备注：-1 表示从上往下滑，1 表示从下往上滑，0 表示没有滑动。
         */
        directionY: number
        /**
         * 作用：判断当前 scroll 是否处于启用状态。
         */
        enabled: boolean
        /**
         * 作用：判断当前 scroll 是否处于滚动动画过程中。
         * 备注：当开启 CSS3 Transition 动画时判断该值。
         */
        isInTransition: boolean
        /**
         * 判断当前 scroll 是否处于滚动动画过程中。
         * 备注：当开启 JS Animation 动画时判断该值。
         */
        isAnimating: boolean
        /**
         * 作用：监听当前实例上的自定义事件。如：scroll, scrollEnd, pullingUp, pullingDown等。
         * @param {String} type 事件名 
         * @param {Function} fn 回调函数
         * @param {context} 函数执行的上下文环境，默认是 this
         */
        on(type: string, fn, context?): void
        /**
         * 作用：移除自定义事件监听器。只会移除这个回调的监听器。
         * @param {String} type 事件名 
         * @param {Function} fn 回调函数
         */
        off(type: string, fn?): void
        /**
         * 作用：重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
         */
        refresh(): void
        /**
         * 滚动到指定的位置
         * @param {Number} x 横轴坐标（单位 px）
         * @param {Number} y 纵轴坐标（单位 px）
         * @param {Number} time 滚动动画执行的时长（单位 ms）
         * @param {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
         */
        scrollTo(x: number, y: number, time?: number, easing?): void
        /**
         * 滚动到指定的目标元素
         * @param {DOM | String} el el 滚动到的目标元素, 如果是字符串，则内部会尝试调用 querySelector 转换成 DOM 对象
         * @param {Number} time time 滚动动画执行的时长（单位 ms）
         * @param {Number | Boolean} offsetX offsetX 相对于目标元素的横轴偏移量，如果设置为 true，则滚到目标元素的中心位置
         * @param {Number | Boolean} offsetY 相对于目标元素的纵轴偏移量，如果设置为 true，则滚到目标元素的中心位置
         * @param {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法
         */
        scrollToElement(el, time, offsetX?, offsetY?, easing?): void
    }
}