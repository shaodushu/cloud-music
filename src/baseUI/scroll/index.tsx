import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle, memo, useMemo } from "react"
import BScroll from "better-scroll"
import {
    ScrollContainer,
    PullUpLoading,
    PullDownLoading
} from './style';
import Loading from '../loading/index';
import LoadingV2 from '../loading-v2/index';
import { debounce } from "../../api/utils";

export interface ScrollHanles {
    refresh(): void
    getBScroll(): void
}
/**
 * better-scroll 的 (横向) 滚动原理，首先外面容器要宽度固定，其次内容宽度要大于容器宽度
 */
const Scroll = forwardRef<ScrollHanles, BaseUI.Scroll>((props, ref) => {
    //better-scroll 实例对象
    const [bScroll, setBScroll]: [CloudMusic.BScroll | undefined, React.Dispatch<any>] = useState();
    //current 指向初始化 bs 实例需要的 DOM 元素 
    const scrollContaninerRef = useRef<HTMLDivElement>(null);

    const { direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props;

    const { pullUp, pullDown, onScroll } = props;

    let pullUpDebounce = useMemo(() => {
        return debounce(pullUp, 300)
    }, [pullUp]);
    // 千万注意，这里不能省略依赖，
    // 不然拿到的始终是第一次 pullUp 函数的引用，相应的闭包作用域变量都是第一次的，产生闭包陷阱。下同。

    let pullDownDebounce = useMemo(() => {
        return debounce(pullDown, 300)
    }, [pullDown]);

    useEffect(() => {
        if (!scrollContaninerRef.current) {
            return
        }
        const scroll = new BScroll(scrollContaninerRef.current, {
            scrollX: direction === "horizental",
            scrollY: direction === "vertical",
            probeType: 3,
            click: click,
            bounce: {
                top: bounceTop,
                bottom: bounceBottom
            }
        });
        setBScroll(scroll);
        //TODO 为什么要在 effect 中返回一个函数？
        // 这是 effect 可选的清除机制
        return () => {
            setBScroll(null);
        }
    }, [bounceBottom, bounceTop, click, direction]);

    useEffect(() => {
        //给实例绑定 scroll 事件
        if (!bScroll || !onScroll) return;
        bScroll.on('scroll', (pos: { x: number, y: number }) => {
            onScroll(pos);
        })
        return () => {
            bScroll.off('scroll');
        }
    }, [onScroll, bScroll]);

    useEffect(() => {
        //进行上拉到底的判断，调用上拉刷新的函数
        if (!bScroll || !pullUp) return;
        bScroll.on('scrollEnd', () => {
            // 判断是否滑动到了底部
            if (bScroll.y <= bScroll.maxScrollY + 100) {
                pullUpDebounce();
            }
        });
        return () => {
            bScroll.off('scrollEnd');
        }
    }, [pullUp, bScroll, pullUpDebounce]);

    useEffect(() => {

        //进行下拉的判断，调用下拉刷新的函数
        if (!bScroll || !pullDown) return;
        bScroll.on('touchEnd', (pos: { y: number; }) => {
            // 判断用户的下拉动作
            if (pos.y > 50) {
                pullDownDebounce();
            }
        });
        return () => {
            bScroll.off('touchEnd');
        }
    }, [pullDown, bScroll, pullDownDebounce]);

    useEffect(() => {
        //每次重新渲染都要刷新实例，防止无法滑动
        if (refresh && bScroll) {
            bScroll.refresh();
        }
    });

    //TODO useImperativeHandle 用法
    // 一般和 forwardRef 一起使用，ref 已经在 forWardRef 中默认传入
    // 建议useImperativeHandle和 forwardRef 同时使用，减少暴露给父组件的属性，避免使用 ref 这样的命令式代码
    useImperativeHandle(ref, () => ({
        // 给外界暴露 refresh 方法
        refresh() {
            if (bScroll) {
                bScroll.refresh();
                bScroll.scrollTo(0, 0);
            }
        },
        // 给外界暴露 getBScroll 方法，提供 bs 实例
        getBScroll() {
            if (bScroll) {
                return bScroll;
            }
        }
    }));

    const PullUpdisplayStyle = pullUpLoading ? { display: "" } : { display: "none" };
    const PullDowndisplayStyle = pullDownLoading ? { display: "" } : { display: "none" };

    return (
        <ScrollContainer ref={scrollContaninerRef}>
            {props.children}
            {/* 滑到底部加载动画 */}
            <PullUpLoading style={PullUpdisplayStyle}><Loading></Loading></PullUpLoading>
            {/* 顶部下拉刷新动画 */}
            <PullDownLoading style={PullDowndisplayStyle}><LoadingV2></LoadingV2></PullDownLoading>
        </ScrollContainer>
    );
})

Scroll.defaultProps = {
    direction: "vertical",
    click: true,
    refresh: true,
    pullUpLoading: false,
    pullDownLoading: false,
    bounceTop: true,
    bounceBottom: true,
    className: ''
};

//TODO userMemo 与 memo 区别
// userMeno 针对 一段函数逻辑是否重复执行
// useMemo是在渲染期间完成的
// useEffect是在渲染之后完成的
// memo类似于PureCompoent 作用是优化组件性能，防止组件触发重渲染
// memo针对 一个组件的渲染是否重复执行
export default memo(Scroll);