import React, { useCallback, useRef, useState } from 'react';
import { PlayListWrapper, ScrollWrapper, ListHeader, ListContent } from './style';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { prefixStyle, getName } from '../../../api/utils';
import * as actionTypes from '../store/actionCreators';
import { playMode } from '../../../api/config';
import Scroll from '../../../baseUI/scroll'

function PlayList() {
    const currentIndex = useSelector((state: any) => state.getIn(['player', 'currentIndex']))
    const currentSong = useSelector((state: any) => state.getIn(['player', 'currentSong']))
    const playList = useSelector((state: any) => state.getIn(['player', 'playList']))
    const sequencePlayList = useSelector((state: any) => state.getIn(['player', 'sequencePlayList']))
    const showPlayList = useSelector((state: any) => state.getIn(['player', 'showPlayList']))
    const mode = useSelector((state: any) => state.getIn(['player', 'mode']))
    const playListRef = useRef<HTMLDivElement>(null);
    const listWrapperRef = useRef<HTMLDivElement>(null);
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
        // 具体逻辑比较复杂 后面来实现
    };

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
                <div className="list_wrapper" ref={listWrapperRef} >
                    <ListHeader>
                        <h1 className="title">
                            {getPlayMode()}
                            <span className="iconfont clear">&#xe63d;</span>
                        </h1>
                    </ListHeader>
                    <ScrollWrapper>
                        <Scroll>
                            <ListContent>
                                {
                                    playListJS.map((item: { id: any; name?: any; ar?: any; }, index: any) => {
                                        return (
                                            <li className="item" key={item.id}>
                                                {getCurrentIcon(item)}
                                                <span className="text">{item.name} - {getName(item.ar)}</span>
                                                <span className="like">
                                                    <i className="iconfont">&#xe601;</i>
                                                </span>
                                                <span className="delete">
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
            </PlayListWrapper>
        </CSSTransition>
    )
}
export default React.memo(PlayList);