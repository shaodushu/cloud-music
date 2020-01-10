import React, { useCallback, useRef, useState } from 'react';
import { PlayListWrapper, ScrollWrapper, ListHeader, ListContent } from './style';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { prefixStyle, getName, findIndex, shuffle } from '../../../api/utils';
import * as actionTypes from '../store/actionCreators';
import { playMode } from '../../../api/config';
import Scroll, { ScrollHanles } from '../../../baseUI/scroll'
import Confirm, { ConfirmProps } from '../../../baseUI/confirm';

function PlayList() {
    const currentIndex = useSelector((state: any) => state.getIn(['player', 'currentIndex']))
    const currentSong = useSelector((state: any) => state.getIn(['player', 'currentSong']))
    const playList = useSelector((state: any) => state.getIn(['player', 'playList']))
    const sequencePlayList = useSelector((state: any) => state.getIn(['player', 'sequencePlayList']))
    const showPlayList = useSelector((state: any) => state.getIn(['player', 'showPlayList']))
    const mode = useSelector((state: any) => state.getIn(['player', 'mode']))
    const playListRef = useRef<HTMLDivElement>(null);
    const listWrapperRef = useRef<HTMLDivElement>(null);
    const confirmRef = useRef<ConfirmProps>(null);
    const [isShow, setIsShow] = useState(false);

    const dispatch = useDispatch()
    const transform = prefixStyle("transform");

    const currentSongJS = currentSong.toJS();
    const playListJS = playList.toJS();
    const sequencePlayListJS = sequencePlayList.toJS();

    const onEnterCB = useCallback(() => {
        const listWrapperDom = listWrapperRef.current
        if (!listWrapperDom || !transform) return
        // 让列表显示
        setIsShow(true);
        // 最开始是隐藏在下面
        listWrapperDom.style[transform as any] = `translate3d(0, 100%, 0)`;
    }, [transform]);

    const onEnteringCB = useCallback(() => {
        const listWrapperDom = listWrapperRef.current
        if (!listWrapperDom || !transform) return
        // 让列表展现
        listWrapperDom.style["transition"] = "all 0.3s";
        listWrapperDom.style[transform as any] = `translate3d(0, 0, 0)`;
    }, [transform]);

    const onExitingCB = useCallback(() => {
        const listWrapperDom = listWrapperRef.current
        if (!listWrapperDom || !transform) return
        listWrapperDom.style["transition"] = "all 0.3s";
        listWrapperDom.style[transform as any] = `translate3d(0px, 100%, 0px)`;
    }, [transform]);

    const onExitedCB = useCallback(() => {
        const listWrapperDom = listWrapperRef.current
        if (!listWrapperDom) return
        setIsShow(false);
        listWrapperDom.style[transform as any] = `translate3d(0px, 100%, 0px)`;
    }, [transform]);

    const handleTogglePlayList = (data: boolean) => {
        dispatch(actionTypes.changeShowPlayList(data))
    }

    const getCurrentIcon = (item: { id: any; }) => {
        // 是不是当前正在播放的歌曲
        const current = currentSong.id === item.id;
        const className = current ? 'icon-play' : '';
        const content = current ? '&#xe6e3;' : '';
        return (
            <i className={`current iconfont ${className}`} dangerouslySetInnerHTML={{ __html: content }}></i>
        )
    };
    const getPlayMode = () => {
        let content, text;
        if (mode === playMode.sequence) {
            content = "&#xe625;";
            text = "顺序播放";
        } else if (mode === playMode.loop) {
            content = "&#xe653;";
            text = "单曲循环";
        } else {
            content = "&#xe61b;";
            text = "随机播放";
        }
        return (
            <div>
                <i className="iconfont" onClick={(e) => changeMode(e)} dangerouslySetInnerHTML={{ __html: content }}></i>
                <span className="text" onClick={(e) => changeMode(e)}>{text}</span>
            </div>
        )
    };
    const changeMode = (e: React.MouseEvent) => {
        let newMode = (mode + 1) % 3;
        if (newMode === 0) {
            // 顺序模式
            dispatch(actionTypes.changePlayList(sequencePlayListJS))
            let index = findIndex(currentSong, sequencePlayList);
            dispatch(actionTypes.changeCurrentIndex(index))
        } else if (newMode === 1) {
            // 单曲循环
            dispatch(actionTypes.changePlayList(sequencePlayListJS))
        } else if (newMode === 2) {
            // 随机播放
            let newList = shuffle(sequencePlayList);
            let index = findIndex(currentSong, newList);
            dispatch(actionTypes.changePlayList(newList))
            dispatch(actionTypes.changeCurrentIndex(index))
        }
        dispatch(actionTypes.changePlayMode(newMode))
    };

    const handleChangeCurrentIndex = (index: number) => {
        if (currentIndex === index) return;
        dispatch(actionTypes.changeCurrentIndex(index))
    }

    const handleDeleteSong = (e: React.MouseEvent, song: any) => {
        e.stopPropagation();
        dispatch(actionTypes.deleteSong(song));
    };

    const handleShowClear = () => {
        if (!confirmRef.current) return
        confirmRef.current.show();
    }

    const handleConfirmClear = () => {
        // 1. 清空两个列表
        dispatch(actionTypes.changePlayList([]));
        dispatch(actionTypes.changeSequecePlayList([]));
        // 2. 初始 currentIndex
        dispatch(actionTypes.changeCurrentIndex(-1));
        // 3. 关闭 PlayList 的显示
        dispatch(actionTypes.changeShowPlayList(false));
        // 4. 将当前歌曲置空
        dispatch(actionTypes.changeCurrentSong({}));
        // 5. 重置播放状态
        dispatch(actionTypes.changePlayingState(false));
        //TODO 清空后bottom距离未变化
    }


    // 是否允许滑动事件生效
    const [canTouch, setCanTouch] = useState(true);
    //touchStart 后记录 y 值
    const [startY, setStartY] = useState(0);
    //touchStart 事件是否已经被触发
    const [initialed, setInitialed] = useState(false);
    // 用户下滑的距离
    const [distance, setDistance] = useState(0);

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const listWrapperDom = listWrapperRef.current
        if (!listWrapperDom) return
        if (!canTouch || initialed) return;
        listWrapperDom.style["transition"] = "";
        setStartY(e.nativeEvent.touches[0].pageY);// 记录 y 值
        setInitialed(true);
    };
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const listWrapperDom = listWrapperRef.current
        if (!listWrapperDom) return
        if (!canTouch || !initialed) return;
        let distance = e.nativeEvent.touches[0].pageY - startY;
        if (distance < 0) return;
        setDistance(distance);// 记录下滑距离
        listWrapperDom.style.transform = `translate3d(0, ${distance}px, 0)`;
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        const listWrapperDom = listWrapperRef.current
        if (!listWrapperDom) return
        setInitialed(false);
        // 这里设置阈值为 150px
        if (distance >= 150) {
            // 大于 150px 则关闭 PlayList
            dispatch(actionTypes.changeShowPlayList(false));
        } else {
            // 否则反弹回去
            listWrapperDom.style["transition"] = "all 0.3s";
            listWrapperDom.style[transform as any] = `translate3d(0px, 0px, 0px)`;
        }
    };

    const listContentRef = useRef<ScrollHanles>(null);
    const handleScroll = (pos: { x?: number; y: any; }) => {
        // 只有当内容偏移量为 0 的时候才能下滑关闭 PlayList。否则一边内容在移动，一边列表在移动，出现 bug
        let state = pos.y === 0;
        setCanTouch(state);
    }

    return (
        <CSSTransition
            in={showPlayList}
            timeout={300}
            classNames="list-fade"
            onEnter={onEnterCB}
            onEntering={onEnteringCB}
            onExiting={onExitingCB}
            onExited={onExitedCB}
        >
            <PlayListWrapper
                ref={playListRef}
                style={isShow === true ? { display: "block" } : { display: "none" }}
                onClick={() => handleTogglePlayList(false)}
            >
                <div className="list_wrapper"
                    ref={listWrapperRef}
                    onClick={e => e.stopPropagation()}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <ListHeader>
                        <h1 className="title">
                            {getPlayMode()}
                            <span className="iconfont clear" onClick={handleShowClear}>&#xe63d;</span>
                        </h1>
                    </ListHeader>
                    <ScrollWrapper>
                        <Scroll
                            ref={listContentRef}
                            onScroll={pos => handleScroll(pos)}
                            bounceTop={false}>
                            <ListContent>
                                {
                                    playListJS.map((item: { id: any; name?: any; ar?: any; }, index: any) => {
                                        return (
                                            <li className="item" key={item.id} onClick={() => handleChangeCurrentIndex(index)}>
                                                {getCurrentIcon(item)}
                                                <span className="text">{item.name} - {getName(item.ar)}</span>
                                                <span className="like">
                                                    <i className="iconfont">&#xe601;</i>
                                                </span>
                                                <span className="delete" onClick={(e) => handleDeleteSong(e, item)}>
                                                    <i className="iconfont">&#xe63d;</i>
                                                </span>
                                            </li>
                                        )
                                    })
                                }
                            </ListContent>
                        </Scroll>
                    </ScrollWrapper>
                </div>
                <Confirm
                    ref={confirmRef}
                    text={"是否删除全部？"}
                    cancelBtnText={"取消"}
                    confirmBtnText={"确定"}
                    onConfirm={handleConfirmClear}
                />
            </PlayListWrapper>
        </CSSTransition>
    )
}
export default React.memo(PlayList);