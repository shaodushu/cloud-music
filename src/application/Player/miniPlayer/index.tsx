import React, { useRef } from 'react';
import { getName } from '../../../api/utils';
import { MiniPlayerContainer } from './style';
import { CSSTransition } from 'react-transition-group';
import ProgressCircle from '../../../baseUI/progress-circle'

function MiniPlayer(props: CloudMusic.MiniPlayer) {
  const { song, fullScreen, playing, percent } = props;
  const { toggleFullScreen, togglePlaying, togglePlayList } = props;
  const miniPlayerRef = useRef<HTMLDivElement>(null)

  const setDisplay = (display: string) => {
    if (!miniPlayerRef.current) {
      return
    }
    miniPlayerRef.current.style.display = display;
  }

  const handleTogglePlayList = (e: React.MouseEvent) => {
    togglePlayList(true);
    e.stopPropagation();
  };

  return (
    <CSSTransition
      in={!fullScreen}
      timeout={400}
      classNames="mini"
      onEnter={() => setDisplay("flex")}
      onExited={() => setDisplay("none")}
    >
      <MiniPlayerContainer ref={miniPlayerRef} onClick={() => toggleFullScreen(true)}>
        <div className="icon">
          <div className="imgWrapper">
            <img className={`play ${playing ? "" : "pause"}`} src={song.al.picUrl} width="40" height="40" alt="img" />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song.ar)}</p>
        </div>
        <div className="control">
          <ProgressCircle radius={32} percent={percent}>
            {playing ?
              <i className="icon-mini iconfont icon-pause" onClick={e => togglePlaying && togglePlaying(e, false)}>&#xe650;</i>
              :
              <i className="icon-mini iconfont icon-play" onClick={e => togglePlaying && togglePlaying(e, true)}>&#xe61e;</i>
            }
          </ProgressCircle>
        </div>
        <div className="control" onClick={handleTogglePlayList}>
          <i className="iconfont">&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  )
}

MiniPlayer.defaultProps = {
  percent: 0
}

export default React.memo(MiniPlayer);