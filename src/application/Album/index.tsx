import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Container, Menu, TopDesc } from './style';
import { CSSTransition } from 'react-transition-group';
import { useHistory, useParams } from 'react-router-dom';
import Header from './../../baseUI/header/index';
import Scroll from '../../baseUI/scroll/index';
import { getCount, isEmptyObject } from '../../api/utils';
import style from '../../assets/global-style';
import { useSelector, useDispatch } from 'react-redux';
import * as actionTypes from './store/actionCreators';
import Loading from '../../baseUI/loading/index';
import SongList from '../SongList';
import MusicNote, { MusicNoteHandles } from "../../baseUI/music-note/index";

function Album() {
    const [showStatus, setShowStatus] = useState(true);
    const [title, setTitle] = useState("歌单");
    const [isMarquee, setIsMarquee] = useState(false);// 是否开启跑马灯
    const musicNoteRef = useRef<MusicNoteHandles>(null);
    const currentAlbum = useSelector((state: any) => state.getIn(['album', 'currentAlbum']))
    const enterLoading = useSelector((state: any) => state.getIn(['album', 'enterLoading']))
    const songsCount = useSelector((state: any) => state.getIn(['player', 'playList']).size)
    const currentAlbumJS = currentAlbum.toJS();

    const dispatch = useDispatch()

    const headerEl = useRef<HTMLDivElement>(null);

    let history = useHistory();
    // 从路由中拿到歌单的 id
    const { id } = useParams()

    useEffect(() => {
        if (!id) {
            console.log("参数错误！")
        } else {
            dispatch(actionTypes.changeEnterLoading(true));
            dispatch(actionTypes.getAlbumList(id));
        }
    }, [dispatch, id]);

    // TODO [官方 https://zh-hans.reactjs.org/docs/hooks-reference.html#usecallback] 把内联回调函数及依赖项数组作为参数传入 useCallback，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 shouldComponentUpdate）的子组件时，它将非常有用。
    // [https://zhuanlan.zhihu.com/p/56975681] useCallback 的真正目的还是在于缓存了每次渲染时 inline callback 的实例，这样方便配合上子组件的 shouldComponentUpdate 或者 React.memo 起到减少不必要的渲染的作用。需要不断提醒自己注意的是，在大部分 callback 都会是 inline callback 的未来，React.memo 和 React.useCallback 一定记得需要配对使用，缺了一个都可能导致性能不升反“降”，毕竟无意义的浅比较也是要消耗那么一点点点的性能
    // 以此为例，如果不用 useCallback 包裹，父组件每次执行时会生成不一样的 handleBack 和 handleScroll 函数引用，那么子组件每一次 memo 的结果都会不一样，导致不必要的重新渲染，也就浪费了 memo 的价值。
    // 因此 useCallback 能够帮我们在依赖不变的情况保持一样的函数引用，最大程度地节约浏览器渲染性能。
    const onBack = useCallback(() => {
        setShowStatus(false);
    }, []);

    const HEADER_HEIGHT = 45;

    const onScroll = useCallback((pos: { y: number; }) => {
        let minScrollY = -HEADER_HEIGHT;
        let percent = Math.abs(pos.y / minScrollY);
        let headerDom = headerEl.current;
        if (!headerDom) {
            return
        }
        // 滑过顶部的高度开始变化
        if (pos.y < minScrollY) {
            headerDom.style.backgroundColor = style["theme-color"];
            headerDom.style.opacity = Math.min(1, (percent - 1) / 2).toString();
            setTitle(currentAlbumJS.name);
            setIsMarquee(true);
        } else {
            headerDom.style.backgroundColor = "";
            headerDom.style.opacity = "1";
            setTitle("歌单");
            setIsMarquee(false);
        }
    }, [currentAlbumJS.name]);

    const renderTopDesc = () => {
        return (
            <TopDesc background={currentAlbumJS.coverImgUrl}>
                <div className="background">
                    <div className="filter"></div>
                </div>
                <div className="img_wrapper">
                    <div className="decorate"></div>
                    <img src={currentAlbumJS.coverImgUrl} alt="" />
                    <div className="play_count">
                        <i className="iconfont play">&#xe885;</i>
                        <span className="count">{getCount(currentAlbumJS.playCount)}</span>
                    </div>
                </div>
                <div className="desc_wrapper">
                    <div className="title">{currentAlbumJS.name}</div>
                    <div className="person">
                        <div className="avatar">
                            <img src={currentAlbumJS.creator.avatarUrl} alt="" />
                        </div>
                        <div className="name">{currentAlbumJS.creator.nickname}</div>
                    </div>
                </div>
            </TopDesc>
        )
    }

    const renderMenu = () => {
        return (
            <Menu>
                <div>
                    <i className="iconfont">&#xe6ad;</i>
                    评论
</div>
                <div>
                    <i className="iconfont">&#xe86f;</i>
                    点赞
</div>
                <div>
                    <i className="iconfont">&#xe62d;</i>
                    收藏
</div>
                <div>
                    <i className="iconfont">&#xe606;</i>
                    更多
</div>
            </Menu>
        )
    }

    const musicAnimation = (x: number, y: number) => {
        if (!musicNoteRef.current) return
        musicNoteRef.current.startAnimation({ x, y });
    };
    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            classNames="fly"
            appear
            unmountOnExit
            onExited={history.goBack}
        >
            <Container play={songsCount}>
                <Header ref={headerEl} isMarquee={isMarquee} title={title} onBack={onBack}></Header>
                {!isEmptyObject(currentAlbumJS) ? (
                    <Scroll bounceTop={false} onScroll={onScroll}>
                        <div>
                            {renderTopDesc()}
                            {renderMenu()}
                            <SongList
                                showCollect
                                showBackground
                                collectCount={currentAlbumJS.subscribedCount}
                                songs={currentAlbumJS.tracks}
                                musicAnimation={musicAnimation}></SongList>
                        </div>
                    </Scroll>
                ) : null}
                {enterLoading ? <Loading></Loading> : null}
                <MusicNote ref={musicNoteRef}></MusicNote>
            </Container>
        </CSSTransition>
    )
}

export default React.memo(Album);