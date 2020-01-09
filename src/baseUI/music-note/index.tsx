import React, { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
import styled from 'styled-components';
import { prefixStyle } from './../../api/utils';
import style from '../../assets/global-style';

const Container = styled.div`
  .icon_wrapper {
    position: fixed;
    z-index: 1000;
    margin-top: -10px;
    margin-left: -10px;
    color: ${style["theme-color"]};
    font-size: 14px;
    display: none;
    /* transition: transform 1s cubic-bezier(.62,-0.1,.86,.57); */
    transition: transform 1s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    transform: translate3d(0, 0, 0);
    >div {
      transition: transform 1s;
    }
  }
`
export interface MusicNoteHandles {
    /**
     * x,y动画开始时坐标
     */
    startAnimation({ x, y }: { x: number, y: number }): void
}
const MusicNote = forwardRef<MusicNoteHandles, any>((props, ref) => {

    const iconsRef = useRef<HTMLDivElement>(null);
    // 容器中有 3 个音符，也就是同时只能有 3 个音符下落
    const ICON_NUMBER = 3;

    const transform = prefixStyle("transform");

    // 原生 DOM 操作，返回一个 DOM 节点对象
    const createNode = (txt: string) => {
        const template = `<div class='icon_wrapper'>${txt}</div>`;
        let tempNode = document.createElement('div');
        tempNode.innerHTML = template;
        return tempNode.firstChild;
    }

    useEffect(() => {
        const iconDom = iconsRef.current
        if (!iconDom || !transform) {
            return
        }
        for (let i = 0; i < ICON_NUMBER; i++) {
            let node = createNode(`<div class="iconfont">&#xe642;</div>`);
            if (!node) return
            iconDom.appendChild(node);
        }
        // [].slice.call 类数组转换成数组，当然也可以用 [...xxx] 解构语法或者 Array.from ()
        let domArray = Array.from(iconDom.children as unknown as NodeListOf<HTMLElement>);
        domArray.forEach((item: HTMLElement, index: number, array: HTMLElement[]) => {
            item.setAttribute('running', 'false')
            item.addEventListener('transitionend', function () {
                this.style['display'] = 'none';
                this.style[transform as any] = `translate3d(0, 0, 0)`;
                item.setAttribute('running', 'false')

                let icon = this.querySelector('div');
                if (!icon) return
                icon.style[transform as any] = `translate3d(0, 0, 0)`;
            }, false);
        });
    }, [transform]);

    // 计算偏移的辅助函数
    const _getPosAndScale = (x: number, y: number) => {
        const miniCircleWidth = 40;
        // mini圆距左边界距离
        const paddingLeft = 20
        // mini圆心距左边界距离
        const miniCircleLeft = miniCircleWidth / 2 + paddingLeft;
        const miniPlayerHeight = 60
        // mini圆心距下边界距离
        const miniCircleBottom = miniPlayerHeight / 2;

        // 当前点击位置与mini园的横坐标距离和纵坐标距离
        const X = -(x - miniCircleLeft);
        const Y = window.innerHeight - y - miniCircleBottom;
        return {
            X,
            Y
        };
    };

    const startAnimation = ({ x, y }: { x: number, y: number }) => {
        const iconDom = iconsRef.current
        if (!iconDom || !transform) {
            return
        }
        for (let i = 0; i < ICON_NUMBER; i++) {
            let domArray = Array.from(iconDom.children as unknown as NodeListOf<HTMLElement>)
            let item = domArray[i]
            // 选择一个空闲的元素来开始动画
            if (item.getAttribute('running') === 'false') {
                item.style.left = x + "px";
                item.style.top = y + "px";
                item.style.display = "inline-block";

                // TODO 因为目前元素的 display 虽然变为了 inline-block, 但是元素显示出来需要・浏览器的回流 过程，无法立即显示。 也就是说元素目前还是 隐藏 的，那么 元素的位置未知，导致 transform 失效
                //TODO 用 setTimout 的本质将动画逻辑放到下一次的 宏任务。事实上，当本次的宏任务完成后， 会触发 浏览器 GUI 渲染线程 的重绘工作，然后才执行下一次宏任务，那么下一次宏任务中元素就显示了，transform 便能生效
                setTimeout(() => {
                    const { X, Y } = _getPosAndScale(x, y)
                    item.setAttribute('running', 'true')
                    item.style[transform as any] = `translate3d(0, ${Y}px, 0)`;
                    let icon = item.querySelector("div");
                    if (!icon) return
                    // -40px 音符掉落方向以及X轴运动距离
                    icon.style[transform as any] = `translate3d(${X}px, 0, 0)`;
                }, 20);
                break;
            }
        }
    };
    // 外界调用的 ref 方法
    useImperativeHandle(ref, () => ({
        startAnimation
    }));

    return (
        <Container ref={iconsRef}>
        </Container>
    )
})

export default React.memo(MusicNote);