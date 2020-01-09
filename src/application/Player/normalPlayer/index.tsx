import React, { useRef } from "react";
import { getName, prefixStyle, formatPlayTime } from "../../../api/utils";
import {
    NormalPlayerContainer,
    Middle,
    Bottom,
    Operators,
    CDWrapper,
    ProgressWrapper,
} from "./style";
import { CSSTransition } from "react-transition-group";
// @ts-ignore
import animations from "create-keyframe-animation";
import Header from "../../../baseUI/header"
import ProgressBar from "../../../baseUI/progress-bar";
import { useHistory } from "react-router";
import { playMode } from "../../../api/config";

function NormalPlayer(props: CloudMusic.NormalPlayer) {
    const { song, fullScreen, playing, percent, duration, currentTime, mode } = props;
    const { togglePlayList, toggleFullScreen, togglePlaying, onProgressChange, onNext, onPrev, changeMode } = props;
    const normalPlayerRef = useRef<HTMLDivElement>(null);
    const cdWrapperRef = useRef<HTMLDivElement>(null);

    const transform = prefixStyle("transform");

    // 启用帧动画
    const enter = () => {
        const normalPlayerDom = normalPlayerRef.current
        const cdWrapperDom = cdWrapperRef.current;
        if (!normalPlayerDom || !cdWrapperDom) {
            return
        }
        normalPlayerDom.style.display = "block";
        const { x, y, scale } = _getPosAndScale();// 获取 miniPlayer 图片中心相对 normalPlayer 唱片中心的偏移
        let animation = {
            0: {
                transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
            },
            60: {
                transform: `translate3d(0, 0, 0) scale(1.1)`
            },
            100: {
                transform: `translate3d(0, 0, 0) scale(1)`
            }
        };
        animations.registerAnimation({
            name: "move",
            animation,
            presets: {
                duration: 400,
                easing: "linear"
            }
        });
        animations.runAnimation(cdWrapperDom, "move");
    };

    const afterEnter = () => {
        // 进入后解绑帧动画
        const cdWrapperDom = cdWrapperRef.current;
        if (!cdWrapperDom) {
            return
        }
        animations.unregisterAnimation("move");
        cdWrapperDom.style.animation = "";
    };

    const leave = () => {
        const cdWrapperDom = cdWrapperRef.current;
        if (!cdWrapperDom || !transform) {
            return;
        }
        cdWrapperDom.style.transition = "all .4s";
        const { x, y, scale } = _getPosAndScale();
        cdWrapperDom.style[transform as any] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    };

    const afterLeave = () => {
        const cdWrapperDom = cdWrapperRef.current;
        const normalPlayerDom = normalPlayerRef.current;
        if (!cdWrapperDom || !normalPlayerDom || !transform) {
            return
        }
        cdWrapperDom.style.transition = "";
        cdWrapperDom.style[transform as any] = "";
        // 一定要注意现在要把 normalPlayer 这个 DOM 给隐藏掉，因为 CSSTransition 的工作只是把动画执行一遍 
        // 不置为 none 现在全屏播放器页面还是存在
        normalPlayerDom.style.display = "none";
    };
    // 计算偏移的辅助函数
    const _getPosAndScale = () => {
        const miniCircleWidth = 40;
        // mini圆距左边界距离
        const paddingLeft = 20
        // mini圆心距左边界距离
        const miniCircleLeft = miniCircleWidth / 2 + paddingLeft;
        const miniPlayerHeight = 60
        // mini圆心距下边界距离
        const miniCircleBottom = miniPlayerHeight / 2;
        // Middle组件距上下边界距离
        const MiddleTop = 80
        const MiddleBottom = 170
        // NormalPlayer 距Middle上边界距离
        const normalPlayerTop = (window.innerHeight - MiddleTop - MiddleBottom) / 10
        const width = window.innerWidth * 0.8;
        const scale = miniCircleWidth / width;

        // 两个圆心的横坐标距离和纵坐标距离
        const x = -(window.innerWidth / 2 - miniCircleLeft);
        const y = window.innerHeight - MiddleTop - normalPlayerTop - width / 2 - miniCircleBottom;
        return {
            x,
            y,
            scale
        };
    };

    const history = useHistory()
    const enterDetail = (id: number) => {
        history.push(`/singers/${id}`);
    };
    const getPlayMode = () => {
        let content;
        if (mode === playMode.sequence) {
            content = "&#xe625;";
        } else if (mode === playMode.loop) {
            content = "&#xe653;";
        } else {
            content = "&#xe61b;";
        }
        return content;
    };

    return (
        <CSSTransition
            classNames="normal"
            in={fullScreen}
            timeout={400}
            mountOnEnter
            onEnter={enter}
            onEntered={afterEnter}
            onExit={leave}
            onExited={afterLeave}
        >
            <NormalPlayerContainer ref={normalPlayerRef}>
                <Header onBack={() => toggleFullScreen(false)} title={song.name} subtitle={getName(song.ar)} onClick={() => enterDetail(song.id)}></Header>
                <div className="background">
                    <img
                        src={song.al.picUrl + "?param=300x300"}
                        width="100%"
                        height="100%"
                        alt="歌曲图片"
                    />
                </div>
                <div className="background layer"></div>
                {/* <Top className="top">
                    <div className="back" onClick={() => toggleFullScreen(false)}>
                        <i className="iconfont icon-back">&#xe655;</i>
                    </div>
                    <h1 className="title">{song.name}</h1>
                    <h1 className="subtitle">{getName(song.ar)}</h1>
                </Top> */}
                <Middle ref={cdWrapperRef}>
                    <CDWrapper>
                        <div className="cd">
                            <img
                                className={`image play ${playing ? "" : "pause"}`}
                                src={song.al.picUrl + "?param=400x400"}
                                alt=""
                            />
                        </div>
                    </CDWrapper>
                </Middle>

                <Bottom className="bottom">
                    <ProgressWrapper>
                        <span className="time time-l">{formatPlayTime(currentTime)}</span>
                        <div className="progress-bar-wrapper">
                            <ProgressBar
                                percent={percent}
                                percentChange={onProgressChange} />
                        </div>
                        <div className="time time-r">{formatPlayTime(duration)}</div>
                    </ProgressWrapper>
                    <Operators>
                        <div className="icon i-left" onClick={changeMode}>
                            <i
                                className="iconfont"
                                dangerouslySetInnerHTML={{ __html: getPlayMode() }}
                            ></i>
                        </div>
                        <div className="icon i-left" onClick={onPrev}>
                            <i className="iconfont">&#xe6e1;</i>
                        </div>
                        <div className="icon i-center">
                            <i
                                className="iconfont"
                                onClick={e => togglePlaying(e, !playing)}
                                dangerouslySetInnerHTML={{
                                    __html: playing ? "&#xe723;" : "&#xe731;"
                                }}
                            ></i>
                        </div>
                        <div className="icon i-right" onClick={onNext}>
                            <i className="iconfont">&#xe718;</i>
                        </div>
                        <div className="icon i-right" onClick={() => togglePlayList (true)}>
                            <i className="iconfont">&#xe640;</i>
                        </div>
                    </Operators>
                </Bottom>
            </NormalPlayerContainer>
        </CSSTransition>
    );
}
export default React.memo(NormalPlayer);