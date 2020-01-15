import React, { useRef, useState, useEffect, useMemo, memo } from 'react';
import styled from 'styled-components';
import style from '../../assets/global-style';
import { debounce } from './../../api/utils';

const SearchBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  padding-right: 20px;
  height: 40px;
  background: ${style["theme-color"]};
  .icon-back{
    font-size: 24px;
    color: ${style["font-color-light"]};
  }
  .box{
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: ${style["theme-color"]};
    color: ${style["highlight-background-color"]};
    font-size: ${style["font-size-m"]};
    outline: none;
    border: none;
    border-bottom: 1px solid ${style["border-color"]};
    &::placeholder{
      color: ${style["font-color-light"]};
    }
  }
  .icon-delete{
    font-size: 16px;
    color: ${style["background-color"]};
  }
`

const SearchBox = (props: BaseUI.SearchBox) => {
  const queryRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const { newQuery } = props;
  const { onQuery } = props;
  // 根据关键字是否存在决定清空按钮的显示 / 隐藏 
  const displayStyle = query ? { display: 'block' } : { display: 'none' };

  // TODO  1.进场时 input 框应该出现光标;2.内容改变时要执行父组件传来的回调;3.当父组件点击热门搜索中的关键词时，如果新关键词与现在的 query 不同，则修改 query 并执行回调
  useEffect(() => {
    const queryDom = queryRef.current
    if (!queryDom) return
    queryDom.focus();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value)
    // 搜索框内容改变时的逻辑
    setQuery(e.currentTarget.value);
  };

  // 缓存方法
  let handleQueryDebounce = useMemo(() => {
    return debounce(onQuery, 500);
  }, [onQuery]);

  useEffect(() => {
    // 注意防抖
    handleQueryDebounce(query);
    // TODO 此处不能监听handleQueryDebounce,因其有500ms延迟，延迟后函数变化，导致此方法重复执行
    // eslint-disable-next-line
  }, [query]);

  // 当父组件点击热门搜索中的关键词时，如果新关键词与现在的 query 不同，则修改 query 并执行回调
  useEffect(() => {
    if (newQuery !== query) {
      setQuery(newQuery);
    }
    // TODO 此处不能监听query,导致不能赋值
    // eslint-disable-next-line
  }, [newQuery]);

  const clearQuery = () => {
    const queryDom = queryRef.current
    if (!queryDom) return
    // 清空框内容的逻辑
    setQuery('');
    queryDom.focus();
  }
  return (
    <SearchBoxWrapper>
      <i className="iconfont icon-back" onClick={() => props.back()}>&#xe655;</i>
      <input ref={queryRef} className="box" placeholder="搜索歌曲、歌手、专辑" value={query} onChange={handleChange} />
      <i className="iconfont icon-delete" onClick={clearQuery} style={displayStyle}>&#xe600;</i>
    </SearchBoxWrapper>
  )
};

export default memo(SearchBox)