import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useHistory, useParams } from 'react-router';
import { Container, ImgWrapper, CollectButton, SongListWrapper, BgLayer } from './style';
import Header from "../../baseUI/header";
import Scroll, { ScrollHanles } from "../../baseUI/scroll"
import SongsList from "../SongList"
import { HEADER_HEIGHT } from "./../../api/config";
import { useSelector, useDispatch } from 'react-redux';
import * as actionTypes from './store/actionCreators';
import Loading from "./../../baseUI/loading/index";
import MusicNote, { MusicNoteHandles } from '../../baseUI/music-note';

function Singer() {
    const [showStatus, setShowStatus] = useState(true);
    const history = useHistory();
    const collectButton = useRef<HTMLDivElement>(null);
    const imageWrapper = useRef<HTMLDivElement>(null);
    const songScrollWrapper = useRef<HTMLDivElement>(null);
    const songScroll = useRef<ScrollHanles>(null);
    const header = useRef<HTMLDivElement>(null);
    const layer = useRef<HTMLDivElement>(null);
    const musicNoteRef = useRef<MusicNoteHandles>(null);
    const artist = useSelector((state: any) => state.getIn(['singerInfo', 'artist']))
    const songs = useSelector((state: any) => state.getIn(['singerInfo', 'songsOfArtist']))
    const loading = useSelector((state: any) => state.getIn(['singerInfo', 'loading']))
    const songsCount = useSelector((state: any) => state.getIn(['player', 'playList']).size)

    const artistJS = artist.toJS()
    const songsJS = songs.toJS()
    // 图片初始高度
    const initialHeight = useRef(0);
    // 往上偏移的尺寸，露出圆角
    const OFFSET = 25;

    useEffect(() => {
        if (!imageWrapper.current || !songScrollWrapper.current || !layer.current || !songScroll.current) {
            return
        }
        // TODO 由于歌曲列表是相对于 Container 绝对定位且 top 为 0，因此初始化时，我们将歌曲列表的 top 设置为整个图片的高度，正好处在图片下方，不然列表就会与图片重叠。
        let h = imageWrapper.current.offsetHeight;
        songScrollWrapper.current.style.top = `${h - OFFSET}px`;
        initialHeight.current = h;
        // 把遮罩先放在下面，以裹住歌曲列表
        // 在歌手页的布局中，歌单列表其实是没有自己的背景的，layerDOM 其实是起一个遮罩的作用，给歌单内容提供白色背景 因此在处理的过程中，随着内容的滚动，遮罩也跟着移动
        layer.current.style.top = `${h - OFFSET}px`;
        songScroll.current.refresh();
    }, []);

    const dispatch = useDispatch()
    const { id } = useParams()

    useEffect(() => {
        if (!id) {
            console.log("参数错误！")
        } else {
            dispatch(actionTypes.changeEnterLoading(true));
            dispatch(actionTypes.getSingerInfo(id));
        }
    }, [dispatch, id]);

    const setShowStatusFalse = useCallback(() => {
        setShowStatus(false);
    }, []);
    const onScroll = useCallback((pos: { y: any; }) => {
        let height = initialHeight.current;
        const newY = pos.y;
        const imageDOM = imageWrapper.current;
        const buttonDOM = collectButton.current;
        const headerDOM = header.current;
        const layerDOM = layer.current;
        const songScrollDOM = songScrollWrapper.current
        const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;

        if (!imageDOM || !buttonDOM || !headerDOM || !layerDOM || !songScrollDOM) {
            return
        }
        // 指的是滑动距离占图片高度的百分比
        const percent = Math.abs(newY / height);
        // 图片透明度变化
        const brightness = 0.1
        // 处理往下拉的情况，效果：图片放大，按钮跟着偏移
        if (newY > 0) {
            imageDOM.style["transform"] = `scale(${1 + percent})`;
            buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
            layerDOM.style.top = `${height - OFFSET + newY}px`;
        } else if (newY >= minScrollY) {
            //设置遮罩层距离顶部导航栏高度
            layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
            // 这时候保证遮罩的层叠优先级比图片高，不至于被图片挡住
            layerDOM.style.zIndex = "1";
            imageDOM.style.paddingTop = "75%";
            imageDOM.style.height = "0";
            imageDOM.style.zIndex = "-1";
            imageDOM.style["filter"] = `brightness(${1 - percent * (1 - brightness)})`;
            // 按钮跟着移动且渐渐变透明
            buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
            buttonDOM.style["opacity"] = `${1 - percent * 2}`;
        } else if (newY < minScrollY) {
            // 往上滑动，但是超过 Header 部分
            layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
            layerDOM.style.zIndex = "1";
            // 防止溢出的歌单内容遮住 Header
            headerDOM.style.zIndex = "100";
            // 此时图片高度与 Header 一致
            imageDOM.style.height = `${HEADER_HEIGHT}px`;
            imageDOM.style.paddingTop = "0";
            imageDOM.style.zIndex = "99";
        }
    }, [])

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
                <Header ref={header} title={artistJS.name} onBack={setShowStatusFalse}></Header>
                <ImgWrapper ref={imageWrapper} bgUrl={artistJS.picUrl}>
                    <div className="filter"></div>
                </ImgWrapper>
                <CollectButton ref={collectButton}>
                    <i className="iconfont">&#xe62d;</i>
                    <span className="text"> 收藏 </span>
                </CollectButton>
                <BgLayer ref={layer}></BgLayer>
                <SongListWrapper ref={songScrollWrapper}>
                    <Scroll ref={songScroll} onScroll={onScroll}>
                        <SongsList
                            showBackground
                            songs={songsJS}
                            showCollect={false}
                            musicAnimation={musicAnimation}
                        ></SongsList>
                    </Scroll>
                </SongListWrapper>
                {loading ? <Loading></Loading> : null}
                <MusicNote ref={musicNoteRef}></MusicNote>
            </Container>
        </CSSTransition>
    )
}

export default React.memo(Singer);