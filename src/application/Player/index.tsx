import React, { useState, useRef, useEffect, useCallback } from 'react'
import * as actionTypes from './store/actionCreators';
import { useSelector, useDispatch } from 'react-redux';
import MiniPlayer from './miniPlayer';
import NormalPlayer from './normalPlayer'
import PlayList from "./playList";
import { getSongUrl, isEmptyObject, findIndex, shuffle } from "../../api/utils";
import Toast, { ToastHanles } from "./../../baseUI/toast/index";
import { playMode } from '../../api/config';
import { getLyricRequest } from '../../api/request';
import Lyric from "../../api/lyric-parser";

function Player() {
    // 目前播放时间
    const [currentTime, setCurrentTime] = useState(0);
    // 歌曲总时长
    const [duration, setDuration] = useState(0);
    // 歌曲播放进度
    let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;
    // 当前播放歌曲
    const [preSong, setPreSong] = useState({});
    // 播放模式
    const [modeText, setModeText] = useState("");
    const currentLyric = useRef<Lyric>(null);
    const toastRef = useRef<ToastHanles>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const fullScreen = useSelector((state: any) => state.getIn(['player', 'fullScreen']))
    const playing = useSelector((state: any) => state.getIn(['player', 'playing']))
    const currentSong = useSelector((state: any) => state.getIn(['player', 'currentSong']))
    // const showPlayList = useSelector((state: any) => state.getIn(['player', 'showPlayList']))
    const mode = useSelector((state: any) => state.getIn(['player', 'mode']))
    const currentIndex = useSelector((state: any) => state.getIn(['player', 'currentIndex']))
    const playList = useSelector((state: any) => state.getIn(['player', 'playList']))
    const sequencePlayList = useSelector((state: any) => state.getIn(['player', 'sequencePlayList']))

    // TODO 你或许也会偶尔想要避免重新创建 useRef() 的初始值。举个例子，或许你想确保某些命令式的 class 实例只被创建一次 useRef 不会 像 useState 那样接受一个特殊的函数重载。相反，你可以编写你自己的函数来创建并将其设为惰性的：
    const songReady = useRef(true);
    const dispatch = useDispatch()
    const currentSongJS = currentSong.toJS()
    const playListJS = playList.toJS()
    const sequencePlayListJS = sequencePlayList.toJS()

    // 即时歌词
    const [currentPlayingLyric, setPlayingLyric] = useState("");
    // 记录当前行数
    const currentLineNum = useRef(0);

    const getLyric = useCallback((id: number) => {
        const audioDom = audioRef.current;
        if (!audioDom) {
            return
        }
        let lyric = "";
        if (currentLyric.current) {
            currentLyric.current.stop();
        }
        // 避免 songReady 恒为 false 的情况
        getLyricRequest(id)
            .then((data: any) => {
                lyric = data.lrc.lyric;
                if (!lyric) {
                    // @ts-ignore
                    currentLyric.current = null;
                    return;
                }
                // @ts-ignore
                currentLyric.current = new Lyric(lyric, handleLyric);
                currentLyric.current.play();
                currentLineNum.current = 0;
                currentLyric.current.seek(0);
            })
            .catch(() => {
                songReady.current = true;
                audioDom.play();
            });
    }, [])

    const handleLyric = ({ lineNum, txt }: { lineNum: number, txt: string }) => {
        if (!currentLyric.current) return;
        currentLineNum.current = lineNum;
        console.log(lineNum, txt)
        setPlayingLyric(txt);
    };

    useEffect(() => {
        const audioDom = audioRef.current;

        // @ts-ignore
        if (!playListJS.length || currentIndex === -1 || !playListJS[currentIndex] || (playListJS && (playListJS[currentIndex].id === preSong.id)) || !songReady.current || !audioDom) {
            return;
        }
        songReady.current = false;
        // 避免songReady恒为false的情况
        setTimeout(() => {
            songReady.current = true;
        });
        let current = playListJS[currentIndex];
        dispatch(actionTypes.changeCurrentSong(current))// 赋值 currentSongJS
        setPreSong(current);

        audioDom.src = getSongUrl(current.id);
        audioDom.autoplay = true;

        dispatch(actionTypes.changePlayingState(true));// 播放状态
        getLyric(current.id)
        setCurrentTime(0);// 从头开始播放
        setDuration((current.dt / 1000) | 0);// 时长
    }, [currentIndex, dispatch, getLyric, playListJS, preSong]);

    useEffect(() => {
        const audioDom = audioRef.current;
        if (!audioDom) {
            return
        }
        playing ? audioDom.play() : audioDom.pause();
    }, [dispatch, playing]);

    const onToggleFullScreen = (data: any) => {
        dispatch(actionTypes.changeFullScreen(data));
    }

    const onTogglePlaying = (e: React.MouseEvent, state: boolean) => {
        e.stopPropagation();
        dispatch(actionTypes.changePlayingState(state))
        // 歌曲暂停 / 播放
        if (currentLyric.current) {
            currentLyric.current.togglePlay(currentTime * 1000);
        }
    }

    const onTogglePlayList = (state: any) => {
        dispatch(actionTypes.changeShowPlayList(state))
    }

    const onUpdateTime = (e: React.SyntheticEvent<HTMLMediaElement, Event>) => {
        setCurrentTime(e.currentTarget.currentTime);
    };


    const onProgressChange = (curPercent: number) => {
        const audioDom = audioRef.current;
        if (!audioDom) {
            return
        }
        const newTime = curPercent * duration;
        setCurrentTime(newTime);
        audioDom.currentTime = newTime;
        if (!playing) {
            dispatch(actionTypes.changePlayingState(true));// 播放状态
        }
        // 歌曲进度更新:
        if (currentLyric.current) {
            currentLyric.current.seek(newTime * 1000);
        }
    };

    // 一首歌循环
    const handleLoop = () => {
        const audioDom = audioRef.current;
        if (!audioDom) {
            return
        }
        audioDom.currentTime = 0;
        dispatch(actionTypes.changePlayingState(true));
        audioDom.play();
    };

    const handlePrev = () => {
        // 播放列表只有一首歌时单曲循环
        if (playListJS.length === 1) {
            handleLoop();
            return;
        }
        let index = currentIndex - 1;
        if (index < 0) index = playListJS.length - 1;
        if (!playing) dispatch(actionTypes.changePlayingState(true));
        dispatch(actionTypes.changeCurrentIndex(index))
    };

    const handleNext = () => {
        // 播放列表只有一首歌时单曲循环
        if (playListJS.length === 1) {
            handleLoop();
            return;
        }
        let index = currentIndex + 1;
        if (index === playListJS.length) index = 0;
        if (!playing) dispatch(actionTypes.changePlayingState(true));
        dispatch(actionTypes.changeCurrentIndex(index))
    };

    const handleError = () => {
        songReady.current = true;
        handleNext();
        alert("播放出错");
    };

    const changeMode = () => {
        let newMode = (mode + 1) % 3;
        if (newMode === 0) {
            // 顺序模式
            dispatch(actionTypes.changePlayList(sequencePlayListJS))
            let index = findIndex(currentSongJS, sequencePlayListJS);
            dispatch(actionTypes.changeCurrentIndex(index))
            setModeText("顺序循环");
        } else if (newMode === 1) {
            // 单曲循环
            dispatch(actionTypes.changePlayList(sequencePlayListJS))
            setModeText("单曲循环");
        } else if (newMode === 2) {
            // 随机播放
            let newList = shuffle(sequencePlayListJS);
            let index = findIndex(currentSongJS, newList);
            dispatch(actionTypes.changePlayList(newList))
            dispatch(actionTypes.changeCurrentIndex(index))
            setModeText("随机播放");
        }
        dispatch(actionTypes.changePlayMode(newMode))
        if (!toastRef.current) {
            return
        }
        toastRef.current.show();
    };

    const handleEnd = () => {
        if (mode === playMode.loop) {
            handleLoop();
        } else {
            handleNext();
        }
    };

    return (
        <div>
            {isEmptyObject(currentSongJS) ? null :
                <MiniPlayer
                    song={currentSongJS}
                    fullScreen={fullScreen}
                    playing={playing}
                    duration={duration}// 总时长
                    currentTime={currentTime}// 播放时间
                    percent={percent}
                    togglePlaying={onTogglePlaying}
                    toggleFullScreen={onToggleFullScreen}
                    togglePlayList={onTogglePlayList}
                />
            }
            {isEmptyObject(currentSongJS) ? null :
                <NormalPlayer
                    song={currentSongJS}
                    mode={mode}
                    fullScreen={fullScreen}
                    playing={playing}
                    duration={duration}// 总时长
                    currentTime={currentTime}// 播放时间
                    currentLyric={currentLyric.current}
                    currentPlayingLyric={currentPlayingLyric}
                    currentLineNum={currentLineNum.current}
                    percent={percent}
                    togglePlaying={onTogglePlaying}
                    toggleFullScreen={onToggleFullScreen}
                    onProgressChange={onProgressChange}
                    togglePlayList={onTogglePlayList}
                    changeMode={changeMode}
                    onNext={handleNext}
                    onPrev={handlePrev}
                />
            }
            <audio ref={audioRef} onTimeUpdate={onUpdateTime} onError={handleError} onEnded={handleEnd}></audio>
            <Toast text={modeText} ref={toastRef}></Toast>
            <PlayList></PlayList>
        </div>
    )
}

export default React.memo(Player)