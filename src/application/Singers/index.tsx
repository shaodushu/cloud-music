import React, { useEffect, useContext } from 'react';
import Horizen from '../../baseUI/horizen-item';
import { categoryTypes, alphaTypes } from '../../api/config';
import {
    NavContainer,
    ListContainer,
    List,
    ListItem
} from "./style";
import Scroll from '../../baseUI/scroll'
import { useSelector, useDispatch } from "react-redux";
import * as actionTypes from './store/actionCreators';
import Loading from '../../baseUI/loading';
import { CategoryDataContext, CHANGE_ALPHA, CHANGE_CATEGORY } from './data';
import { useHistory } from 'react-router';
import { renderRoutes } from 'react-router-config';
import LazyLoad, { forceCheck } from 'react-lazyload';

//TODO 思考题：当我们切换组件的时候，事实上现在的 category 和 alpha 会丢失，如果想要切换组件后仍然能够缓存 category 和 alpha 的值应该怎么做？可以自己动手试试看。
//使用记忆化(memoizing) selector [https://www.jianshu.com/p/8a0e6c8fd111]

function Singers(props: any) {
    // let [category, setCategory] = useState('');
    // let [alpha, setAlpha] = useState('');
    const { data, customDispatch }: any = useContext(CategoryDataContext);
    // category 与 alpha 的值从自定义redux中获取
    // 拿到 category 和 alpha 的值
    const { category, alpha } = data.toJS();

    const singerList = useSelector((state: any) => state.getIn(['singers', 'singerList']))
    const enterLoading = useSelector((state: any) => state.getIn(['singers', 'enterLoading']))
    const pullUpLoading = useSelector((state: any) => state.getIn(['singers', 'pullUpLoading']))
    const pullDownLoading = useSelector((state: any) => state.getIn(['singers', 'pullDownLoading']))
    const pageCount = useSelector((state: any) => state.getIn(['singers', 'pageCount']))
    const songsCount = useSelector((state: any) => state.getIn(['player', 'playList']).size)

    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        // 歌手列表页的数据缓存
        if (!singerList.size) {
            dispatch(actionTypes.getHotSingerList());
        }
    }, [dispatch, singerList.size]);

    const singerListJS = singerList ? singerList.toJS() : [];

    const enterDetail = (id: number) => {
        history.push(`/singers/${id}`);
    };

    // 渲染函数，返回歌手列表
    const renderSingerList = () => {
        return (
            <List>
                {
                    singerListJS.map((item: { id: number, accountId: string; picUrl: any; name: React.ReactNode; }, index: number) => {
                        return (
                            <ListItem key={item.accountId + '' + index} onClick={() => enterDetail(item.id)}>
                                <div className="img_wrapper">
                                    <LazyLoad throttle={200} height={50}>
                                        <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music" />
                                    </LazyLoad>
                                </div>
                                <span className="name">{item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };

    const updateDispatch = (category: string, alpha: string) => {
        dispatch(actionTypes.changePageCount(0));//由于改变了分类，所以pageCount清零
        dispatch(actionTypes.changeEnterLoading(true));//loading，现在实现控制逻辑，效果实现放到下一节，后面的loading同理
        dispatch(actionTypes.getSingerList(category, alpha));
    }
    //滑到最底部刷新部分的处理
    const pullUpRefreshDispatch = (category: any, alpha: string, hot: any, count: number) => {
        dispatch(actionTypes.changePullUpLoading(true));
        dispatch(actionTypes.changePageCount(count + 1));
        if (hot) {
            dispatch(actionTypes.refreshMoreHotSingerList());
        } else {
            dispatch(actionTypes.refreshMoreSingerList(category, alpha));
        }
    }
    //顶部下拉刷新
    const pullDownRefreshDispatch = (category: string, alpha: string) => {
        dispatch(actionTypes.changePullDownLoading(true));
        dispatch(actionTypes.changePageCount(0));//属于重新获取数据
        if (category === '' && alpha === '') {
            dispatch(actionTypes.getHotSingerList());
        } else {
            dispatch(actionTypes.getSingerList(category, alpha));
        }
    }

    const onUpdateAlpha = (val: string) => {
        customDispatch({ type: CHANGE_ALPHA, data: val });
        updateDispatch(category, val);
    };

    const onUpdateCatetory = (val: string) => {
        customDispatch({ type: CHANGE_CATEGORY, data: val });
        updateDispatch(val, alpha);
    };

    const onPullUp = () => {
        pullUpRefreshDispatch(category, alpha, category === '', pageCount);
    };

    const onPullDown = () => {
        pullDownRefreshDispatch(category, alpha);
    };
    return (
        <div>
            <NavContainer>
                <Horizen
                    list={categoryTypes}
                    title={"分类 (默认热门):"}
                    onClick={(val) => onUpdateCatetory(val)}
                    oldVal={category}></Horizen>
                <Horizen
                    list={alphaTypes}
                    title={"首字母:"}
                    onClick={(val) => onUpdateAlpha(val)} oldVal={alpha}></Horizen>
            </NavContainer>
            <ListContainer play={songsCount}
            
            >
                <Scroll
                    onScroll={forceCheck}
                    pullUp={onPullUp}
                    pullDown={onPullDown}
                    pullUpLoading={pullUpLoading}
                    pullDownLoading={pullDownLoading}>
                    {renderSingerList()}
                </Scroll>
                {enterLoading ? <Loading></Loading> : null}
            </ListContainer>
            {renderRoutes(props.route.routes)}
        </div>
    )
}

export default React.memo(Singers);