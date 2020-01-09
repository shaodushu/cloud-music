import React, { useState, useRef, useEffect, memo } from 'react';
import styled from 'styled-components';
import Scroll from '../scroll/index';
import style from '../../assets/global-style';

const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  justify-content: center;
  overflow: hidden;
  >span:first-of-type{
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    color: grey;
    font-size: ${style["font-size-m"]};
    /* vertical-align: middle; */
  }
`
const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style["font-size-m"]};
  padding: 5px 5px;
  border-radius: 10px;
  &.selected{
    color: ${style["theme-color"]};
    border: 1px solid ${style["theme-color"]};
    opacity: 0.8;
  }
`

function Horizen(props: BaseUI.Horizen) {
    const [refreshCategoryScroll, setRefreshCategoryScroll] = useState(false);
    const { list, oldVal, title } = props;
    const { onClick } = props;
    const Category = useRef<HTMLDivElement>(null);

    //TODO 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。这并不属于特殊情况 —— 它依然遵循依赖数组的工作方式 [https://zh-hans.reactjs.org/docs/hooks-effect.html]。
    useEffect(() => {
        //加入初始化内容宽度的逻辑
        let categoryDOM = Category.current;
        if (!categoryDOM) {
            return
        }
        let tagElems = categoryDOM.querySelectorAll("span");
        let totalWidth = 0;
        Array.from(tagElems).forEach((ele) => {
            totalWidth += ele.offsetWidth;
        });
        //TODO 为什么总宽度每次加2
        totalWidth += 2;
        categoryDOM.style.width = `${totalWidth}px`;
        setRefreshCategoryScroll(true);
    }, [refreshCategoryScroll]);

    return (
        <Scroll direction="horizental">
            <div ref={Category}>
                <List>
                    <span>{title}</span>
                    {
                        list.map((item) => {
                            return (
                                <ListItem
                                    key={item.key}
                                    className={`${oldVal === item.key ? 'selected' : ''}`}
                                    onClick={() => onClick && onClick(item.key)}>
                                    {item.name}
                                </ListItem>
                            )
                        })
                    }
                </List>
            </div>
        </Scroll>
    )
}

Horizen.defaultProps = {
    list: [],
    oldVal: '',
    title: '',
};

export default memo(Horizen);